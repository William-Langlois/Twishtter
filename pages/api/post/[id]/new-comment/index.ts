
import prisma from '../../../../../lib/prisma';
import { getSession } from 'next-auth/react';
import { connect } from 'http2';
import {JWTmiddleware } from '../../../../../middlewares/JWT_middleware';

export default async function handle(req, res) {
    const session = await getSession({ req });
    if(!JWTmiddleware(req,session.access_token))
    {
        res.json({"error":"Forbidden"})
        return;
    }

    const postId = req.query.id;
    const {content} = req.body;
    
    if (req.method === 'POST') {

        const result = await prisma.comment.create({
            data: { 
                content: content,
                post: {connect:{id:postId}},
                author: { connect: { email: session?.user?.email } }
            },
        });
        res.json(result);
    } 
    else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
}