import Express from "express";
import getOAuthProvider from "@/oauth/getOAuthProvider";
import logger from "@/config/logger";

const router = Express.Router();

router.get("/", async (req, res) => {
  const queryString = (await import("query-string")).default;
  const { query } = queryString.parseUrl(req.url);
  const sessionId = query.sessionId as string;
  const providerId = query.providerId as string;
  const scopeString = query.scopes as string;
  const scopes = scopeString.split(",");

  const oAuthProvider = getOAuthProvider(providerId);

  logger.info({ message: "oauth session", sessionId });

  if (!providerId) {
    res.status(400).send("Error: Provider not found");
  }

  if (!scopes) {
    res.status(400).send("Error: Scope is not defined");
    return;
  }

  req.sessionStore.get(sessionId, async (err, session) => {
    if (session) {
      req.session.accessToken = session.accessToken;
      req.session.providerId = providerId;

      if (oAuthProvider) {
        const authServerUrl = await oAuthProvider.getAuthServerUrl({
          state: req.session.id,
          scopes: scopes as string[],
        });

        res.redirect(302, authServerUrl);
      } else {
        res.status(400).send("Error: Provider Server not found");
      }
    }
  });
});

export default router;
