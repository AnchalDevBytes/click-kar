import { prisma } from "@/server/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateToken } from "@/utils/auth";

interface SignupRequestInterface {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password }: SignupRequestInterface = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All field are Required!",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exist in DB!",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Error while creating user!",
        },
        {
          status: 500,
        }
      );
    }

    const newToken = generateToken({ id: user.id, email });

    const response = NextResponse.json(
      {
        success: true,
        message: "User created successfully!",
        user: user,
      },
      {
        status: 200,
      }
    );

    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: true,
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        {
          status: 500,
        }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
