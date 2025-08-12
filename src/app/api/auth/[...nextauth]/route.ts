import NextAuth, { type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "@/lib/env";

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const authOptions: NextAuthOptions = {
  providers: [
    // Only add Google provider if credentials are available
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? [
      Google({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // Placeholder: attach tenant and role defaults
        (token as any).tenantId = (token as any).tenantId ?? `tenant_${(token as any).email}`;
        (token as any).role = (token as any).role ?? "OWNER";
      }
      return token;
    },
    async session({ session, token }) {
      (session as unknown as Record<string, unknown>).tenantId = (token as unknown as Record<string, unknown>).tenantId;
      (session as unknown as Record<string, unknown>).role = (token as unknown as Record<string, unknown>).role;
      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


