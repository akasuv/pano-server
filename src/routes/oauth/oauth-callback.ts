import url from "url";
import { saveCredentials } from "@/integrations/google";
import Express, { Request, Response } from "express";

const router = Express.Router();

router.get("/", async (req: Request, res: Response) => {
  const query = url.parse(req.url, true).query;
  if (!query.state) {
    res.status(400).send("Error: state is not defined");
    return;
  }

  req.sessionStore.get(query.state as string, async (err, session) => {
    const accessToken = session.accessToken;

    console.log("query", query);

    await saveCredentials(query.code as string, accessToken);

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

  // let query = url.parse(req.url, true).query;
  // if (query.error) {
  //   // An error response e.g. error=access_denied
  //   console.log("Error:" + query.error);
  //   res.status(400).send("Error:" + query.error);
  // } else {
  //   res.send(`
  //         <!DOCTYPE html>
  //         <html lang="en">
  //         <head>
  //             <meta charset="UTF-8">
  //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //             <title>Pano</title>
  //         </head>
  //         <body>
  //             <h1>Authentication Successful!</h1>
  //             <p>You have successfully authenticated. You can now close this window.</p>
  //         </body>
  //         </html>
  //     `);
  // }
});

export default router;