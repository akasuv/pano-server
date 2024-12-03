import { tool } from "@langchain/core/tools";
import { z } from "zod";

const getFlights = tool(() => {}, {
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
});

export default getFlights;
