import jwt, { JwtPayload } from "jsonwebtoken";

const tokenSecrete = process.env.TOKEN_SECRETE!;

export const generateToken = ({ id, email }: { id: string; email: string }) => {
    return jwt.sign({
        id,
        email
    }, 
    tokenSecrete, 
    { expiresIn : "2d" });
}

export const verifyToken = (token : string) => {
    const decoded = jwt.verify(token, tokenSecrete) as JwtPayload | string;
    if (typeof decoded === "object" && "id" in decoded) {
        return decoded?.id as string;
    }
}
