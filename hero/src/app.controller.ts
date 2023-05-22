import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AddRequest,
  AddResponse,
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  HERO_CR_UD_SERVICE_NAME,
  Hero,
  HeroCRUDServiceController,
  UpdateRequest,
  UpdateResponse,
  HeroCRUDServiceControllerMethods,
} from './stubs/hero/v1alpha/hero';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

const heroes: Hero[] = [];

@Controller()
@HeroCRUDServiceControllerMethods()
export class AppController implements HeroCRUDServiceController {
  constructor(private readonly appService: AppService) {}
  get(
    request: GetRequest,
    metadata?: Metadata,
  ): GetResponse | Observable<GetResponse> | Promise<GetResponse> {
    throw new Error('Method not implemented.');
  }
  update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): UpdateResponse | Observable<UpdateResponse> | Promise<UpdateResponse> {
    throw new Error('Method not implemented.');
  }
  delete(
    request: DeleteRequest,
    metadata?: Metadata,
  ): DeleteResponse | Observable<DeleteResponse> | Promise<DeleteResponse> {
    throw new Error('Method not implemented.');
  }

  @GrpcMethod(HERO_CR_UD_SERVICE_NAME)
  async add(request: AddRequest): Promise<AddResponse> {
    const hero = {
      ...request,
      id: heroes.length + 1,
      hp: 100,
    };

    heroes.push(hero);

    return {
      hero,
    };
  }
}
