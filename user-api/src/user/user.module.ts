import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/primsa.service';
import { AuthModule } from 'src/auth/auth.module';
import { ClientProxyFactory, ClientsModule } from '@nestjs/microservices';
import { rabbitOption } from 'src/rabbitOption';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    {
      provide: 'USER_QUEUE_SERVICE',
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => {
        return ClientProxyFactory.create(rabbitOption(cs));
      },
    },
  ],
  exports: [UserService],
})
export class UserModule {}
