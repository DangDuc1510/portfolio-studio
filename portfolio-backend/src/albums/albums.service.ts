import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Album, AlbumDocument } from './schemas/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(@InjectModel(Album.name) private albumModel: Model<AlbumDocument>) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const albumData = {
      ...createAlbumDto,
      ...(createAlbumDto.productIds && {
        productIds: createAlbumDto.productIds.map(
          (id) => new Types.ObjectId(id),
        ),
      }),
    };
    const createdAlbum = new this.albumModel(albumData);
    return createdAlbum.save();
  }

  async findAll(): Promise<Album[]> {
    return this.albumModel.find().exec();
  }

  async findOne(id: string): Promise<Album | null> {
    return this.albumModel.findById(id).exec();
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album | null> {
    const updateData = {
      ...updateAlbumDto,
      ...(updateAlbumDto.productIds && {
        productIds: updateAlbumDto.productIds.map(
          (id) => new Types.ObjectId(id),
        ),
      }),
    };
    return this.albumModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async remove(id: string): Promise<Album | null> {
    return this.albumModel.findByIdAndDelete(id).exec();
  }
}
