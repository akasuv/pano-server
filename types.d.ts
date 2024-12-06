import { SupabaseClient } from "@supabase/supabase-js";
import { Express } from "express";

declare global {
  namespace Express {
    export interface Request {
      supabaseClient: SupabaseClient;
    }
  }
}
