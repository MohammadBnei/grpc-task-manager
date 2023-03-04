import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/primsa.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    AuthService,
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
