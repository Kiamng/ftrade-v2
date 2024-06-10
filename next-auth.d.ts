import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import { Role } from "./types/role.ts";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accountId: string;
    username: string;
    avatarImg: string;
    email: string;
    role: Role;
    token: string;
  }

  interface User extends DefaultUser {
    accountId: string;
    username: string;
    avatarImg: string;
    email: string;
    role: Role;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accountId: string;
    username: string;
    avatarImg: string;
    email: string;
    role: Role;
    token: string;
  }
}
