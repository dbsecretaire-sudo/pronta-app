import NextAuth from "next-auth";
import { authOptions } from "./config";
import "./types"; 

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
