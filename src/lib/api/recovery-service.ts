import { supabase } from '@/integrations/supabase/client';

export interface RecoveryOptions {
  id?: string;
  userId: string;
  recoveryEmail?: string;
  backupEmail?: string;
  recoveryPhrase?: boolean;
  socialRecovery?: boolean;
  guardianEmails?: string[];
  requiredGuardians?: number;
  timeDelay?: number; // in hours
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSecuritySettings {
  id?: string;
  userId: string;
  biometricEnabled: boolean;
  otpEnabled: boolean;
  emailNotifications: boolean;
  transactionLimits: {
    daily?: number;
    perTransaction?: number;
  };
  riskTolerance: 'low' | 'medium' | 'high';
  autoLockDuration?: number; // in minutes
  trustedDevices?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export class RecoveryService {
  /**
   * Get user recovery options
   */
  async getRecoveryOptions(userId: string, apiKey: string): Promise<RecoveryOptions | null> {
    // Validate API key
    const isValidKey = await this.validateApiKey(apiKey);
    if (!isValidKey) {
      throw new Error('Invalid API key');
    }

    const { data, error } = await supabase
      .from('user_security_settings')
      .select(`
        *,
        recovery_email,
        backup_email,
        recovery_phrase_enabled,
        social_recovery_enabled,
        guardian_emails,
        required_guardians,
        recovery_time_delay
      `)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Failed to fetch recovery options: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      recoveryEmail: data.recovery_email,
      backupEmail: data.backup_email,
      recoveryPhrase: data.recovery_phrase_enabled,
      socialRecovery: data.social_recovery_enabled,
      guardianEmails: data.guardian_emails || [],
      requiredGuardians: data.required_guardians || 2,
      timeDelay: data.recovery_time_delay || 24,
      isActive: data.is_active || false,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  /**
   * Update user recovery options
   */
  async updateRecoveryOptions(options: RecoveryOptions, apiKey: string): Promise<RecoveryOptions> {
    // Validate API key
    const isValidKey = await this.validateApiKey(apiKey);
    if (!isValidKey) {
      throw new Error('Invalid API key');
    }

    // Validate guardian configuration
    if (options.socialRecovery && options.guardianEmails) {
      if (options.guardianEmails.length < (options.requiredGuardians || 2)) {
        throw new Error('Number of guardians must be at least equal to required guardians');
      }

      // Validate guardian emails
      for (const email of options.guardianEmails) {
        if (!this.isValidEmail(email)) {
          throw new Error(`Invalid guardian email: ${email}`);
        }
      }
    }

    const updateData = {
      user_id: options.userId,
      recovery_email: options.recoveryEmail,
      backup_email: options.backupEmail,
      recovery_phrase_enabled: options.recoveryPhrase || false,
      social_recovery_enabled: options.socialRecovery || false,
      guardian_emails: options.guardianEmails || [],
      required_guardians: options.requiredGuardians || 2,
      recovery_time_delay: options.timeDelay || 24,
      is_active: options.isActive,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_security_settings')
      .upsert(updateData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update recovery options: ${error.message}`);
    }

    // Log the configuration change
    await this.logSecurityChange(options.userId, 'recovery_options_updated', {
      recoveryEmail: !!options.recoveryEmail,
      socialRecovery: options.socialRecovery,
      guardianCount: options.guardianEmails?.length || 0
    });

    return {
      id: data.id,
      userId: data.user_id,
      recoveryEmail: data.recovery_email,
      backupEmail: data.backup_email,
      recoveryPhrase: data.recovery_phrase_enabled,
      socialRecovery: data.social_recovery_enabled,
      guardianEmails: data.guardian_emails,
      requiredGuardians: data.required_guardians,
      timeDelay: data.recovery_time_delay,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  /**
   * Get user security settings
   */
  async getUserSecuritySettings(userId: string, apiKey: string): Promise<UserSecuritySettings | null> {
    // Validate API key
    const isValidKey = await this.validateApiKey(apiKey);
    if (!isValidKey) {
      throw new Error('Invalid API key');
    }

    const { data, error } = await supabase
      .from('user_security_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch security settings: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      biometricEnabled: data.biometric_enabled || false,
      otpEnabled: data.otp_enabled || false,
      emailNotifications: data.email_notifications || true,
      transactionLimits: {
        daily: data.daily_transaction_limit,
        perTransaction: data.per_transaction_limit
      },
      riskTolerance: data.risk_tolerance || 'medium',
      autoLockDuration: data.auto_lock_duration || 30,
      trustedDevices: data.trusted_devices || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  /**
   * Update user security settings
   */
  async updateUserSecuritySettings(settings: UserSecuritySettings, apiKey: string): Promise<UserSecuritySettings> {
    // Validate API key
    const isValidKey = await this.validateApiKey(apiKey);
    if (!isValidKey) {
      throw new Error('Invalid API key');
    }

    // Validate settings
    if (settings.riskTolerance && !['low', 'medium', 'high'].includes(settings.riskTolerance)) {
      throw new Error('Invalid risk tolerance level');
    }

    if (settings.autoLockDuration && (settings.autoLockDuration < 1 || settings.autoLockDuration > 1440)) {
      throw new Error('Auto lock duration must be between 1 and 1440 minutes');
    }

    const updateData = {
      user_id: settings.userId,
      biometric_enabled: settings.biometricEnabled,
      otp_enabled: settings.otpEnabled,
      email_notifications: settings.emailNotifications,
      daily_transaction_limit: settings.transactionLimits?.daily,
      per_transaction_limit: settings.transactionLimits?.perTransaction,
      risk_tolerance: settings.riskTolerance,
      auto_lock_duration: settings.autoLockDuration,
      trusted_devices: settings.trustedDevices || [],
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_security_settings')
      .upsert(updateData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update security settings: ${error.message}`);
    }

    // Log the configuration change
    await this.logSecurityChange(settings.userId, 'security_settings_updated', {
      biometricEnabled: settings.biometricEnabled,
      otpEnabled: settings.otpEnabled,
      riskTolerance: settings.riskTolerance
    });

    return {
      id: data.id,
      userId: data.user_id,
      biometricEnabled: data.biometric_enabled,
      otpEnabled: data.otp_enabled,
      emailNotifications: data.email_notifications,
      transactionLimits: {
        daily: data.daily_transaction_limit,
        perTransaction: data.per_transaction_limit
      },
      riskTolerance: data.risk_tolerance,
      autoLockDuration: data.auto_lock_duration,
      trustedDevices: data.trusted_devices,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  /**
   * Initiate recovery process
   */
  async initiateRecovery(userId: string, recoveryMethod: 'email' | 'social' | 'phrase', apiKey: string): Promise<{ success: boolean; recoveryId?: string; message: string }> {
    // Validate API key
    const isValidKey = await this.validateApiKey(apiKey);
    if (!isValidKey) {
      throw new Error('Invalid API key');
    }

    const recoveryOptions = await this.getRecoveryOptions(userId, apiKey);
    if (!recoveryOptions || !recoveryOptions.isActive) {
      throw new Error('Recovery not configured for this user');
    }

    const recoveryId = crypto.randomUUID();

    // Store recovery request
    const { error } = await supabase.from('recovery_requests').insert({
      id: recoveryId,
      user_id: userId,
      recovery_method: recoveryMethod,
      status: 'initiated',
      expires_at: new Date(Date.now() + (recoveryOptions.timeDelay || 24) * 60 * 60 * 1000).toISOString()
    });

    if (error) {
      throw new Error(`Failed to initiate recovery: ${error.message}`);
    }

    // Log security event
    await this.logSecurityChange(userId, 'recovery_initiated', { method: recoveryMethod, recoveryId });

    return {
      success: true,
      recoveryId,
      message: `Recovery initiated. Process will complete in ${recoveryOptions.timeDelay} hours.`
    };
  }

  // Private helper methods
  private async validateApiKey(apiKey: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, is_active')
      .eq('key_value', apiKey)
      .eq('is_active', true)
      .single();

    return !error && !!data;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async logSecurityChange(userId: string, eventType: string, details: any): Promise<void> {
    try {
      await supabase.from('security_events').insert({
        user_id: userId,
        event_type: eventType,
        details,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log security change:', error);
    }
  }
}
