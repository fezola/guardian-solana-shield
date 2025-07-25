/**
 * Supabase Edge Function for sending OTP emails
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OTPEmailRequest {
  email: string;
  otpCode: string;
  subject: string;
  template: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, otpCode, subject, template }: OTPEmailRequest = await req.json();

    // Validate input
    if (!email || !otpCode || !subject || !template) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: email, otpCode, subject, template' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid email format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Send email using Resend (you can also use SendGrid or other providers)
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (resendApiKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'GuardianLayer <noreply@guardianlayer.com>',
          to: [email],
          subject: subject,
          html: template,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.text();
        console.error('Resend API error:', errorData);
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Failed to send email via Resend' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const emailData = await emailResponse.json();
      console.log('Email sent successfully:', emailData);

      // Log the OTP send event
      await supabase
        .from('otp_logs')
        .insert({
          email,
          otp_code: otpCode,
          sent_at: new Date().toISOString(),
          provider: 'resend',
          status: 'sent'
        });

      return new Response(
        JSON.stringify({ 
          success: true, 
          messageId: emailData.id 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fallback to console logging for development
    console.log(`OTP Email would be sent to: ${email}`);
    console.log(`OTP Code: ${otpCode}`);
    console.log(`Subject: ${subject}`);
    
    // Log the OTP send event
    await supabase
      .from('otp_logs')
      .insert({
        email,
        otp_code: otpCode,
        sent_at: new Date().toISOString(),
        provider: 'console',
        status: 'sent'
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: 'console-log-' + Date.now() 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-otp-email function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
