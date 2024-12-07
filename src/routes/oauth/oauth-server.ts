import Express from "express";
import OAuth from "@/integrations/oauth";

const router = Express.Router();

router.get("/", async (req, res) => {
  const queryString = (await import("query-string")).default;
  const { query } = queryString.parseUrl(req.url);
  const sessionId = query.sessionId as string;
  const provider = query.provider as string;
  const scopeString = query.scopes as string;
  const scopes = scopeString.split(",");

  const oAuth = new OAuth(provider);

  if (!provider) {
    res.status(400).send("Error: Provider not found");
  }

  if (!scopes) {
    res.status(400).send("Error: Scope is not defined");
    return;
  }

  if (oAuth.server) {
    const authServerUrl = oAuth.server.getAuthServerUrl({
      state: sessionId,
      scope: scopes as string[],
    });

    res.redirect(302, authServerUrl);
  } else {
    res.status(400).send("Error: Provider Server not found");
  }
});

export default router;
