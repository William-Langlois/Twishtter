
import prisma from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';
import { JWTmiddleware } from '../../../../middlewares/JWT_middleware';
export default async function handle(req, res) {
    const session = await getSession({ req });
    if(!JWTmiddleware(req,session))
    {
        res.json({"error":"Forbidden"})
        return;
    }
    
    const userId = req.query.id;
    const user = req.body;

    if (req.method === 'PUT') {
        const result = await prisma.user.update({
            where:{id:String(userId)},
            data: { 
                name: user.name,
                email: user.email,
                image: user.image
            },
        });
        res.json(result);
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
}