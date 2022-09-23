import type { DefaultUser } from 'next-auth';

interface userInfo {
    phone:String;
    firstname:String;
    lastname:String;
}


declare module 'next-auth' {
    interface Session {
        user?: DefaultUser & {
            id: string;
        };
        roles:String;
    }
}