
import prisma from '../../../../../lib/prisma';
import { getSession } from 'next-auth/react';
import { JWTmiddleware } from '../../../../../middlewares/JWT_middleware';

export default async function handle(req, res) {
    const session = await getSession({ req });
    if(!JWTmiddleware(req,session))
    {
        res.json({"error":"Forbidden"})
        return;
    }

    const userId = req.query.id;
    
    if (req.method === 'POST') {
        const result = await prisma.userInfo.create({
            data: { 
                users: {connect:{id:userId}}
            },
        });
        res.json(result);
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
}