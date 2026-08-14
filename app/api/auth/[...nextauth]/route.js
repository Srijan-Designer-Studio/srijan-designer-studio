import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (
          credentials?.email === process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL &&
          credentials?.password === process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD
        ) {
          return {
            id: "demo-admin-999",
            name: "Demo Admin",
            email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL,
            role: "admin",
          };
        }
        return null;
      }
    })
  ],
session: {
  strategy: "jwt",
  },
secret: process.env.NEXTAUTH_SECRET,
  pages: {
  signIn: '/login', 
  },
callbacks: {
    async jwt({ token, user }) {
    if (user) {
      if (user.role) {
        token.role = user.role;
      }
      else {
        token.role = (user.email === process.env.ADMIN_EMAIL) ? 'admin' : 'customer';
      }
    }
    return token;
  },
    async session({ session, token }) {
    if (session.user) {
      session.user.role = token.role;
    }
    return session;
  }
}
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };