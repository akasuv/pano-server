import { createClient, SupabaseClient } from "@supabase/supabase-js";

class Supabase {
  client: SupabaseClient;

  constructor({ accessToken }: { accessToken: string }) {
    this.client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
      {
        accessToken: async () => accessToken,
      },
    );
  }
}

export default Supabase;
