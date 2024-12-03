import { google } from "googleapis";

async function listEvents() {
  const calendar = google.calendar({ version: "v3" });
  console.log("checking calendar");
  const res = await calendar.events
    .list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    })
    .catch((err) => {
      console.error("The API returned an error: " + err);
      throw err;
    });
  const events = res?.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return "No upcoming events found.";
  }
  console.log("Upcoming 10 events:");
  return events.map((event, i) => {
    const start = event.start?.dateTime || event.start?.date;
    console.log(`${start} - ${event.summary}`);
    return `${start} - ${event.summary}`;
  });
}

export default listEvents;
