import { TransactionSecurityAPI } from './transaction-security';
import { RecoveryService } from './recovery-service';
import { TokenRegistryService } from './token-registry';

// Initialize services
const transactionSecurity = new TransactionSecurityAPI();
const recoveryService = new RecoveryService();
const tokenRegistry = new TokenRegistryService();

/**
 * API Route Handlers for GuardianLayer
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * POST /api/analyze-transaction
 * Analyze transaction security without executing
 */
export async function analyzeTransaction(request: Request): Promise<Response> {
  try {
    const { transaction } = await request.json();
    const apiKey = extractApiKey(request);

    if (!apiKey) {
      return jsonResponse({ success: false, error: 'API key required' }, 401);
    }

    if (!transaction) {
      return jsonResponse({ success: false, error: 'Transaction data required' }, 400);
    }

    const analysis = await transactionSecurity.analyzeTransaction(transaction, apiKey);
    
    return jsonResponse({
      success: true,
      data: analysis
    });

  } catch (error: any) {
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}

/**
 * POST /api/secure-transaction
 * Execute secure transaction with multi-factor authentication
 */
export async function secureTransaction(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const apiKey = extractApiKey(request);

    if (!apiKey) {
      return jsonResponse({ success: false, error: 'API key required' }, 401);
    }

    const result = await transactionSecurity.secureTransaction(body, apiKey);
    
    return jsonResponse({
      success: result.success,
      data: result,
      error: result.error
    });

  } catch (error: any) {
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}

/**
 * POST /api/send-otp
 * Send OTP to user email
 */
export async function sendOTP(request: Request): Promise<Response> {
  try {
    const { email } = await request.json();
    const apiKey = extractApiKey(request);

    if (!apiKey) {
      return jsonResponse({ success: false, error: 'API key required' }, 401);
    }

    if (!email || !isValidEmail(email)) {
      return jsonResponse({ success: false, error: 'Valid email required' }, 400);
    }

    const result = await transactionSecurity.sendOTP(email, apiKey);
    
    return jsonResponse(result);

  } catch (error: any) {
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}

/**
 * POST /api/verify-otp
 * Verify OTP code
 */
export async function verifyOTP(request: Request): Promise<Response> {
  try {
    const { email, code } = await request.json();
    const apiKey = extractApiKey(request);

    if (!apiKey) {
      return jsonResponse({ success: false, error: 'API key required' }, 401);
    }

    if (!email || !code) {
      return jsonResponse({ success: false, error: 'Email and code required' }, 400);
    }

    const result = await transactionSecurity.verifyOTP(email, code, apiKey);
    
    return jsonResponse(result);

  } catch (error: any) {
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}

/**
 * GET /api/token-info/:mintAddress
 * Get token security information
 */
export async function getTokenInfo(request: Request, mintAddress: string): Promise<Response> {
  try {
    const apiKey = extractApiKey(request);

    if (!apiKey) {
      return jsonResponse({ success: false, error: 'API key required' }, 401);
    }

    const tokenInfo = await tokenRegistry.getTokenInfo(mintAddress, apiKey);
    
    return jsonResponse({
      success: true,
      data: tokenInfo
    });

  } catch (error: any) {
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}

/**
 * POST /api/report-scam
 * Report a scam address
 */
export async function reportScam(request: Request): Promise<Response> {
  try {
    const { address, scamType, description, evidence } = await request.json();
    const apiKey = extractApiKey(request);

    if (!apiKey) {
      return jsonResponse({ success: false, error: 'API key required' }, 401);
    }

    if (!address || !scamType) {
      return jsonResponse({ success: false, error: 'Address and scam type required' }, 400);
    }

    const result = await tokenRegistry.reportScam({
      address,
      scamType,
      description,
      evidence
    }, apiKey);
    
    return jsonResponse({
      success: true,
      data: result,
      message: 'Scam report submitted successfully'
    });

  } catch (error: any) {
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}

/**
 * GET /api/recovery-options/:userId
 * Get user recovery configuration
 */
export async function getRecoveryOptions(request: Request, userId: string): Promise<Response> {
  try {
    const apiKey = extractApiKey(request);

    if (!apiKey) {
      return jsonResponse({ success: false, error: 'API key required' }, 401);
    }

    const options = await recoveryService.getRecoveryOptions(userId, apiKey);
    
    return jsonResponse({
      success: true,
      data: options
    });

  } catch (error: any) {
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}

/**
 * POST /api/recovery-options
 * Update user recovery configuration
 */
export async function updateRecoveryOptions(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const apiKey = extractApiKey(request);

    if (!apiKey) {
      return jsonResponse({ success: false, error: 'API key required' }, 401);
    }

    const result = await recoveryService.updateRecoveryOptions(body, apiKey);
    
    return jsonResponse({
      success: true,
      data: result,
      message: 'Recovery options updated successfully'
    });

  } catch (error: any) {
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}

/**
 * GET /api/user-security-settings/:userId
 * Get user security settings
 */
export async function getUserSecuritySettings(request: Request, userId: string): Promise<Response> {
  try {
    const apiKey = extractApiKey(request);

    if (!apiKey) {
      return jsonResponse({ success: false, error: 'API key required' }, 401);
    }

    const settings = await recoveryService.getUserSecuritySettings(userId, apiKey);
    
    return jsonResponse({
      success: true,
      data: settings
    });

  } catch (error: any) {
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}

/**
 * POST /api/user-security-settings
 * Update user security settings
 */
export async function updateUserSecuritySettings(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const apiKey = extractApiKey(request);

    if (!apiKey) {
      return jsonResponse({ success: false, error: 'API key required' }, 401);
    }

    const result = await recoveryService.updateUserSecuritySettings(body, apiKey);
    
    return jsonResponse({
      success: true,
      data: result,
      message: 'Security settings updated successfully'
    });

  } catch (error: any) {
    return jsonResponse({
      success: false,
      error: error.message
    }, 500);
  }
}

// Helper functions
function extractApiKey(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Also check for API key in query params (less secure, but common)
  const url = new URL(request.url);
  return url.searchParams.get('api_key');
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function jsonResponse(data: APIResponse, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Export route mapping for easy integration
export const routes = {
  'POST /api/analyze-transaction': analyzeTransaction,
  'POST /api/secure-transaction': secureTransaction,
  'POST /api/send-otp': sendOTP,
  'POST /api/verify-otp': verifyOTP,
  'GET /api/token-info/:mintAddress': getTokenInfo,
  'POST /api/report-scam': reportScam,
  'GET /api/recovery-options/:userId': getRecoveryOptions,
  'POST /api/recovery-options': updateRecoveryOptions,
  'GET /api/user-security-settings/:userId': getUserSecuritySettings,
  'POST /api/user-security-settings': updateUserSecuritySettings,
};
