import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { UserusageModule } from './userusage/userusage.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    TaskModule,
    UserusageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
