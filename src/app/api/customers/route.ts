import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';
import mongoose from 'mongoose';
import { requireApiKey } from '@/lib/api-key-guard';

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

function validateObjectId(id: string, entityName: string = 'Resource'): void {
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ${entityName} ID: ${id}`);
  }
}

// GET /api/customers
export async function GET(request: NextRequest) {
  try {
    requireApiKey(request);
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    let sortByField = sortBy;
    if (sortByField === 'createdAt') {
      sortByField = 'submissionDate';
    }
    const sort: any = { [sortByField]: sortOrder === 'asc' ? 1 : -1 };

    const [data, total] = await Promise.all([
      Customer.find(query).sort(sort).skip(skip).limit(limit).exec(),
      Customer.countDocuments(query).exec(),
    ]);

    // Enrich data with service count and isReturningCustomer flag
    const enrichedData = await Promise.all(
      data.map(async (customer) => {
        const orConditions: any[] = [{ email: customer.email }];
        
        if (customer.phone && customer.phone.trim() !== '') {
          orConditions.push({ phone: customer.phone });
        }
        
        const countQuery = orConditions.length > 1 
          ? { $or: orConditions }
          : { email: customer.email };
        
        const serviceCount = await Customer.countDocuments(countQuery).exec();
        const isReturningCustomer = serviceCount > 1;
        
        let previousNote: string | null = null;
        if (isReturningCustomer) {
          const noteQuery: any = {
            status: 'completed',
            _id: { $ne: customer._id },
          };
          
          if (orConditions.length > 1) {
            noteQuery.$or = orConditions;
          } else {
            noteQuery.email = customer.email;
          }
          
          noteQuery.$and = [
            { note: { $exists: true } },
            { note: { $ne: null } },
            { note: { $ne: '' } },
          ];
            
          const previousCompletedCustomer = await Customer
            .findOne(noteQuery)
            .sort({ submissionDate: -1 })
            .exec();
          
          if (previousCompletedCustomer && previousCompletedCustomer.note) {
            previousNote = previousCompletedCustomer.note;
          }
        }
        
        return {
          ...customer.toObject(),
          serviceCount,
          isReturningCustomer,
          previousNote,
        };
      })
    );

    return NextResponse.json({
      data: enrichedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/customers (for public inquiry)
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

