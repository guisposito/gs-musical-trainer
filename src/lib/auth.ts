import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { supabaseServer } from './supabase-server';

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    id: 'credentials',
    name: 'Email e senha',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Senha', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      const { data: userRow, error } = await supabaseServer
        .from('users')
        .select('id, email, password_hash, name')
        .eq('email', credentials.email.trim().toLowerCase())
        .single();
      if (error || !userRow) return null;
      const valid = await compare(credentials.password, userRow.password_hash);
      if (!valid) return null;
      return {
        id: userRow.id,
        email: userRow.email,
        name: userRow.name ?? userRow.email,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user?.id) token.id = user.id;
      return token;
    },
    session: ({ session, token }) => {
      if (session?.user) {
        session.user.id = (token.id as string) ?? token.sub ?? '';
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};
