import "dotenv/config";

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import threadRouter from "./thread";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  // const state = await compiled.invoke(
  //   { messages: [new HumanMessage("Hi, I'm Wei Su")] },
  //   { configurable: { thread_id: "42" } },
  // );
  // console.log(state.messages[state.messages.length - 1].content);
});

app.use("/thread", threadRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
