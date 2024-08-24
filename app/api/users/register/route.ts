import Connection from '@/database/config';
import User from '@/models/user';
import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server';
Connection();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log(body);
    const { name, username,email, password } = body;

    if (!name || !username || !password ||!email) {
      
      return new Response(JSON.stringify({message:'Name, Username, Email and Password is required'}), { status: 401 });
    }

    if (!email.endsWith('@nsut.ac.in')) {
      return new Response(JSON.stringify({message:'You must use an NSUT email address (@nsut.ac.in)'}), { status: 401 });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({message:'Password must be at least 8 characters long'}), { status: 401 });
    }

    if (!/[a-z]/.test(password)) {
      return new Response(JSON.stringify({message:'Password must contain at least one lowercase letter'}), { status: 401 });
    }

    if (!/[A-Z]/.test(password)) {
      return new Response(JSON.stringify({message:'Password must contain at least one uppercase letter'}), { status: 401 });
    }

    if (!/\d/.test(password)) {
      return new Response(JSON.stringify({message:'Password must contain at least one number'}), { status: 401 });
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return new Response(JSON.stringify({message:'Password must contain at least one special character'}), { status: 401 });
    }

    const user = await User.findOne({ email });
    if (user) {
      return new Response('Username already exist', { status: 400 });
    }

    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response('User saved successfully', { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};