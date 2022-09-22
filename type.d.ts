import type { DefaultUser } from 'next-auth';

declare module 'module'  {
    interface userInfo {
        phone:String;
        firstname:String;
        lastname:String;
    }
}

declare module 'next-auth' {
    interface Session {
        user?: DefaultUser & {
            id: string;
        };
    }
}