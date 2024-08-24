import Connection from '@/database/config';
import User from '@/models/user';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'

Connection();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({message:'Email and Password is required'}), { status: 401 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({message:'Email does not exist'}), { status: 400 });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return new Response(JSON.stringify({message:'Incorrect Password'}), { status: 400 });
    }

    const tokenData = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRETKEY, { expiresIn: '1d' });

    const response = NextResponse.json({ message: 'Login successfull' });

    response.cookies.set('token', token, { httpOnly: true });
    return response;
  } catch (error: any) {
    console.log('Error', error.message);
    return new Response('Something went wrong ', { status: 500 });
  }
};