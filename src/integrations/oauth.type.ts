export interface Credentials {
  refresh_token?: string | null;
  expiry_date?: number | null;
  access_token?: string | null;
  token_type?: string | null;
  id_token?: string | null;
  scope?: string;
}

export interface PanoOAuth {
  credentials?: Credentials;
  getTokens: (code: string) => Promise<Credentials>;
  saveTokensToDB: (tokens: Credentials) => Promise<Credentials>;
  loadTokensFromDB: (userId: string) => Promise<Credentials | undefined>;
  setCredentials: (credentials: Credentials) => void;
  getAuthServerUrl: ({
    state,
    scopes,
  }: {
    state: string;
    scopes: string[];
  }) => Promise<String>;
}
