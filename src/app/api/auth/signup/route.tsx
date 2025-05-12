import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(
  req: Request,
){
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if(!email || !password){
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('Auth')
      .select('id')
      .eq('email', email)
      .single();

    if(existingUser){
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: newUser, error: insertError } = await supabase
      .from('Auth')
      .insert([
        {
          name,
          email,
          password: hashedPassword,
         
        }
      ])
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError); // Debug log
      return NextResponse.json(
        { error: insertError.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: newUser
    });
    
  } catch(error){
    console.error("REGISTER_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}