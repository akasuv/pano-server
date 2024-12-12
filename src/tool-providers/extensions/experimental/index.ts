import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import getFlights from "./tools/getFlights";
import createTripItinerary from "./tools/createTripItinerary";
import browseWebsite from "./tools/browseWebsite";

const experimental = new PanoToolProvider({
  name: "Experimental",
  type: PanoToolProvider.Type.Extension,
  description: "Experimental tools",
});

experimental.addTools([getFlights, createTripItinerary, browseWebsite]);

export default experimental;
