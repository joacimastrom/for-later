import User from "@/Model/User";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "./connectDB";

export const authOptions: NextAuthOptions = {
  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: process.env.NEXTAUTH_SECRET,

  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await connectDB();
        // Find the user in the database
        const user = await User.findOne({ email: credentials?.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Check if the entered password matches the hashed password
        const isPasswordValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }

        // Return the user object on success
        return { email: user.email, name: user.name, id: user._id };
      },
    }),
  ],
  callbacks: {
    session: async ({ session }) => {
      await connectDB();
      const sessionUser = await User.findOne({ email: session.user.email });

      session.user.id = sessionUser._id;

      return session;
    },
    signIn: async ({ profile }) => {
      await connectDB();

      if (!profile?.email) {
        throw new Error("No profile");
      }

      await User.findOneAndUpdate(
        { email: profile.email },
        { name: profile.name, email: profile.email },
        {
          upsert: true,
        }
      );

      return true;
    },
  },
};
