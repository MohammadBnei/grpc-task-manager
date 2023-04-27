import { Module } from '@nestjs/common';
import { FightController } from './fight.controller';
import { HeroService } from 'src/hero/hero.service';
import { HeroModule } from 'src/hero/hero.module';

@Module({
  imports: [HeroModule],
  controllers: [FightController],
  providers: [HeroService],
})
export class FightModule {}
