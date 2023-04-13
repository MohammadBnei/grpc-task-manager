import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Hero, Prisma } from '@prisma/client';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthServiceClient } from './stubs/auth/v1alpha/service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private authService: AuthServiceClient;

  constructor(
    private prisma: PrismaService,
    @Inject('AUTH_SERVICE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  async hero(
    heroWhereUniqueInput: Prisma.HeroWhereUniqueInput,
  ): Promise<Hero | null> {
    return this.prisma.hero.findUnique({
      where: heroWhereUniqueInput,
    });
  }

  async heroes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.HeroWhereUniqueInput;
    where?: Prisma.HeroWhereInput;
    orderBy?: Prisma.HeroOrderByWithRelationInput;
  }): Promise<Hero[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.hero.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createHero(data: Prisma.HeroCreateInput): Promise<Hero> {
    return this.prisma.hero.create({
      data,
    });
  }

  async updateHero(params: {
    where: Prisma.HeroWhereUniqueInput;
    data: Prisma.HeroUpdateInput;
  }): Promise<Hero> {
    const { where, data } = params;
    return this.prisma.hero.update({
      data,
      where,
    });
  }

  validateJwt(token: string) {
    return firstValueFrom(
      this.authService.validate({
        jwt: token,
      }),
    );
  }
}
