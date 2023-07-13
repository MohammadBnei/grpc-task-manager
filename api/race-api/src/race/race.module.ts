import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Race, RaceSchema } from './entity/race.schema';
import { RaceService } from './race.service';
import { RaceController } from './race.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Race.name, schema: RaceSchema }]),
    AuthModule,
  ],
  providers: [RaceService],
  controllers: [RaceController],
})
export class RaceModule {}
