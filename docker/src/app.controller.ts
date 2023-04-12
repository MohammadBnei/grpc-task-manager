import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateHeroRequest,
  CreateHeroResponse,
  HelloReply,
  HelloRequest,
  Hero,
} from './stub/hero/v1alpha/hero';

const heroList: Hero[] = [];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('HeroService', 'Hello')
  getHello(req: HelloRequest): HelloReply {
    return {
      message: `Hello ${req.name}!`,
    };
  }

  @GrpcMethod('HeroService')
  createHero(req: CreateHeroRequest): CreateHeroResponse {
    const hero = { ...req, id: heroList.length + 1, hp: 100 };

    heroList.push(hero);

    return {
      hero,
    };
  }
}
