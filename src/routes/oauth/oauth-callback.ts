import url from "url";
import { setCredentials } from "@/integrations/google";
import Express, { Request, Response } from "express";

const router = Express.Router();

router.get("/", async (req: Request, res: Response) => {
  console.log("req.url", req.url);
  const redirectUrl = `pano://${req.url}`;
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pano</title>
          <meta http-equiv="refresh" content="0;url=${redirectUrl}">
      </head>
      <body>
          <h1>Authentication Successful!</h1>
          <p>You have successfully authenticated. You can now close this window.</p>
      </body>
      </html>
  `);

  // let query = url.parse(req.url, true).query;
  // if (query.error) {
  //   // An error response e.g. error=access_denied
  //   console.log("Error:" + query.error);
  //   res.status(400).send("Error:" + query.error);
  // } else {
  //   console.log("query", query);
  //   // const supabaseClient = req.supabaseClient;

  //   // const auth = req.auth!;

  //   // const { data, error } = await supabaseClient.from("oauth_tokens").insert({
  //   //   user_id: auth.payload.sub,
  //   //   scope: auth.payload.scope,
  //   //   resource_server_name: "pano" + Date.now(),
  //   // });

  //   await setCredentials(query.code as string);
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
