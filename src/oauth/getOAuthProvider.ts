import Google from "./providers/google";
import Slack from "./providers/slack";
import GitHub from "./providers/github";
import Zoom from "./providers/zoom";

function getOAuthProvider(providerId: string) {
  if (providerId === "95b82967-65bb-4e71-9129-20114a23150d") {
    return new Google();
  }

  if (providerId === "31eefcd7-278c-47ab-ab7b-fdc6603c3d76") {
    return new Slack();
  }

  if (providerId === "ce2cd7ce-f104-4690-8991-13e55a3b2bd6") {
    return new GitHub();
  }

  if (providerId === "1b612fd5-a6bb-4a7d-96bb-15498ab8475e") {
    return new Zoom();
  }
}

export default getOAuthProvider;
