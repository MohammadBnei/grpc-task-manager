import { Timestamp } from '../stubs/google/protobuf/timestamp';
import { User } from '../stubs/user/v1alpha/message';

export interface IUser {
	id: string;
	email: string;
	lastName: string;
	firstName: string;
	createdAt: Date;
	updatedAt: Date;
}

export const toJson = (user: User): IUser => ({
	id: user.id,
	email: user.email,
	firstName: user.firstName,
	lastName: user.lastName,
	createdAt: Timestamp.toDate(user.createdAt as Timestamp),
	updatedAt: Timestamp.toDate(user.updatedAt as Timestamp)
});

export const toPb = (user: Partial<IUser>) =>
	User.create({
		...user,
		createdAt: user.createdAt && Timestamp.fromDate(user.createdAt),
		updatedAt: user.updatedAt && Timestamp.fromDate(user.updatedAt)
	});
