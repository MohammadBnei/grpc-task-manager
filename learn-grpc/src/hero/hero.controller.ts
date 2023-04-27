/* eslint-disable @typescript-eslint/no-unused-vars */
import { Metadata, status } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  CreateRequest,
  CreateResponse,
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  HeroCRUDServiceController,
  HeroCRUDServiceControllerMethods,
  UpdateRequest,
  UpdateResponse,
} from 'src/stubs/hero/hero';
import { HeroService } from './hero.service';

@Controller('hero')
@HeroCRUDServiceControllerMethods()
export class HeroController implements HeroCRUDServiceController {
  constructor(private heroService: HeroService) {}

  get(request: GetRequest, metadata?: Metadata): GetResponse {
    if (!request.id) {
      return {
        heroes: this.heroService.getAll(),
      };
    }

    const hero = this.heroService.findHero(+request.id);

    if (!hero) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Hero with id ${request.id} not found`,
      });
    }

    return {
      heroes: [hero],
    };
  }

  create(
    request: CreateRequest,
    metadata?: Metadata,
  ): CreateResponse | Observable<CreateResponse> | Promise<CreateResponse> {
    const hero = this.heroService.createHero(request);

    return {
      hero,
    };
  }
  update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): UpdateResponse | Observable<UpdateResponse> | Promise<UpdateResponse> {
    const hero = this.heroService.updateHero(+request.id, {
      name: request.name,
      power: request.power,
    });

    return {
      hero,
    };
  }

  delete(
    request: DeleteRequest,
    metadata?: Metadata,
  ): DeleteResponse | Observable<DeleteResponse> | Promise<DeleteResponse> {
    const hero = this.heroService.deleteHero(+request.id);

    return {
      hero,
    };
  }
}
