import { User } from '../types/user';

declare module 'express-session' {
    interface SessionData {
        user?: User;
    }
}

declare module 'express' {
    interface Request {
        user?: User;
    }
}
