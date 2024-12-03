import "dotenv/config";

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import routes from "./routes";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  res.send("Pano app server is running");
});

app.use("/thread", routes.thread);
app.use("/oauth2callback", routes.googleOuathCallback);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
