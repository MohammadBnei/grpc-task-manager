import { Injectable } from '@nestjs/common';
import { Car } from 'src/stubs/car/v1beta/message';
import { profanity, changeMainLanguage } from 'super-profanity';

interface ProfanityResult {
  detectedWord: string;
  isBadWord: boolean;
  profanityWordRelated: string;
}

@Injectable()
export class ProfanityService {
  profanity: any;
  constructor() {
    changeMainLanguage('fr');
    this.profanity = profanity;
  }

  checkCar(car: Partial<Car>): void {
    let result: ProfanityResult = this.profanity(car.name || '');
    if (result.isBadWord) throw this.createError(result);

    if (!car.fields) return;

    for (const { name, value } of car.fields) {
      result = this.profanity(name);
      if (result.isBadWord) throw this.createError(result);

      result = this.profanity(value);
      if (result.isBadWord) throw this.createError(result);
    }
  }

  checkStr(...fields: string[]): void {
    for (const s of fields) {
      const result = this.profanity(s);
      if (result.isBadWord) throw this.createError(result);
    }
  }

  private createError(profanityCheck: ProfanityResult): Error {
    return new Error(
      `${profanityCheck.detectedWord} is a profanity (${profanityCheck.profanityWordRelated})`,
    );
  }
}
