import NextAuth from "next-auth"
import Providers  from "next-auth/providers"
import { NextApiRequest, NextApiResponse } from 'next';
import {FirebaseAdapter} from "@next-auth/firebase-adapter"

import firebase from "firebase/app"
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAJPFkBzomDzlU57jmAEvlbsDycz0cmtJk",
    authDomain: "buy-me-crypto.firebaseapp.com",
    projectId: "buy-me-crypto",
    storageBucket: "buy-me-crypto.appspot.com",
    messagingSenderId: "888535435161",
    appId: "1:888535435161:web:6dcc279641364c0bfb3508"
  };

const firestore = (
    firebase.apps[0] ?? firebase.initializeApp(firebaseConfig)
  ).firestore()

export default NextAuth({
    //if we use jwt then sessions are not back up to the db
    // session:{
    //     jwt:true,
    // },
    pages:{
        signIn: '/login'
    },
    providers:[
        Providers.Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret:process.env.GOOGLE_SECRET
        })
    ],
    adapter : FirebaseAdapter(firestore)
})