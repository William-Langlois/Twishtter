// pages/api/publish/[id].ts

import prisma from '../../../lib/prisma';
import { getSession } from 'next-auth/react';
import {JWTmiddleware } from '../../../middlewares/JWT_middleware';

// PUT /api/publish/:id
export default async function handle(req, res) {
  const session = await getSession({ req });
  if(!JWTmiddleware(req,session.access_token))
  {
      res.json({"error":"Forbidden"})
      return;
  }
  
  const postId = req.query.id;
  const post = await prisma.post.update({
    where: { id: postId },
    data: { published: true },
  });
  res.json(post);
}
