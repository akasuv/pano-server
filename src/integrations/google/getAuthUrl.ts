import crypto from "crypto";
import oauth2Client from "./oauth2Client";

const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];

const getAuthUrl = () => {
  // Generate a secure random state value.
  const state = crypto.randomBytes(32).toString("hex");

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
