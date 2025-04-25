
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ApiKey {
  id: string;
  key_name: string;
  key_value: string;
  prefix: string;
  environment: 'test' | 'production';
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
}

export const useApiKeys = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ApiKey[];
    },
  });

  const generateApiKey = async (keyName: string, environment: 'test' | 'production') => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to generate API keys',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const prefix = `gl_${environment === 'production' ? 'live' : 'test'}_`;
      const randomKey = crypto.getRandomValues(new Uint8Array(32))
        .reduce((acc, curr) => acc + curr.toString(16).padStart(2, '0'), '');
      
      const keyValue = prefix + randomKey;

      const { error } = await supabase.from('api_keys').insert({
        key_name: keyName,
        key_value: keyValue,
        prefix,
        environment,
        user_id: user.id,
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: 'Success',
        description: 'API key generated successfully',
      });

      return keyValue;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: 'Success',
        description: 'API key deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    apiKeys,
    isLoading,
    isGenerating,
    generateApiKey,
    deleteApiKey,
  };
};
