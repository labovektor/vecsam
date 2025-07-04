import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function useAdminAuthAction() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    return res;
  };

  const signOut = async () => {
    setLoading(true);
    const res = await supabase.auth.signOut();
    setLoading(false);
    return res;
  };

  return {
    signIn,
    signOut,
    loading,
  };
}
