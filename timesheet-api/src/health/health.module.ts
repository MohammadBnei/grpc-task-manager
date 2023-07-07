import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaService } from '../prisma.service';
import { PrismaHealthIndicator } from './health.prisma';

@Module({
  controllers: [HealthController],
  imports: [TerminusModule],
  providers: [PrismaService, PrismaHealthIndicator],
})
export class HealthModule {}
