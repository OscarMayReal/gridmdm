import type { SessionData } from "./keystone";

declare global {
    namespace Express {
        interface Request {
            sessionData?: SessionData;
        }
    }
}
