import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HomepageSection from '@/lib/models/HomepageSection';

// GET /api/homepage-sections
export async function GET() {
  try {
    await connectDB();
    const sections = await HomepageSection.find().exec();
    return NextResponse.json(sections);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

