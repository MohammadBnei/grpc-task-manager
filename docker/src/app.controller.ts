import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  AttackHeroRequest,
  AttackHeroResponse,
  CreateHeroRequest,
  CreateHeroResponse,
  FetchHeroRequest,
  FetchHeroResponse,
  HelloReply,
  HelloRequest,
} from './stub/hero/v1alpha/hero';
import { Metadata, status } from '@grpc/grpc-js';

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
  async createHero(req: CreateHeroRequest): Promise<CreateHeroResponse> {
    try {
      const hero = await this.appService.createHero({
        name: req.name,
        power: req.power,
      });

      return {
        hero,
      };
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message,
      });
    }
  }

  @GrpcMethod('HeroService')
  async fetchHero(
    req: FetchHeroRequest,
    metadata: Metadata,
  ): Promise<FetchHeroResponse> {
    try {
      const token = metadata.get('authorization')[0] as string;
      const res = await this.appService.validateJwt(token);
      console.log({ res });
      if (req.id) {
        const hero = await this.appService.hero({ id: req.id });

        return { heroes: [hero] };
      }

      const heroes = await this.appService.heroes({});

      return {
        heroes,
      };
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message,
      });
    }
  }

  @GrpcMethod('HeroService')
  async attackHero(req: AttackHeroRequest): Promise<AttackHeroResponse> {
    const attacker = await this.appService.hero({ id: req.attackingId });
    if (!attacker) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Attacker not found with id: ' + req.attackingId,
      });
    }

    let defender = await this.appService.hero({ id: req.defendingId });
    if (!defender) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Defender not found with id: ' + req.defendingId,
      });
    }

    defender.hp -= attacker.power;

    defender = await this.appService.updateHero({
      where: { id: defender.id },
      data: {
        hp: defender.hp,
      },
    });

    return {
      attackingHero: attacker,
      defendingHero: defender,
    };
  }
}
