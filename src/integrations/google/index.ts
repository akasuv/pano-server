import { google, Auth } from "googleapis";
import Supabase from "@/supabase";
import { jwtDecode } from "jwt-decode";
import { createRequire } from "module";

interface OAuth {
  client: Auth.OAuth2Client;
  credentials?: Auth.Credentials;
  getTokens: (code: string) => Promise<Auth.Credentials>;
  saveTokensToDB: (tokens: Auth.Credentials) => Promise<Auth.Credentials>;
  loadTokensFromDB: (userId: string) => Promise<Auth.Credentials | undefined>;
  setCredentials: (credentials: Auth.Credentials) => void;
  getAuthServerUrl: ({
    state,
    scope,
  }: {
    state: string;
    scope: string[];
  }) => String;
}

class OAuthGoogle implements OAuth {
  client: OAuth["client"];
  credentials?: Auth.Credentials;
  supabase?: Supabase;
  requestAccessToken?: string;
  isAuthed?: boolean;

  constructor() {
    console.log("OAuthGoogle: Initializing OAuthGoogle");

    this.client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL,
    );
    this.isAuthed = false;
  }

  connectToSupabase({ requestAccessToken }: { requestAccessToken: string }) {
    console.log("OAuthGoogle: Connecting to Supabase");
    this.requestAccessToken = requestAccessToken;
    this.supabase = new Supabase({ accessToken: requestAccessToken });
  }

  getAuthServerUrl({ state, scope }: { state: string; scope: string[] }) {
    console.log("OAuthGoogle: Getting Auth Server URL");
    const url = this.client.generateAuthUrl({
      scope: scope,
      include_granted_scopes: true,
      state: state,
    });
    return url;
  }

  async getTokens(code: string) {
    console.log("OAuthGoogle: Getting Tokens");
    const data = await this.client.getToken(code);

    return data.tokens;
  }

  async saveTokensToDB(tokens: Auth.Credentials) {
    console.log("OAuthGoogle: Saving Tokens to DB");
    if (!this.supabase || !this.requestAccessToken) {
      throw new Error("supabase or requestAccessToken not initialized");
    }

    const accessToken = tokens.access_token;
    const scope = tokens.scope;

    const decoded = jwtDecode(this.requestAccessToken);

    const { data: dbData, error } = await this.supabase.client
      .from("oauth_tokens")
      .insert({
        user_id: decoded.sub,
        scope: scope,
        access_token: accessToken,
        resource_server_name: "google" + Date.now(),
      });

    return tokens;
  }

  async loadTokensFromDB() {
    console.log("OAuthGoogle: Loading Tokens from DB");
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
    const scope = first?.scope;

    console.log("loading data from db - data:", data);

    if (accessToken && scope) {
      const credentials = { access_token: accessToken, scope };

      this.credentials = credentials;
      return credentials;
    }

    return;
  }

  async setCredentials(credentials: Auth.Credentials) {
    console.log("OAuthGoogle: Setting Credentials");
    this.client.setCredentials(credentials);
  }

  async listEvents() {
    const calendar = google.calendar({ version: "v3" });
    console.log("checking calendar", this.client.credentials);
    const res = await calendar.events
      .list({
        auth: this.client,
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      })
      .catch((err) => {
        console.error("The API returned an error: " + err);
        throw err;
      });
    const events = res?.data.items;
    if (!events || events.length === 0) {
      console.log("No upcoming events found.");
      return "No upcoming events found.";
    }
    console.log("Upcoming 10 events:");
    return events.map((event, i) => {
      const start = event.start?.dateTime || event.start?.date;
      console.log(`${start} - ${event.summary}`);
      return `${start} - ${event.summary}`;
    });
  }

  async auth(requestAccessToken: string, code: string) {
    this.connectToSupabase({
      requestAccessToken,
    });
    const tokens = await this.getTokens(code);
    await this.saveTokensToDB(tokens);
    await this.setCredentials(tokens);
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

  async createNewDocument({ title, body }: { title: string; body: string }) {
    const docsClient = google.docs({ version: "v1", auth: this.client });
    const createResponse = await docsClient.documents.create({
      requestBody: {
        title,
      },
    });

    if (!createResponse.data.documentId) {
      throw new Error("Document ID not found");
    }

    const updateResponse = await docsClient.documents.batchUpdate({
      documentId: createResponse.data.documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              // The first text inserted into the document must create a paragraph,
              // which can't be done with the `location` property.  Use the
              // `endOfSegmentLocation` instead, which assumes the Body if
              // unspecified.
              endOfSegmentLocation: {},
              text: body,
            },
          },
        ],
      },
    });

    return createResponse.data.documentId;
  }
}

export default OAuthGoogle;
