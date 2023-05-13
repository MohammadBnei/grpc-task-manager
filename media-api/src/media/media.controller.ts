import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
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
import { MediaService } from './media.service';
import {
  CreateMediaDto,
  DeleteMediaDto,
  GetMediaDto,
  ListMediasDto,
} from './entities/media.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { status } from '@grpc/grpc-js';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @GrpcMethod('MediaService')
  async CreateMedia(req: MediaRequest): Promise<MediaResponse> {
    try {
      await this.validateDto(req, CreateMediaDto);

      return await this.mediaService.create(req);
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @GrpcMethod('MediaService')
  async ListMediaForTask(req: ListMediasRequest): Promise<ListMediasResponse> {
    try {
      await this.validateDto(req, ListMediasDto);

      return await this.mediaService.findAllForTask(req);
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @GrpcMethod('MediaService')
  async GetMedia(req: GetMediaRequest): Promise<GetMediaResponse> {
    try {
      await this.validateDto(req, GetMediaDto);

      return await this.mediaService.getMedia(req);
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @GrpcMethod('MediaService')
  async DeleteMedia(req: DeleteMediaRequest): Promise<DeleteMediaResponse> {
    try {
      await this.validateDto(req, DeleteMediaDto);

      return await this.mediaService.deleteMedia(req);
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  private async validateDto(data: any, Dto: any) {
    const dto = plainToInstance(Dto, data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: errors
          .map(
            ({ value, property, constraints }) =>
              `${value} is not a valid ${property} value (${Object.values(
                constraints,
              ).join(', ')})`,
          )
          .join('\n'),
      });
    }
  }

  private handlePrismaErr(err: Error) {
    console.error(err);
    if (err instanceof RpcException) throw err;
    else throw new RpcException(err);
  }
}
