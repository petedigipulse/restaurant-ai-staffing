import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';
export const revalidate = false;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


