
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSupabaseUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return user;
}
