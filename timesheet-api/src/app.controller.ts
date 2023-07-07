// Nom de fichier : app.controller.ts
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AddRequest,
  AddResponse,
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  Timesheet,
  TimesheetCRUDServiceController,
  UpdateRequest,
  UpdateResponse,
  TimesheetCRUDServiceControllerMethods,
} from './stubs/timesheet/v1_alpha/timesheet';
import { Metadata } from '@grpc/grpc-js';

@Controller()
@TimesheetCRUDServiceControllerMethods()
export class AppController implements TimesheetCRUDServiceController {
  constructor(private readonly appService: AppService) {}

  async get(request: GetRequest, metadata?: Metadata): Promise<GetResponse> {
    let timesheet: Timesheet;
    let timesheets: Timesheet[] = [];
    if (request.id) {
      timesheet = (await this.appService.findById(
        request.id as unknown as number,
      )) as unknown as Timesheet;
      return { times: [timesheet] };
    } else {
      timesheets = (await this.appService.findAll()) as unknown as Timesheet[];
      return { times: timesheets };
    }
  }

  async update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): Promise<UpdateResponse> {
    let timesheet: Timesheet;
    // eslint-disable-next-line prefer-const
    timesheet = (await this.appService.update(
      request.id as unknown as number,
      request.time,
    )) as unknown as Timesheet;

    return { time: timesheet };
  }

  async delete(
    request: DeleteRequest,
    metadata?: Metadata,
  ): Promise<DeleteResponse> {
    let timesheet: Timesheet;
    // eslint-disable-next-line prefer-const
    timesheet = (await this.appService.delete(
      request.id as unknown as number,
    )) as unknown as Timesheet;

    return { time: timesheet };
  }

  async add(request: AddRequest): Promise<AddResponse> {
    let timesheet: Timesheet;
    // eslint-disable-next-line prefer-const
    timesheet = this.appService.create({
      title: request.title,
      description: request.description,
      start_date: request.startDate,
      end_date: request.endDate,
      locatioon: request.location,
    }) as unknown as Timesheet;

    return { time: timesheet };
  }
}
