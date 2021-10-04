import { FirebaseAdapter } from '@next-auth/firebase-adapter';
import NextAuth from 'next-auth';
import { session } from 'next-auth/client';
import Providers from 'next-auth/providers';
import firebase from '../../../firebase/clientApp';

const firestore = firebase.firestore();

export default NextAuth({
  //if we use jwt then sessions are not back up to the db
  // session:{
  //     jwt:true,
  // },
  pages: {
    signIn: '/login',
  },
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: FirebaseAdapter(firestore),
  callbacks: {
    async session(session, user) {
      session.user['youtube'] = user.youtube;
      session.user['id'] = user.id;
      return session;
    },
  },
});
