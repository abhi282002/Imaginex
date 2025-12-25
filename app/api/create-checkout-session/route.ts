import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: token.email as string,
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-12-15.clover',
      appInfo: {
        name: 'imaginex',
      },
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?payment_canceled=true`,
      metadata: {
        userId: user.id,
        email: user.email,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          email: user.email,
        },
      },
    });
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
