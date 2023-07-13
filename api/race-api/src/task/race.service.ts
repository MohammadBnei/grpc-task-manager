import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FieldsArray, Race, RaceDocument } from './entity/race.schema';
import { CreateRaceDto, UpdateRaceDto } from './entity/race.dto';
import { Race as RacePb } from '../stubs/race/message';
@Injectable()
export class RaceService {
  constructor(@InjectModel(Race.name) private raceModel: Model<RaceDocument>) {}

  toRacePb(race: Partial<RaceDocument>): RacePb {
    return {
      name: race.name,
      fields: race.fieldsArray,
      dueDate: race.dueDate.toISOString(),
      done: race.done,
      id: race._id.toString(),
    };
  }

  async create(createRaceDto: CreateRaceDto): Promise<Race> {
    try {
      const createdRace = new this.raceModel(createRaceDto);
      return await createdRace.save();
    } catch (error) {
      if ((error?.message as string)?.includes('E11000')) {
        throw new Error(`${createRaceDto.name} name is taken`);
      }
    }
  }

  async findAll(): Promise<Race[]> {
    return this.raceModel.find().exec();
  }

  async find(id: string | number, name: string) {
    const race = await this.raceModel.findOne({ id, name });

    if (!race) {
      throw new Error(`race with id ${id} or name ${name} not found`);
    }

    return race;
  }

  async addField(raceName: string, ...fields: FieldsArray) {
    const race = await this.find('', raceName);

    race.fieldsArray = fields;

    await race.save();

    return race;
  }

  async deleteField(raceName: string, fieldName: string) {
    const race = await this.find('', raceName);

    race.fields.delete(fieldName);

    await race.save();

    return race;
  }

  async updateRace(
    { id, name }: { name?: string; id?: string },
    uRace: UpdateRaceDto,
  ): Promise<Race> {
    let race: RaceDocument;
    if (id) {
      race = await this.raceModel.findById(id);
    } else {
      race = await this.raceModel.findOne({ name });
    }

    if (!race) {
      throw new Error(`race with id ${id} or name ${name} not found`);
    }

    Object.assign(race, uRace);

    await race.save();
    return race;
  }

  async deleteRace(id: number | string) {
    const race = await this.raceModel.findOneAndDelete({
      name: { $regex: `^${id}$`, $options: 'i' },
    });

    if (!race) {
      throw new Error(`race with name ${id} not found`);
    }

    return race;
  }
}
