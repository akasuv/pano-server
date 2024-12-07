import { SupabaseClient } from "@supabase/supabase-js";
import { Express } from "express";
import { SessionData } from "express-session";

declare global {
  namespace Express {
    export interface Request {
      supabaseClient: SupabaseClient;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    accessToken: string;
  }
}
