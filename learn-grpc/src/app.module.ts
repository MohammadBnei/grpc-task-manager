import { Module } from '@nestjs/common';
import { HeroModule } from './hero/hero.module';
import { FightModule } from './fight/fight.module';

@Module({
  imports: [HeroModule, FightModule],
})
export class AppModule {}
