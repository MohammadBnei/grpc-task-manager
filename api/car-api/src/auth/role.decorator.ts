import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/stubs/user/v1alpha/message';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
