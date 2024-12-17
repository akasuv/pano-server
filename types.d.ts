import Pano from "@/pano";
import { SupabaseClient } from "@supabase/supabase-js";
import { Express } from "express";
import { SessionData } from "express-session";

declare global {
  namespace Express {
    export interface Request {
      supabaseClient: SupabaseClient;
      pano: Pano;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    accessToken: string;
    providerId: string;
  }
}
