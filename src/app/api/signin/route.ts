import { prisma } from "@/server/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { generateToken } from "@/utils/auth";

interface SigninRequestInterface {
    email : string;
    password : string;
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } : SigninRequestInterface = await req.json();
        
        if(!email || !password) {
            return NextResponse.json({
                success : false,
                message : "All field are Required!"
            });
        }
    
        const user : User | null = await prisma.user.findUnique({
            where : { email },
        });

        if(!user) {
            return NextResponse.json({ 
                success: false, 
                message: "User does not exist" 
            });
        }

        const isPasswordCorrect : boolean = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) {
            return NextResponse.json({
                success: false, 
                message: "Invalid password",
            })
        }

        const newToken = generateToken({id : user.id, email});
        
        const signInUser = await prisma.user.findUnique({
            where : { id : user.id },
            select : {
                id : true, 
                name : true,
                email : true,
                createdAt : true, 
                updatedAt : true,
            }
        });
    
        if(!signInUser) {
            return NextResponse.json({
                success : false,
                message : "Error while fetching user!"
            });
        }
    
        const response = NextResponse.json(
            {
                success: true,
                message: "User Sign-in successfully!",
                user: signInUser,
            },
            {
                status: 200
            },
        );
    
        response.cookies.set("token", newToken, {
            httpOnly: true,
            secure: true,
        });
        return response;
    } catch (error) {
        if(error instanceof Error) {
            return NextResponse.json(
                { success: false, message: error.message }
            );
        } else {
            return NextResponse.json(
                { success: false, message: "Unknown error occurred" }
            );
        }
    }
}
