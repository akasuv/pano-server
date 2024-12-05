import "dotenv/config";

import express, { Request, Response } from "express";
import { auth, claimIncludes, requiredScopes } from "express-oauth2-jwt-bearer";
import bodyParser from "body-parser";
import thread from "./routes/thread";
import googleOauthCallback from "./routes/google-oauth-callback";
import oauth from "./routes/oauth";

const jwtCheck = auth({
  audience: "https://api.panoapp.ai",
  issuerBaseURL: "https://panoapp.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

const app = express();
app.use(bodyParser.json());

// enforce on all endpoints
app.use(jwtCheck);

const PORT = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  // res.send("Pano app server is running");
  //
  res.json({ name: "1" });
});

const claim = claimIncludes("membershipStatus", "active");

app.get("/api/private-scoped", claim, (req, res) => {
  console.log("membershipStatus", req.auth?.payload.membershipStatus);
  res.json({
    message:
      "You need to be authenticated and have a scope of read:messages to see this.",
  });
});

app.use("/thread", thread);
app.use("/oauth2callback", googleOauthCallback);
app.use("/oauth", oauth);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
