import "next-auth"

declare module "next-auth" {
    interface User {
        id: string;
        username: string;
        image: string;
        name: string;
        email: string;
        emailVerified: boolean;
    }

    interface Session {
        user: User;
        expires: ISODateString;
    }
}