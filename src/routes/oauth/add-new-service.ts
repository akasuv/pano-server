import url from "url";
import { setCredentials } from "@/integrations/google";
import Express, { Request, Response } from "express";

const router = Express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.send("Hello, world!");
  let query = url.parse(req.url, true).query;
  if (query.error) {
    // An error response e.g. error=access_denied
    console.log("Error:" + query.error);
    res.status(400).send("Error:" + query.error);
  } else {
    console.log("query", query);
    // const supabaseClient = req.supabaseClient;

    // const auth = req.auth!;

    // const { data, error } = await supabaseClient.from("oauth_tokens").insert({
    //   user_id: auth.payload.sub,
    //   scope: auth.payload.scope,
    //   resource_server_name: "pano" + Date.now(),
    // });

    await setCredentials(query.code as string);
  }
});

export default router;
