import { Module } from '@nestjs/common';
import { StreamsService } from 'src/streams/streams.service';
import { UserusageController } from './userusage.controller';
@Module({
  controllers: [UserusageController],
  providers: [StreamsService],
})
export class UserusageModule {}
