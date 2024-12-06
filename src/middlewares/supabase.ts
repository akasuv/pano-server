import { NextFunction, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const initSupabaseClient = (accessToken: string) => {
  if (
    process.env.SUPABASE_URL === undefined ||
    process.env.SUPABASE_KEY === undefined
  ) {
    throw new Error("SUPABASE_URL or SUPABASE_KEY is not defined");
  }

  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    accessToken: async () => accessToken,
  });
};

const supabase = (req: Request, res: Response, next: NextFunction) => {
  console.log("req", req.auth);

  if (!req.auth || !req.auth.token) {
    // res.status(401).send("Unauthorized");
    next();
  } else {
    console.log("middleware:supabase:created");
    req.supabaseClient = initSupabaseClient(req.auth.token);

    next();
  }
};

export { supabase };
