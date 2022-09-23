
import prisma from '../../../../../lib/prisma';
import { getSession } from 'next-auth/react';
import { JWTmiddleware } from '../../../../../middlewares/JWT_middleware';

export default async function handle(req, res) {
    
    const session = await getSession({ req });
    if(!JWTmiddleware(req,session.access_token))
    {
        res.json({"error":"Forbidden"})
        return;
    }    
    
    const userId = req.query.id;
    const userinfoId = req.query.infoId;
    const infos = req.body;
    
    if (req.method === 'PUT') {
        const result = await prisma.userInfo.update({
            where:{id:String(userinfoId)},
            data: { 
                /*
                phone: infos.phone,
                firstname:infos.firstname,
                lastname:infos.lastname,
                */
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