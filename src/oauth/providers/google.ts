import { google, Auth } from "googleapis";
import logger from "@/config/logger";
import OAuth from "../oauth";

class Google extends OAuth {
  client: Auth.OAuth2Client;
  providerId = "95b82967-65bb-4e71-9129-20114a23150d";

  constructor() {
    super();
    this.client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.PANO_OAUTH_REDIRECT,
    );
  }

  async getAuthServerUrl({
    state,
    scopes,
  }: {
    state: string;
    scopes: string[];
  }) {
    logger.info({ message: "OAuth Google: Getting Auth Server URL", scopes });
    const url = this.client.generateAuthUrl({
      scope: scopes.join(" "),
      include_granted_scopes: true,
      state: state,
      access_type: "offline",
    });
    return url;
  }

  async getTokens(code: string) {
    logger.info("OAuth Google : Getting Tokens");

    const data = await this.client.getToken(code);
    const scopes = data.tokens.scope?.split(" ");

    logger.info({ message: "OAuth Google: Getting Tokens response", data });

    return { ...data.tokens, scopes };
  }

  async setCredentials(credentials: Auth.Credentials) {
    logger.info("OAuth Google: Setting Credentials");
    super.setCredentials(credentials);
    this.client.setCredentials(credentials);

    if (credentials.refresh_token) {
      const newCredentials = (await this.client.refreshAccessToken())
        .credentials;

      console.log("new credentials", newCredentials);
      await this.saveTokensToDB(newCredentials);
    }
  }

  async listEvents() {
    const calendar = google.calendar({ version: "v3" });

    logger.info({
      message: "OAuth Google: Listing Events",
      client: this.client.credentials,
    });
    const res = await calendar.events
      .list({
        auth: this.client,
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

  async createNewDocument({ title, body }: { title: string; body: string }) {
    const docsClient = google.docs({ version: "v1", auth: this.client });
    const createResponse = await docsClient.documents.create({
      requestBody: {
        title,
      },
    });

    if (!createResponse.data.documentId) {
      throw new Error("Document ID not found");
    }

    const updateResponse = await docsClient.documents.batchUpdate({
      documentId: createResponse.data.documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              // The first text inserted into the document must create a paragraph,
              // which can't be done with the `location` property.  Use the
              // `endOfSegmentLocation` instead, which assumes the Body if
              // unspecified.
              endOfSegmentLocation: {},
              text: body,
            },
          },
        ],
      },
    });

    return createResponse.data.documentId;
  }

  async sendEmail({
    title,
    body,
    recipient,
  }: {
    title: string;
    body: string;
    recipient: string;
  }) {
    const gmail = google.gmail({ version: "v1", auth: this.client });

    try {
      const res = await gmail.users.messages.send({
        userId: "me",

        requestBody: {
          raw: btoa(
            [
              `To: <${recipient}>`,
              `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(title)))}?=`,
              `Content-Type: text/plain; charset="UTF-8"`,
              `Content-Transfer-Encoding: base64`,
              ``,
              btoa(unescape(encodeURIComponent(body))),
            ].join("\n"),
          ),
          // payload: {
          //   body: {
          //     data: btoa(body),
          //   },
          // },
        },
      });

      return res.data.id;
    } catch (error) {
      console.error("Error sending email", error);
      return "Error sending email";
    }
  }
}

export default Google;
