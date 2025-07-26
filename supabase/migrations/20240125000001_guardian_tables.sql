-- GuardianLayer Database Schema
-- Create tables for enhanced security features

-- OTP Logs table for tracking OTP sends and verifications
CREATE TABLE IF NOT EXISTS otp_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    provider TEXT NOT NULL DEFAULT 'console',
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'verified', 'expired', 'failed')),
    attempts INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 minutes'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biometric Credentials table for storing WebAuthn credentials
CREATE TABLE IF NOT EXISTS biometric_credentials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    credential_id TEXT NOT NULL UNIQUE,
    public_key BYTEA NOT NULL,
    algorithm INTEGER NOT NULL,
    counter BIGINT DEFAULT 0,
    device_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Wallet Addresses table for tracking user wallets
CREATE TABLE IF NOT EXISTS wallet_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    name TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, address)
);

-- Transaction Analysis table for storing risk analysis results
CREATE TABLE IF NOT EXISTS transaction_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL,
    transaction_hash TEXT,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('safe', 'medium', 'high')),
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_factors JSONB DEFAULT '[]',
    recommendation TEXT,
    analysis_details JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'analyzed' CHECK (status IN ('analyzed', 'approved', 'blocked', 'executed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scam Database table for known malicious addresses and patterns
CREATE TABLE IF NOT EXISTS scam_database (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    address TEXT NOT NULL UNIQUE,
    scam_type TEXT NOT NULL,
    confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    description TEXT,
    evidence JSONB DEFAULT '{}',
    reported_by UUID REFERENCES auth.users(id),
    verified_by UUID REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'verified', 'false_positive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token Registry table for known tokens and their security info
CREATE TABLE IF NOT EXISTS token_registry (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mint_address TEXT NOT NULL UNIQUE,
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    decimals INTEGER NOT NULL,
    logo_uri TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    security_info JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Events table (enhanced version)
ALTER TABLE security_events ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE security_events ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE security_events ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES auth.users(id);

-- User Security Settings table
CREATE TABLE IF NOT EXISTS user_security_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    biometric_enabled BOOLEAN DEFAULT FALSE,
    otp_enabled BOOLEAN DEFAULT FALSE,
    time_lock_enabled BOOLEAN DEFAULT FALSE,
    time_lock_threshold DECIMAL(20,9) DEFAULT 1.0,
    risk_tolerance TEXT DEFAULT 'medium' CHECK (risk_tolerance IN ('low', 'medium', 'high')),
    notification_email TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recovery Requests table for tracking recovery processes
CREATE TABLE IF NOT EXISTS recovery_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recovery_method TEXT NOT NULL CHECK (recovery_method IN ('email', 'social', 'phrase')),
    status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'pending', 'approved', 'completed', 'cancelled', 'expired')),
    guardian_approvals JSONB DEFAULT '{}',
    required_approvals INTEGER DEFAULT 2,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Events table for audit logging
CREATE TABLE IF NOT EXISTS security_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_otp_logs_email ON otp_logs(email);
CREATE INDEX IF NOT EXISTS idx_otp_logs_expires_at ON otp_logs(expires_at);
CREATE INDEX IF NOT EXISTS idx_biometric_credentials_user_id ON biometric_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_biometric_credentials_credential_id ON biometric_credentials(credential_id);
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_user_id ON wallet_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_address ON wallet_addresses(address);
CREATE INDEX IF NOT EXISTS idx_transaction_analysis_user_id ON transaction_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_transaction_analysis_wallet_address ON transaction_analysis(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transaction_analysis_risk_level ON transaction_analysis(risk_level);
CREATE INDEX IF NOT EXISTS idx_scam_database_address ON scam_database(address);
CREATE INDEX IF NOT EXISTS idx_token_registry_mint_address ON token_registry(mint_address);
CREATE INDEX IF NOT EXISTS idx_token_registry_symbol ON token_registry(symbol);
CREATE INDEX IF NOT EXISTS idx_recovery_requests_user_id ON recovery_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_recovery_requests_status ON recovery_requests(status);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON security_events(event_type);

-- Row Level Security (RLS) policies
ALTER TABLE otp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE biometric_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user-specific data
CREATE POLICY "Users can view their own OTP logs" ON otp_logs
    FOR SELECT USING (auth.email() = email);

CREATE POLICY "Users can manage their own biometric credentials" ON biometric_credentials
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wallet addresses" ON wallet_addresses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transaction analysis" ON transaction_analysis
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own security settings" ON user_security_settings
    FOR ALL USING (auth.uid() = user_id);

-- Public read access for scam database and token registry
CREATE POLICY "Anyone can read scam database" ON scam_database
    FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can read token registry" ON token_registry
    FOR SELECT USING (TRUE);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_wallet_addresses_updated_at BEFORE UPDATE ON wallet_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaction_analysis_updated_at BEFORE UPDATE ON transaction_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scam_database_updated_at BEFORE UPDATE ON scam_database
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_token_registry_updated_at BEFORE UPDATE ON token_registry
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_security_settings_updated_at BEFORE UPDATE ON user_security_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial data
INSERT INTO token_registry (mint_address, symbol, name, decimals, is_verified, tags) VALUES
    ('So11111111111111111111111111111111111111112', 'SOL', 'Solana', 9, TRUE, ARRAY['native']),
    ('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 'USDC', 'USD Coin', 6, TRUE, ARRAY['stablecoin']),
    ('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', 'USDT', 'Tether USD', 6, TRUE, ARRAY['stablecoin']),
    ('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', 'mSOL', 'Marinade staked SOL', 9, TRUE, ARRAY['liquid-staking'])
ON CONFLICT (mint_address) DO NOTHING;
