import { PanoOAuth, Credentials } from "./oauth.type";
import Supabase from "@/supabase";
import logger from "@/config/logger";
import { jwtDecode } from "jwt-decode";

abstract class OAuth implements PanoOAuth {
  credentials?: Credentials;
  supabase?: Supabase;
  requestAccessToken?: string;
  isAuthed: boolean;

  constructor() {
    this.isAuthed = false;
  }

  abstract providerId: string;
  abstract getTokens(code: string): Promise<Credentials>;
  abstract getAuthServerUrl({
    state,
    scopes,
  }: {
    state: string;
    scopes: string[];
  }): Promise<string>;

  async setCredentials(credentials: Credentials) {
    this.credentials = credentials;
    this.isAuthed = true;
  }

  protected connectToSupabase({
    requestAccessToken,
  }: {
    requestAccessToken: string;
  }) {
    logger.info("Pano Connection OAuth: Connecting to Supabase");
    this.requestAccessToken = requestAccessToken;
    this.supabase = new Supabase({ accessToken: requestAccessToken });
  }

  protected async saveTokensToDB(tokens: Credentials) {
    logger.info("Pano Connection OAuth: Saving Tokens to Supabase");
    if (!this.supabase || !this.requestAccessToken) {
      throw new Error("supabase or requestAccessToken not initialized");
    }

    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;
    const scopes = tokens.scopes;

    const decoded = jwtDecode(this.requestAccessToken);

    const { data: dbData, error } = await this.supabase.client
      .from("oauth_tokens")
      .upsert(
        {
          user_id: decoded.sub,
          scopes,
          access_token: accessToken,
          refresh_token: refreshToken,
          provider_id: this.providerId,
        },
        {
          onConflict: "user_id, provider_id",
        },
      );

    if (error) {
      logger.error({
        message: "Pano Connection OAuth: Error saving tokens to supabase",
        error,
      });
    } else {
      logger.info("Pano Connection OAuth: Saved tokens to supabase");
    }

    return tokens;
  }

  protected async loadTokensFromDB() {
    logger.info("Pano Connection OAuth: Loading Tokens from Supabase");

    if (!this.supabase || !this.requestAccessToken) {
      throw new Error("supabase or requestAccessToken not initialized");
    }

    const decoded = jwtDecode(this.requestAccessToken);
    const userId = decoded.sub;

    logger.info({
      userId,
      providerId: this.providerId,
    });

    const { data, error } = await this.supabase.client
      .from("oauth_tokens")
      .select()
      .eq("user_id", userId)
      .eq("provider_id", this.providerId);

    const first = data?.[0];
    const accessToken = first?.access_token;
    const refreshToken = first?.refresh_token;
    const scopes = first?.scopes;

    if (accessToken && scopes) {
      const credentials = {
        access_token: accessToken,
        scopes,
        refresh_token: refreshToken,
      };

      this.credentials = credentials;
      return credentials;
    }

    return;
  }

  async loadAuth(requestAccessToken: string) {
    this.connectToSupabase({
      requestAccessToken,
    });

    const tokens = await this.loadTokensFromDB();

    if (tokens) {
      logger.info({
        message: "Pano Connection OAuth: Authed",
        tokens,
      });
      this.setCredentials(tokens);
      this.isAuthed = true;
    } else {
      logger.info("Pano Connection OAuth: Not Authed");
    }

    return this;
  }

  async auth(requestAccessToken: string, code: string) {
    logger.info("Pano Connection OAuth: Auth started");
    this.connectToSupabase({
      requestAccessToken,
    });
    const tokens = await this.getTokens(code);
    await this.saveTokensToDB(tokens);
    await this.setCredentials(tokens);
  }
}

export default OAuth;
