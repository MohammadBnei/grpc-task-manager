import { Injectable } from '@nestjs/common';
import { Race } from 'src/stubs/race/v1beta/message';
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

  checkRace(race: Partial<Race>): void {
    let result: ProfanityResult = this.profanity(race.name || '');
    if (result.isBadWord) throw this.createError(result);

    if (!race.fields) return;

    for (const { name, value } of race.fields) {
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
