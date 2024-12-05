import Express from "express";
import { getAuthUrl } from "../integrations/google";

const router = Express.Router();

router.get("/", (req, res) => {
  const url = getAuthUrl();

  res.redirect(302, url);
});

export default router;
