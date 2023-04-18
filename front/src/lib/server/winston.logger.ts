import winston from 'winston';
import ecsFormat from '@elastic/ecs-winston-format';
import { env } from '$env/dynamic/private';

const transports: winston.transport[] = [
	new winston.transports.Console({
		format: winston.format.combine(
			winston.format.timestamp(),
			winston.format.ms(),
			winston.format.prettyPrint()
		)
	})
];

if (env.NODE_ENV === 'production') {
	transports.push(
		new winston.transports.File({
			format: ecsFormat(),
			filename: '/api/log/front.log'
		})
	);
}

export default winston.createLogger({
	transports
});
