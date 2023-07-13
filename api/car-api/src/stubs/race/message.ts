/* eslint-disable */

export const protobufPackage = "race";

export interface Race {
  raceId?: string | undefined;
  name?: string | undefined;
  date?: string | undefined;
  participants?: Participant[] | undefined;
}

export interface Participant {
  driverId?: string | undefined;
  carId?: string | undefined;
}

export const RACE_PACKAGE_NAME = "race";
