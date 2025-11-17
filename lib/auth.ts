import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from './prisma';
import { Plan } from '@prisma/client';

interface CommonProps {
  email: string;
  name: string;
  avatar: string;
  plan: Plan;
  usageCount: number;
  usageLimit: number;
}

const common = async ({
  email,
  name,
  avatar,
  plan,
  usageCount,
  usageLimit,
}: CommonProps) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          avatar,
          plan,
          usageCount,
          usageLimit,
        },
      });
      return user;
    }
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile: async (profile) => {
        const user = await common({
          email: profile.email,
          name: profile.name,
          avatar: profile.picture!,
          plan: 'Free',
          usageCount: 0,
          usageLimit: 3,
        });
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  callbacks: {
    
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.avatar = user.image;
        token.plan = 'Free';
        token.usageCount = 0;
        token.usageLimit = 3;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.avatar = token?.picture!;
      session.user.email = token?.email!;
      session.user.plan = token.plan as unknown as string;
      session.user.usageCount = token?.usageCount as unknown as number;
      session.user.usageLimit = token?.usageLimit as unknown as number;

      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};
