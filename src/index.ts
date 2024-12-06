import "dotenv/config";
import express, { Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import bodyParser from "body-parser";
import { supabase } from "./middlewares";
import thread from "@/routes/membership/thread";
import oauth from "@/routes/oauth/oauth-server";
import oauthCallback from "@/routes/oauth/oauth-callback";
import addNewOauthService from "@/routes/oauth/add-new-service";

const PORT = process.env.PORT || 3000;

// const jwtCheck = auth({
//   audience: "https://api.panoapp.ai",
//   issuerBaseURL: "https://panoapp.us.auth0.com/",
//   tokenSigningAlg: "RS256",
// });

const app = express();

app.use(bodyParser.json());
// app.use(jwtCheck);

app.use(supabase);

app.get("/", async (req: Request, res: Response) => {
  res.send("Pano app server is running");
});

app.use("/thread", thread);
app.use("/oauth-callback", oauthCallback);
app.use("/oauth", oauth);
app.use("/add-oauth-service", addNewOauthService);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
