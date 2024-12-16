import OAuthGoogle from "./google";
import Slack from "./slack";

function getOAuthProvider(providerId: string) {
  if (providerId === "95b82967-65bb-4e71-9129-20114a23150d") {
    return new OAuthGoogle();
  }

  if (providerId === "31eefcd7-278c-47ab-ab7b-fdc6603c3d76") {
    return new Slack();
  }
}

export default getOAuthProvider;
