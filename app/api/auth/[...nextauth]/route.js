import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { User } from "../../models/user.model.js";

export const handler = NextAuth.default({
  providers: [
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENTID,
      clientSecret: process.env.GITHUB_CLIENTSECRET,
    }),
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
    }),
    CredentialProvider.default({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        console.log(`Email: ${email}, Password: ${password}`);

        if (typeof email !== "string") {
          throw new Error("Invalid Email");
        }

        const user = await User.findOne({ email });
        if (!user) throw new Error("User not Found");

        const isValidPassword = await bcryptjs.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid Password");
        }

        return { email: user.email, id: user.id };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/signup",
  },
});

export { handler as GET, handler as POST };
