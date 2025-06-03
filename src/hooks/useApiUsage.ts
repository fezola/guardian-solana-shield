
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ApiUsage {
  id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number | null;
  created_at: string;
}

interface UsageStats {
  totalRequests: number;
  successfulRequests: number;
  averageResponseTime: number;
  requestsThisMonth: number;
}

export const useApiUsage = () => {
  const { user } = useAuth();

  const { data: recentUsage, isLoading: isLoadingUsage } = useQuery({
    queryKey: ['api-usage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_usage')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as ApiUsage[];
    },
    enabled: !!user,
  });

  const { data: usageStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_usage')
        .select('status_code, response_time_ms, created_at');

      if (error) throw error;

      const totalRequests = data.length;
      const successfulRequests = data.filter(item => item.status_code >= 200 && item.status_code < 300).length;
      const averageResponseTime = data.reduce((acc, item) => acc + (item.response_time_ms || 0), 0) / totalRequests || 0;
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const requestsThisMonth = data.filter(item => new Date(item.created_at) >= thisMonth).length;

      return {
        totalRequests,
        successfulRequests,
        averageResponseTime: Math.round(averageResponseTime),
        requestsThisMonth,
      } as UsageStats;
    },
    enabled: !!user,
  });

  return {
    recentUsage,
    usageStats,
    isLoading: isLoadingUsage || isLoadingStats,
  };
};
