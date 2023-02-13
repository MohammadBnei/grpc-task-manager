import { Module } from '@nestjs/common';
import { ProfanityService } from './profanity.service';

@Module({
  providers: [ProfanityService],
  exports: [ProfanityService],
})
export class ProfanityModule {}
