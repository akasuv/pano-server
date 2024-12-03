import express from "express";
import url from "url";
import { setCredentials } from "../integrations/google";

const router = express.Router();

router.get("/", async (req, res) => {
  let q = url.parse(req.url, true).query;
  if (q.error) {
    // An error response e.g. error=access_denied
    console.log("Error:" + q.error);
  } else {
    // Get access and refresh tokens (if access_type is offline)

    console.log("q", q);
    await setCredentials(q.code as string);

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
  }
});

export default router;
