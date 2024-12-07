import Express from "express";
import { getAuthUrl } from "@/integrations/google";
import url from "url";

const router = Express.Router();

router.get("/", (req, res) => {
  const query = url.parse(req.url, true).query;
  const sessionId = query.sessionId as string;

  const authServerUrl = getAuthUrl(sessionId);

  res.redirect(302, authServerUrl);
  // res.json({ success: true });
});

export default router;
