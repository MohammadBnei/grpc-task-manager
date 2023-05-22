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

@Controller()
@HeroCRUDServiceControllerMethods()
export class AppController implements HeroCRUDServiceController {
  constructor(private readonly appService: AppService) {}
  get(
    request: GetRequest,
    metadata?: Metadata,
  ): GetResponse | Observable<GetResponse> | Promise<GetResponse> {
    let hero: Hero;
    let heroes: Hero[] = [];

    if (request.id) {
      hero = this.appService.findById(request.id);
      return { heroes: [hero] };
    } else if (request.name) {
      hero = this.appService.findByName(request.name);
      return { heroes: [hero] };
    } else {
      heroes = this.appService.findAll();
      return { heroes };
    }
  }
  update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): UpdateResponse | Observable<UpdateResponse> | Promise<UpdateResponse> {
    const id = request.id;

    Object.keys(request).forEach(
      (key) => request[key] === undefined && delete request[key],
    );

    delete request.id;

    const hero = this.appService.update(id, request);

    return { hero };
  }
  delete(
    request: DeleteRequest,
    metadata?: Metadata,
  ): DeleteResponse | Observable<DeleteResponse> | Promise<DeleteResponse> {
    const hero = this.appService.delete(request.id);

    return { hero };
  }

  @GrpcMethod(HERO_CR_UD_SERVICE_NAME)
  async add(request: AddRequest): Promise<AddResponse> {
    const hero = this.appService.create(request);

    return { hero };
  }
}
