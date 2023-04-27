/* eslint-disable @typescript-eslint/no-unused-vars */
import { Metadata, status } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { HeroService } from 'src/hero/hero.service';
import {
  FightRequest,
  FightResponse,
  FightServiceController,
  FightServiceControllerMethods,
} from 'src/stubs/hero/hero';

@Controller('fight')
@FightServiceControllerMethods()
export class FightController implements FightServiceController {
  constructor(private heroService: HeroService) {}

  fight(
    request: FightRequest,
    metadata?: Metadata,
  ): FightResponse | Promise<FightResponse> | Observable<FightResponse> {
    const attacker = this.heroService.findHero(+request.attackingId);
    const defender = this.heroService.findHero(+request.defendingId);

    if (!attacker || !defender) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Hero with id ${request.attackingId} or ${request.defendingId} not found`,
      });
    }

    defender.hp -= attacker.power;

    this.heroService.updateHero(defender.id, defender);

    return {
      attacker,
      defender,
    };
  }
}
