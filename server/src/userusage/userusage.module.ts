import { Module } from '@nestjs/common';
import { UserusageController } from './userusage.controller';
@Module({
  controllers: [UserusageController],
})
export class UserusageModule {}
