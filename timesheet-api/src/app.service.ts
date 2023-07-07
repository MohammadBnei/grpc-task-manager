import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Timesheet } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.TimesheetCreateInput): Promise<Timesheet> {
    return this.prisma.timesheet.create({ data });
  }

  findById(id: number): Promise<Timesheet> {
    return this.prisma.timesheet.findFirst({
      where: { id },
    });
  }

  findByName(title: string): Promise<Timesheet[]> {
    return this.prisma.timesheet.findMany({
      where: { title },
    });
  }

  findAll(): Promise<Timesheet[]> {
    return this.prisma.timesheet.findMany();
  }

  async update(
    id: number,
    data: Prisma.TimesheetUpdateInput,
  ): Promise<Timesheet> {
    return this.prisma.timesheet.update({
      where: { id },
      data: data,
    });
  }

  delete(id: number): Promise<Timesheet> {
    return this.prisma.timesheet.delete({
      where: { id },
    });
  }
}
