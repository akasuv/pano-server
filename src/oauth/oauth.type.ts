export interface Credentials {
  refresh_token?: string | null;
  expiry_date?: number | null;
  access_token?: string | null;
  token_type?: string | null;
  id_token?: string | null;
  scopes?: string[];
}

export interface PanoOAuth {
  isAuthed: boolean;
  credentials?: Credentials;
  setCredentials(credentials: Credentials): Promise<void>;
  getAuthServerUrl({
    state,
    scopes,
  }: {
    state: string;
    scopes: string[];
  }): Promise<string>;
}
