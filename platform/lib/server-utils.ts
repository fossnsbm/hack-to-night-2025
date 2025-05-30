import * as argon2 from "argon2";
import * as jose from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const JWT_ALG ="HS256"  

export async function createToken(tid: number, uid: number): Promise<string> {
    return await new jose.SignJWT()
        .setProtectedHeader({ alg: JWT_ALG })
        .setSubject(`${tid}:${uid}`)
        .setExpirationTime('12h')
        .sign(JWT_SECRET)
}

export async function verifyToken(jwt: string): Promise<{ tid: number, uid: number } | null> {
    try {
        const { payload } = await jose.jwtVerify(jwt, JWT_SECRET, {
            algorithms: [JWT_ALG],
            requiredClaims: ["sub"]
        })

        if (payload.sub) {
            const subs = payload.sub.split(":");
            return { tid: parseInt(subs[0]), uid: parseInt(subs[1]) }
        }
    } catch (e) {
        console.warn("could not verify token", jwt, e)
    }

    return null
}

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    
    memoryCost: 65536, 
    timeCost: 3, 
    parallelism: 1, 
  });
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
} 
