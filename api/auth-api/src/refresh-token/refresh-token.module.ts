import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  providers: [RefreshTokenService, PrismaService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
