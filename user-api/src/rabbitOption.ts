import { ConfigService } from '@nestjs/config';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const rabbitOption = (cs: ConfigService): ClientProviderOptions => ({
  name: 'user-module',
  transport: Transport.RMQ,
  options: {
    urls: [cs.get<string>('RMQ_URL')],
    queue: cs.get('RMQ_QUEUE'),
    queueOptions: {
      durable: false,
    },
  },
});
