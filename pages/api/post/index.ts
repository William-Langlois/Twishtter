// pages/api/post/index.ts

import { getSession } from 'next-auth/react';
import {JWTmiddleware } from '../../../middlewares/JWT_middleware';
import prisma from '../../../lib/prisma';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const session = await getSession({ req });
  console.log(JWTmiddleware(req,session.access_token))
  if(!JWTmiddleware(req,session.access_token))
  {
      res.json({"error":"Forbidden"})
      return;
  }
  const { title, content } = req.body;

  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}
