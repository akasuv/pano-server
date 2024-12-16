import { PanoOAuth, Credentials } from "./oauth.type";
import Supabase from "@/supabase";
import logger from "@/config/logger";
import { jwtDecode } from "jwt-decode";

abstract class OAuth implements PanoOAuth {
  credentials?: Credentials;
  supabase?: Supabase;
  requestAccessToken?: string;
  isAuthed?: boolean;
  abstract providerId: string;
  abstract getTokens: (code: string) => Promise<Credentials>;
  abstract setCredentials: (credentials: Credentials) => Promise<void>;
  abstract getAuthServerUrl: ({
    state,
    scopes,
  }: {
    state: string;
    scopes: string[];
  }) => Promise<string>;

  connectToSupabase({ requestAccessToken }: { requestAccessToken: string }) {
    console.log("OAuthGoogle: Connecting to Supabase");
    this.requestAccessToken = requestAccessToken;
    this.supabase = new Supabase({ accessToken: requestAccessToken });
  }

  async saveTokensToDB(tokens: Credentials) {
    logger.info("OAuthGoogle: Saving Tokens to DB");
    if (!this.supabase || !this.requestAccessToken) {
      throw new Error("supabase or requestAccessToken not initialized");
    }

    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;
    const scope = tokens.scope;

    const decoded = jwtDecode(this.requestAccessToken);

    const { data: dbData, error } = await this.supabase.client
      .from("oauth_tokens")
      .upsert(
        {
          user_id: decoded.sub,
          scopes: scope?.split(","),
          access_token: accessToken,
          refresh_token: refreshToken,
          provider_id: this.providerId,
        },
        {
          onConflict: "user_id, provider_id",
        },
      );

    logger.info({ message: "supabase", dbData, error });

    return tokens;
  }

  async loadTokensFromDB() {
    if (!this.supabase || !this.requestAccessToken) {
      throw new Error("supabase or requestAccessToken not initialized");
    }

    const decoded = jwtDecode(this.requestAccessToken);
    const userId = decoded.sub;

    console.log("loading tokens from db - user id: ", userId);

    const { data, error } = await this.supabase.client
      .from("oauth_tokens")
      .select()
      .eq("user_id", userId);

    const first = data?.[0];
    const accessToken = first?.access_token;
    const refreshToken = first?.refresh_token;
    const scope = first?.scope;

    console.log("loading data from db - data:", data);

    if (accessToken && scope) {
      const credentials = {
        access_token: accessToken,
        scope,
        refresh_token: refreshToken,
      };

      this.credentials = credentials;
      return credentials;
    }

    return;
  }

  async loadAuth(requestAccessToken: string) {
    console.log("loading auth");
    this.connectToSupabase({
      requestAccessToken,
    });

    const tokens = await this.loadTokensFromDB();

    if (tokens) {
      this.setCredentials(tokens);
      this.isAuthed = true;
    }

    console.log("isAuthed", this.isAuthed);

    return this;
  }

  async auth(requestAccessToken: string, code: string) {
    this.connectToSupabase({
      requestAccessToken,
    });
    const tokens = await this.getTokens(code);
    await this.saveTokensToDB(tokens);
    await this.setCredentials(tokens);
  }
}

export default OAuth;
