import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { ApiError } from 'next/dist/server/api-utils';

// This function can be marked `async` if using `await` inside
export function JWTmiddleware(request, token) {
    const CryptoJS = require('crypto-js');
    const at_KEY = process.env.ACCESS_TOKEN_ENCRYPTION_KEY;
    if(token != null && typeof(token) != typeof(undefined))
    {
        if(config.matcher.indexOf(request.url) != -1){
            return true;
        }
        else
        {
            const decryptedToken = CryptoJS.AES.decrypt(token,at_KEY).toString(CryptoJS.enc.Utf8)
            console.log(decryptedToken);
            if(decryptedToken.indexOf("TwishtterAccessToken") != -1)
            {
                return true;
            }
            return false;
        }
    }
    else{
        return false;
    }
    
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [process.env.BASE_URL+'/api/auth/signin']
}