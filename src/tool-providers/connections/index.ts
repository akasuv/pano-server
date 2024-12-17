import oAuth from "./oauth";
import googleDocs from "./google-docs";
import googleCalendar from "./google-calendar";
import gmail from "./gmail";
import slack from "./slack";
import github from "./github";
import zoom from "./zoom";

const connections = [
  oAuth,
  googleDocs,
  slack,
  googleCalendar,
  gmail,
  github,
  zoom,
];

export default connections;
