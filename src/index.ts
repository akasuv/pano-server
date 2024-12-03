import "dotenv/config";

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import thread from "./routes/thread";
import googleOauthCallback from "./routes/google-oauth-callback";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  res.send("Pano app server is running");
});

app.use("/thread", thread);
app.use("/oauth2callback", googleOauthCallback);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
