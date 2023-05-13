import { Injectable } from '@nestjs/common';
import {
  DeleteMediaRequest,
  DeleteMediaResponse,
  GetMediaRequest,
  GetMediaResponse,
  ListMediasRequest,
  ListMediasResponse,
  MediaRequest,
  MediaResponse,
} from '../stubs/media/v1alpha/media';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MediaDocument, Media } from './entities/media.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
  ) {}

  async create(data: MediaRequest): Promise<MediaResponse> {
    try {
      const createdMedia = new this.mediaModel(data);
      return await createdMedia.save();
    } catch (error) {
      if ((error?.message as string)?.includes('E11000')) {
        throw new Error(`${data.name} name is taken`);
      }
    }
  }

  async findAllForTask(data: ListMediasRequest): Promise<ListMediasResponse> {
    try {
      const medias = await this.mediaModel.find({ taskId: data.taskId }).exec();
      return { medias: medias };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMedia(data: GetMediaRequest): Promise<GetMediaResponse> {
    try {
      const media = await this.mediaModel.findOne({ name: data.name }).exec();
      return { media: media };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteMedia(data: DeleteMediaRequest): Promise<DeleteMediaResponse> {
    try {
      await this.mediaModel.findOneAndDelete({ name: data.name }).exec();
      return { isDeleted: true };
    } catch (error) {
      return { isDeleted: false };
      throw new Error(error);
    }
  }
}
