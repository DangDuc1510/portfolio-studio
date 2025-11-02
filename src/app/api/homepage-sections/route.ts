import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HomepageSection from '@/lib/models/HomepageSection';

// GET /api/homepage-sections
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const sections = await HomepageSection.find().exec();
    return NextResponse.json(sections);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

