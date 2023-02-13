import { Injectable } from '@nestjs/common';
import { ITask } from 'src/task/entity/task.dto';
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

  checkTask(task: Partial<ITask>): void {
    let result: ProfanityResult = this.profanity(task.name);
    if (result.isBadWord) throw this.createError(result);

    if (!task.fields) return;

    for (const [key, value] of Object.entries(task.fields)) {
      result = this.profanity(key);
      if (result.isBadWord) throw this.createError(result);

      result = this.profanity(value);
      if (result.isBadWord) throw this.createError(result);
    }
  }

  private createError(profanityCheck: ProfanityResult): Error {
    return new Error(
      `${profanityCheck.detectedWord} is a profanity (${profanityCheck.profanityWordRelated})`,
    );
  }
}
