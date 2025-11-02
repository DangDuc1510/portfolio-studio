import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';

// POST /api/customers/inquiry (public endpoint)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const createdCustomer = await new Customer(body).save();
    return NextResponse.json(createdCustomer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

