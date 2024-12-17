import googleDocs from "./google-docs";
import googleCalendar from "./google-calendar";
import gmail from "./gmail";
import slack from "./slack";
import oAuth from "./oauth";

const connections = [oAuth, googleDocs, slack, googleCalendar, gmail];

export default connections;
