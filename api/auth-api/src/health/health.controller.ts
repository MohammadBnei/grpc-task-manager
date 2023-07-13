import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './health.prisma';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private pHI: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.pHI.isHealthy('auth-api')]);
  }
}
