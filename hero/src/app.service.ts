import { Injectable } from '@nestjs/common';
import { Hero } from './stubs/hero/v1alpha/hero';

const heroes: Hero[] = [];

@Injectable()
export class AppService {
  create(data: any): Hero {
    const hero = {
      ...data,
      id: heroes.length + 1,
      hp: 100,
    };

    heroes.push(hero);

    return hero;
  }

  findAll(): Hero[] {
    return heroes;
  }

  findById(id: number): Hero {
    return heroes.find((hero) => hero.id === id);
  }

  findByName(name: string): Hero {
    return heroes.find((hero) => hero.name === name);
  }

  update(id: number, data: any): Hero {
    const index = heroes.findIndex((hero) => hero.id === id);

    if (index === -1) {
      throw new Error(`Hero ${id} not found`);
    }

    heroes[index] = {
      ...heroes[index],
      ...data,
    };

    return heroes[index];
  }

  delete(id: number): Hero {
    const index = heroes.findIndex((hero) => hero.id === id);

    if (index === -1) {
      throw new Error(`Hero ${id} not found`);
    }

    const deletedHero = heroes.splice(index, 1)[0];

    return deletedHero;
  }
}
