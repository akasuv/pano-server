import { Session } from "express-session";

class Context {
  session: Session | null;
  constructor() {
    this.session = null;
  }

  setSession(session: Session) {
    this.session = session;
  }

  getSession() {
    return this.session;
  }
}

const context = new Context();

export default context;
