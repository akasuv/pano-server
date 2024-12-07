import OAuthGoogle from "./google";

class OAuth {
  server: OAuthGoogle | undefined;

  constructor(provider: string) {
    this.server = this.getProviderServer(provider);
  }

  getProviderServer(provider: string) {
    if (provider === "google") {
      return new OAuthGoogle();
    }
  }
}

export default OAuth;
