
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  wallet_address: string | null;
  transaction_hash: string | null;
  status: 'detected' | 'investigating' | 'resolved' | 'false_positive';
  created_at: string;
}

export const useSecurityEvents = () => {
  const { user } = useAuth();

  const { data: securityEvents, isLoading } = useQuery({
    queryKey: ['security-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as SecurityEvent[];
    },
    enabled: !!user,
  });

  return {
    securityEvents,
    isLoading,
  };
};
