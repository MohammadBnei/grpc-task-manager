import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Race, RaceSchema } from './entity/race.schema';
import { RaceService } from './race.service';
import { RaceController } from './race.controller';
import { ProfanityService } from 'src/profanity/profanity.service';
import { FieldController } from './field.controller';
import { StreamsService } from 'src/streams/streams.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Race.name, schema: RaceSchema }]),
    AuthModule,
  ],
  providers: [RaceService, ProfanityService, StreamsService],
  controllers: [RaceController, FieldController],
})
export class RaceModule {}
