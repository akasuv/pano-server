import url from "url";
import Express, { Request, Response } from "express";
import logger from "@/config/logger";
import getOAuthProvider from "@/oauth/getOAuthProvider";

const router = Express.Router();

router.get("/", async (req: Request, res: Response) => {
  const query = url.parse(req.url, true).query;

  logger.info({ query });

  if (!query.state) {
    res.status(400).send("Error: state is not defined");
    return;
  }

  req.sessionStore.get(query.state as string, async (err, session) => {
    logger.info({
      message: "oauth redirect session by sessionId:" + query.state,
      session: session,
    });
    const accessToken = session?.accessToken;
    const providerId = session?.providerId;
    const code = query.code as string;

    if (!providerId) {
      res.status(400).send("Error: Provider not found");
      return;
    }
    if (!accessToken) {
      res.status(400).send("Authorization failed");
      return;
    }

    const oauthProvider = getOAuthProvider(providerId);

    logger.info({
      message: "oauth redirect",
      provider: providerId,
    });

    await oauthProvider?.auth(accessToken, code);
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pano</title>
        </head>
        <body>
            <h1>Authentication Successful!</h1>
            <p>You have successfully authenticated. You can now close this window.</p>
        </body>
        </html>
    `);
  });
});

export default router;
