import { Injectable } from '@nestjs/common';
import { Task } from 'src/stubs/task/v1beta/message';
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

  checkTask(task: Partial<Task>): void {
    let result: ProfanityResult = this.profanity(task.name || '');
    if (result.isBadWord) throw this.createError(result);

    if (!task.fields) return;

    for (const { name, value } of task.fields) {
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
