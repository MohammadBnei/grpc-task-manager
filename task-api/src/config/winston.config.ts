import { ConfigService } from '@nestjs/config';
import winston from 'winston';
import ecsFormat from '@elastic/ecs-winston-format';
import { utilities } from 'nest-winston';

export default (cs: ConfigService) => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike(process.env.npm_package_name, {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
  ];

  if (cs.get('NODE_ENV') === 'production') {
    transports.push(
      new winston.transports.File({
        format: ecsFormat(),
        filename:
          process.env.NODE_ENV === 'production'
            ? '/api/log/word-api.log'
            : './api/log',
      }),
    );
  }

  return {
    defaultMeta: {
      'label.api-name': process.env.npm_package_name,
      'label.api-version': process.env.npm_package_version,
    },
    transports,
  };
};
