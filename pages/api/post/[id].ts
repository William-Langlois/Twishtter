// pages/api/post/[id].ts

import prisma from '../../../lib/prisma';
import {JWTmiddleware } from '../../../middlewares/JWT_middleware';
import { getSession } from 'next-auth/react';


// DELETE /api/post/:id
export default async function handle(req, res) {
  const session = await getSession({ req });
  if(!JWTmiddleware(req,session))
  {
      res.json({"error":"Forbidden"})
      return;
  }

  const postId = req.query.id;
  if (req.method === 'DELETE') {
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    res.json(post);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}
