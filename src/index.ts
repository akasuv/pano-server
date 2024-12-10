import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import bodyParser from "body-parser";
import { supabase } from "./middlewares";
import thread from "@/routes/membership/thread";
import oauth from "@/routes/oauth/oauth-server";
import oauthCallback from "@/routes/oauth/oauth-callback";
import session from "express-session";
import context from "./context";

const PORT = process.env.PORT || 3000;

const jwtCheck = auth({
  audience: "https://api.panoapp.ai",
  issuerBaseURL: "https://panoapp.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(session({ secret: "keyboard cat" }));
app.use(bodyParser.json());

const saveAccessTokenToSession = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.session.accessToken = req.auth?.token;
  context.setSession(req.session);

  next();
};

app.get("/", async (req: Request, res: Response) => {
  res.send("Pano app server is running");
});

app.use("/thread", jwtCheck, saveAccessTokenToSession, thread);
app.use("/oauth-callback", oauthCallback);
app.use("/oauth", oauth);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
