import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import getAuthUrl from "./tools/get-auth-url";

const googleAuth = new PanoToolProvider({
  type: PanoToolProvider.Type.Connection,
  name: "Google Auth",
  description: "Google Auth",
  logoUrl:
    "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA",
});

googleAuth.addTool(getAuthUrl);

export default googleAuth;
