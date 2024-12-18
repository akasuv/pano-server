import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import bodyParser from "body-parser";
import { supabase, pano } from "./middlewares";
import thread from "@/routes/membership/thread";
import oauth from "@/routes/oauth";
import oauthRedirect from "@/routes/oauth/redirect";
import session from "express-session";
import context from "./context";
import { logMiddleware, default as logger } from "@/config/logger";

const PORT = process.env.PORT || 3000;

const jwtCheck = auth({
  audience: "https://api.panoapp.ai",
  issuerBaseURL: "https://panoapp.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(logMiddleware);
app.use(session({ secret: "keyboard cat" }));
app.use(bodyParser.json());
app.use(pano);

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
app.use("/oauth/redirect", oauthRedirect);
app.use("/oauth", oauth);

app.listen(PORT, () => {
  logger.info(`Pano Server is running on http://localhost:${PORT}`);
});
