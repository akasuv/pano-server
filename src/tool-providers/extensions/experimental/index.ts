import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import getFlights from "./tools/getFlights";
import createTripItinerary from "./tools/createTripItinerary";
import browseWebsite from "./tools/browseWebsite";
import getGoogleNews from "./tools/getGoogleNews";
import searchGoogle from "./tools/searchGoogle";
import getCurrentTime from "./tools/getCurrentTime";

const experimental = new PanoToolProvider({
  name: "Experimental",
  type: PanoToolProvider.Type.Extension,
  description: "Experimental tools",
});

experimental.addTools([
  getFlights,
  createTripItinerary,
  browseWebsite,
  getGoogleNews,
  searchGoogle,
  getCurrentTime,
]);

export default experimental;
