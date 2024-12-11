import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import getFlights from "./tools/getFlights";
import createTripItinerary from "./tools/createTripItinerary";

const experimental = new PanoToolProvider({
  name: "Experimental",
  type: PanoToolProvider.Type.Extension,
  description: "Experimental tools",
});

experimental.addTools([getFlights, createTripItinerary]);

export default experimental;
