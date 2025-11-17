import prisma from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
    });
    if (!token?.email) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: token.email as string,
      },
      select: {
        id: true,
        plan: true,
        usageCount: true,
        usageLimit: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      usageCount: user.usageCount,
      usageLimit: user.usageLimit,
      plan: user.plan,
      canUpload: user.usageCount < user.usageLimit,
    });
  } catch (error) {
    console.error('Error fetching usage data:', error);
    return new Response('Internal Server Error', {
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({
    req: request,
  });
  if (!token?.email) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      {
        status: 401,
      },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: token.email as string,
    },
    select: {
      id: true,
      plan: true,
      usageCount: true,
      usageLimit: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        error: 'User not found',
      },
      {
        status: 404,
      },
    );
  }
  if (user.usageCount >= user.usageLimit) {
    return NextResponse.json(
      {
        error: 'Usage limit reached',
        usageCount: user.usageCount,
        usageLimit: user.usageLimit,
        plan: user.plan,
        canUpload: false,
      },
      {
        status: 403,
      },
    );
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      usageCount: user.usageCount + 1,
    },
    select: {
      plan: true,
      usageCount: true,
      usageLimit: true,
    },
  });

  return NextResponse.json({
    usageCount: updatedUser.usageCount,
    usageLimit: updatedUser.usageLimit,
    plan: updatedUser.plan,
    canUpload: updatedUser.usageCount < updatedUser.usageLimit,
  });
}
