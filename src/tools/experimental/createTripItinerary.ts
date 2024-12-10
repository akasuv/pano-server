import { tool } from "@langchain/core/tools";
import { z } from "zod";

const createTripItinerary = tool(
  (input) => {
    return input;
  },
  {
    name: "create_trip_itinerary",
    description:
      "This tool will create a trip itinerary by asking the user for the start and end date, the destination, and the activities they want to do, it will produce a list of activities and the time they will take place, you should breakdown the questions instead of asking them in whole, make it several conversational turns, use get_flights to decide the flight info first, then do other things",
    schema: z.object({
      startFlight: z.object({
        startTime: z.string().describe("The start time of the flight"),
        startAirport: z.string().describe("The start airport of the flight"),
        endTime: z.string().describe("The end time of the flight"),
        endAirport: z.string().describe("The end airport of the flight"),
        flightNumber: z.string().describe("The flight number"),
      }),
      backFlight: z.object({
        startTime: z.string().describe("The start time of the flight"),
        startAirport: z.string().describe("The start airport of the flight"),
        endTime: z.string().describe("The end time of the flight"),
        endAirport: z.string().describe("The end airport of the flight"),
        flightNumber: z.string().describe("The flight number"),
      }),
      startTime: z.string().describe("The start time of the trip"),
      startPlace: z.string().describe("The start place of the trip"),
      activities: z.array(z.string()).describe("The activities of the trip"),
      endTime: z.string().describe("The end time of the trip"),
      endPlace: z.string().describe("The end place of the trip"),
    }),
  },
);

export default createTripItinerary;
