import NextAuth from "next-auth"
import Providers  from "next-auth/providers"
import { Magic } from "@magic-sdk/admin"
import { NextApiRequest, NextApiResponse } from 'next';

const magic = new Magic(process.env.MAGIC_SECRET_KEY);


export default NextAuth({
    session:{
        jwt:true,
    },
    pages:{
        signIn: '/login'
    },
    providers:[
        Providers.Credentials({
            name : ' Magic Link ',
            credentials: {
                did: {label: 'DID Token' , type : 'text'},
            },
            async authorize( {did} : {did : string},req ){
                console.log(did + " this is the didtoken")
                magic.token.validate(did)

                const medtadata = await magic.users.getMetadataByToken(did);
                console.log(medtadata)
                return {...medtadata};
            }
        }),
        // Providers.Google({
        //     clientId: process.env.GOOGLE_ID,
        //     clientSecret:process.env.GOOGLE_SECRET
        // })
    ]
})