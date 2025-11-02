import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private customerModel: Model<CustomerDocument>) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Check if email already exists to determine service count
    const existingCustomers = await this.customerModel.find({ 
      email: createCustomerDto.email 
    }).exec();
    
    const createdCustomer = new this.customerModel(createCustomerDto);
    return createdCustomer.save();
  }

  async findOne(id: string): Promise<Customer | null> {
    return this.customerModel.findById(id).exec();
  }

  async findAll(filters?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: Customer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const query: any = {};

    // Search filter (name, email, phone, message)
    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } },
        { message: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Status filter
    if (filters?.status) {
      query.status = filters.status;
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const skip = (page - 1) * limit;

    // Sort options - use submissionDate if sortBy is createdAt, as customers use submissionDate
    let sortByField = filters?.sortBy || 'submissionDate';
    if (sortByField === 'createdAt') {
      sortByField = 'submissionDate';
    }
    const sortOrder = filters?.sortOrder === 'asc' ? 1 : -1;
    const sort: any = { [sortByField]: sortOrder };

    const [data, total] = await Promise.all([
      this.customerModel.find(query).sort(sort).skip(skip).limit(limit).exec(),
      this.customerModel.countDocuments(query).exec(),
    ]);

    // Enrich data with service count and isReturningCustomer flag
    const enrichedData = await Promise.all(
      data.map(async (customer) => {
        // Check for duplicate by email OR phone
        const orConditions: any[] = [{ email: customer.email }];
        
        // Add phone check if phone exists
        if (customer.phone && customer.phone.trim() !== '') {
          orConditions.push({ phone: customer.phone });
        }
        
        const query = orConditions.length > 1 
          ? { $or: orConditions }
          : { email: customer.email };
        
        const serviceCount = await this.customerModel.countDocuments(query).exec();
        const isReturningCustomer = serviceCount > 1;
        
        // Get note from previous completed orders (same email or phone)
        let previousNote: string | null = null;
        if (isReturningCustomer) {
          const noteQuery: any = {
            status: 'completed',
            _id: { $ne: customer._id },
          };
          
          // Add email/phone filter
          if (orConditions.length > 1) {
            noteQuery.$or = orConditions;
          } else {
            noteQuery.email = customer.email;
          }
          
          // Add note filter - check for non-empty note
          noteQuery.$and = [
            { note: { $exists: true } },
            { note: { $ne: null } },
            { note: { $ne: '' } },
          ];
            
          const previousCompletedCustomer = await this.customerModel
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

    return {
      data: enrichedData as any,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer | null> {
    return this.customerModel.findByIdAndUpdate(id, updateCustomerDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Customer | null> {
    return this.customerModel.findByIdAndDelete(id).exec();
  }
}
