// pages/api/auth/[...nextauth].ts

import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '../../../lib/prisma';

import GoogleProvider from "next-auth/providers/google";

export type Session = {
  user:{id:String};
}


const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
    
  ],
  callbacks: {

    async session({session, token, user}) {

      if(user.info == null || typeof(user.info) == typeof(undefined))
      {
        var res = await fetch(`${process.env.BASE_URL}/api/user/${user.id}/createInfos`, {
          method:'POST'
        });
        var response = await res.json();
      }
      

      const CryptoJS = require('crypto-js');

      //For access_token
      const now = Date.now();
      const generationDate = `${now.toString()}`;

      const at_KEY = process.env.ACCESS_TOKEN_ENCRYPTION_KEY;
      const ut_KEY = process.env.USER_TOKEN_ENCRYPTION_KEY;

      const accessTokenBase =  `[TwishtterAccessToken[${user.id.toString()}[${generationDate}]]]`;
      const userTokenBase =  `[TwishtterUserToken${user.id.toString()}[${user.roles}[${generationDate}]]]`;

      const encryptedAccessToken = CryptoJS.AES.encrypt(accessTokenBase,at_KEY)
      const STRencryptedAccessToken = encryptedAccessToken.toString();

      const encryptedUserToken = CryptoJS.AES.encrypt(userTokenBase,ut_KEY)
      const STRencryptedUserToken = encryptedUserToken.toString();
      

    session = {
      ...session,
      user: {
          id: user.id,
          roles: user.roles,
          user_token: STRencryptedUserToken,
          ...session.user
      },
      access_token:STRencryptedAccessToken
      }
      return session
    }
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET
};