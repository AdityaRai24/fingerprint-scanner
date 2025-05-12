import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
){
  try{
    const body = await req.json();
    const { name, email, password } = body;
    
    if(!email || !password){
      return new NextResponse("Missing email or password", {status: 400});
    }

    const userAlreadyExist = await db.user.findUnique({
        where: {
            email: email,
        }
    })

    if(userAlreadyExist?.id){
      return new NextResponse("User already exists", {status: 409});
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });

    // Don't send the password back in the response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword);
    
  } catch(error){
    console.error("REGISTER_ERROR:", error);
    return new NextResponse("Internal Server Error", {status: 500});
  }
}