import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Hero } from 'src/stubs/hero/hero';

const heroes: Hero[] = [
  {
    id: 1,
    name: 'karim',
    power: 39,
    hp: 100,
  },
  {
    id: 2,
    name: 'valbuena',
    power: 12,
    hp: 100,
  },
];

@Injectable({ durable: true })
export class HeroService {
  getAll(): Hero[] {
    return heroes;
  }
  findHero(id: number): Hero {
    return heroes.find((h) => h.id === id);
  }

  createHero(data: Partial<Hero>): Hero {
    const hero: Hero = {
      ...data,
      id: heroes.length + 1,
      hp: 100,
    };

    heroes.push(hero);

    return hero;
  }

  updateHero(id: number, data: Partial<Hero>): Hero {
    const index = heroes.findIndex((h) => h.id === id);

    if (index === -1) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Hero with id ${data.id} not found`,
      });
    }

    const hero = heroes.splice(index, 1)[0];

    if (data.name) {
      hero.name = data.name;
    }
    if (data.power) {
      hero.power = data.power;
    }
    if (data.hp) {
      hero.hp = data.hp;
    }

    heroes.push(hero);

    return hero;
  }

  deleteHero(id: number): Hero {
    const index = heroes.findIndex((h) => h.id === +id);

    if (index === -1) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Hero with id ${id} not found`,
      });
    }

    const hero = heroes.splice(index, 1)[0];

    return hero;
  }
}
