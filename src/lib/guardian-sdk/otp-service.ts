/**
 * OTP Service
 * Email-based One-Time Password service
 */

import { OTPResult, OTPError, EmailConfig } from './types';
import { supabase } from '@/integrations/supabase/client';

export class OTPService {
  private otpStore: Map<string, OTPData> = new Map();
  private emailConfig: EmailConfig;

  constructor(emailConfig?: EmailConfig) {
    this.emailConfig = emailConfig || {
      provider: 'supabase',
      fromEmail: 'noreply@guardianlayer.com'
    };
  }

  /**
   * Send OTP to user's email
   */
  async sendOTP(email: string): Promise<boolean> {
    try {
      // Generate 6-digit OTP
      const otpCode = this.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP
      this.otpStore.set(email, {
        code: otpCode,
        expiresAt,
        attempts: 0,
        verified: false
      });

      // Send email based on provider
      const emailSent = await this.sendEmail(email, otpCode);

      if (!emailSent) {
        this.otpStore.delete(email);
        throw new OTPError('Failed to send OTP email');
      }

      console.log(`OTP sent to ${email}: ${otpCode}`); // Remove in production
      return true;

    } catch (error: any) {
      console.error('Error sending OTP:', error);
      throw new OTPError(`Failed to send OTP: ${error.message}`);
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(email: string, code: string): Promise<boolean> {
    try {
      const otpData = this.otpStore.get(email);

      if (!otpData) {
        throw new OTPError('No OTP found for this email');
      }

      // Check if OTP has expired
      if (new Date() > otpData.expiresAt) {
        this.otpStore.delete(email);
        throw new OTPError('OTP has expired');
      }

      // Check attempt limit
      if (otpData.attempts >= 3) {
        this.otpStore.delete(email);
        throw new OTPError('Too many failed attempts');
      }

      // Verify code
      if (otpData.code !== code.trim()) {
        otpData.attempts++;
        throw new OTPError('Invalid OTP code');
      }

      // Mark as verified
      otpData.verified = true;
      
      // Clean up after successful verification
      setTimeout(() => {
        this.otpStore.delete(email);
      }, 60000); // Clean up after 1 minute

      return true;

    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      if (error instanceof OTPError) {
        throw error;
      }
      throw new OTPError(`Failed to verify OTP: ${error.message}`);
    }
  }

  /**
   * Check if OTP is valid and not expired
   */
  isOTPValid(email: string): boolean {
    const otpData = this.otpStore.get(email);
    
    if (!otpData) {
      return false;
    }

    return new Date() <= otpData.expiresAt && !otpData.verified;
  }

  /**
   * Get remaining time for OTP
   */
  getOTPRemainingTime(email: string): number {
    const otpData = this.otpStore.get(email);
    
    if (!otpData) {
      return 0;
    }

    const remaining = otpData.expiresAt.getTime() - Date.now();
    return Math.max(0, Math.floor(remaining / 1000)); // Return seconds
  }

  /**
   * Resend OTP (with rate limiting)
   */
  async resendOTP(email: string): Promise<boolean> {
    const otpData = this.otpStore.get(email);
    
    // Rate limiting: allow resend only after 1 minute
    if (otpData) {
      const timeSinceCreation = Date.now() - (otpData.expiresAt.getTime() - 10 * 60 * 1000);
      if (timeSinceCreation < 60000) { // 1 minute
        throw new OTPError('Please wait before requesting a new OTP');
      }
    }

    return await this.sendOTP(email);
  }

  /**
   * Clear OTP for email
   */
  clearOTP(email: string): void {
    this.otpStore.delete(email);
  }

  // Private methods
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendEmail(email: string, otpCode: string): Promise<boolean> {
    switch (this.emailConfig.provider) {
      case 'supabase':
        return await this.sendEmailViaSupabase(email, otpCode);
      case 'sendgrid':
        return await this.sendEmailViaSendGrid(email, otpCode);
      case 'resend':
        return await this.sendEmailViaResend(email, otpCode);
      default:
        throw new OTPError(`Unsupported email provider: ${this.emailConfig.provider}`);
    }
  }

  private async sendEmailViaSupabase(email: string, otpCode: string): Promise<boolean> {
    try {
      // Using Supabase Edge Functions for email sending
      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: {
          email,
          otpCode,
          subject: 'GuardianLayer Security Code',
          template: this.getEmailTemplate(otpCode)
        }
      });

      if (error) {
        console.error('Supabase email error:', error);
        return false;
      }

      return data?.success || false;
    } catch (error) {
      console.error('Error sending email via Supabase:', error);
      return false;
    }
  }

  private async sendEmailViaSendGrid(email: string, otpCode: string): Promise<boolean> {
    try {
      if (!this.emailConfig.apiKey) {
        throw new Error('SendGrid API key not configured');
      }

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.emailConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email }],
            subject: 'GuardianLayer Security Code'
          }],
          from: { email: this.emailConfig.fromEmail },
          content: [{
            type: 'text/html',
            value: this.getEmailTemplate(otpCode)
          }]
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending email via SendGrid:', error);
      return false;
    }
  }

  private async sendEmailViaResend(email: string, otpCode: string): Promise<boolean> {
    try {
      if (!this.emailConfig.apiKey) {
        throw new Error('Resend API key not configured');
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.emailConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: this.emailConfig.fromEmail,
          to: [email],
          subject: 'GuardianLayer Security Code',
          html: this.getEmailTemplate(otpCode)
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending email via Resend:', error);
      return false;
    }
  }

  private getEmailTemplate(otpCode: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>GuardianLayer Security Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .otp-code { 
            font-size: 32px; 
            font-weight: bold; 
            text-align: center; 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            letter-spacing: 4px;
          }
          .warning { color: #dc3545; font-size: 14px; margin-top: 20px; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ GuardianLayer</h1>
            <h2>Security Verification Code</h2>
          </div>
          
          <p>Your GuardianLayer security code is:</p>
          
          <div class="otp-code">${otpCode}</div>
          
          <p>This code will expire in 10 minutes. Enter this code in your GuardianLayer application to complete the security verification.</p>
          
          <div class="warning">
            <strong>Security Notice:</strong> Never share this code with anyone. GuardianLayer will never ask for this code via phone or email.
          </div>
          
          <div class="footer">
            <p>If you didn't request this code, please ignore this email or contact support.</p>
            <p>© 2024 GuardianLayer. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

interface OTPData {
  code: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}
