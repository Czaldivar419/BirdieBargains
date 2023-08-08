import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';

const adminEmails = [process.env.ADMIN_EMAIL];

const secret = crypto.randomBytes(64).toString('hex');

const authOptions = {
  secret: secret,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      redirect_uri: 'https://birdie-bargains-admin/api/auth/callback/google',
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    // ...
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession({ req, res }, authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    throw "Unauthorized request";
  }
}