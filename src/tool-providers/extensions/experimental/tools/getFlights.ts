import { z } from "zod";
import PanoTool from "@/tool-maker/PanoTool";

const getFlightData = async ({
  departureId,
  arrivalId,
  outboundDate,
}: {
  departureId: string;
  arrivalId: string;
  outboundDate: string;
}) => {
  return await fetch(
    `https://serpapi.com/search?engine=google_flights&api_key=0a41ebd44cfe1571f744ff49e40450a1c345cdf19f98b906f006e4c2404c4517&departure_id=${departureId}&arrival_id=${arrivalId}&outbound_date=${outboundDate}&type=2`,
    {
      method: "GET",
      headers: {},
    },
  )
    .then((res) => res.json())
    .then((res) => {
      return JSON.stringify(res.best_flights);
    });
};

const getFlights = new PanoTool({
  name: "get_flights",
  description:
    "This tool will get the flights from the source to the destination for a specific date, always use get_time to get the current time first",
  schema: z.object({
    outboundDate: z
      .string()
      .describe("The outbound date of the flight, format: YYYY-MM-DD"),
    departureId: z
      .string()
      .describe(
        "The id of the departure airport, format: uppercase 3-letter code",
      ),
    arrivalId: z
      .string()
      .describe(
        "The id of the arrival airport, format: uppercase 3-letter code",
      ),
  }),
  runner: async (input) => {
    return await getFlightData(input);
  },
});

export default getFlights;
