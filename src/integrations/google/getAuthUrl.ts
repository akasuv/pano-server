import crypto from "crypto";
import createGoogleOauth2Client from "./oauth2Client";

const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];

const getAuthUrl = (state: string) => {
  // Generate a secure random state value.
  // const state = crypto.randomBytes(32).toString("hex");
  //
  const oauth2Client = createGoogleOauth2Client();

  const authorizationUrl = oauth2Client.generateAuthUrl({
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Include the state parameter to reduce the risk of CSRF attacks.
    state: state,
  });

  return authorizationUrl;
};

export default getAuthUrl;
