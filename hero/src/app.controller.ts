import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AddRequest,
  AddResponse,
  HERO_CR_UD_SERVICE_NAME,
  Hero,
} from './stubs/hero/v1alpha/hero';
import { GrpcMethod } from '@nestjs/microservices';

const heroes: Hero[] = [];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
