// @generated by protobuf-ts 2.9.0
// @generated from protobuf file "race/message.proto" (package "race", syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message race.Race
 */
export interface Race {
    /**
     * @generated from protobuf field: string race_id = 1;
     */
    raceId: string;
    /**
     * @generated from protobuf field: string name = 2;
     */
    name: string;
    /**
     * @generated from protobuf field: string date = 3;
     */
    date: string;
    /**
     * @generated from protobuf field: repeated race.Participant participants = 4;
     */
    participants: Participant[];
}
/**
 * @generated from protobuf message race.Participant
 */
export interface Participant {
    /**
     * @generated from protobuf field: string driver_id = 1;
     */
    driverId: string;
    /**
     * @generated from protobuf field: string car_id = 2;
     */
    carId: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class Race$Type extends MessageType<Race> {
    constructor() {
        super("race.Race", [
            { no: 1, name: "race_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "date", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "participants", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Participant }
        ]);
    }
    create(value?: PartialMessage<Race>): Race {
        const message = { raceId: "", name: "", date: "", participants: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Race>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Race): Race {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string race_id */ 1:
                    message.raceId = reader.string();
                    break;
                case /* string name */ 2:
                    message.name = reader.string();
                    break;
                case /* string date */ 3:
                    message.date = reader.string();
                    break;
                case /* repeated race.Participant participants */ 4:
                    message.participants.push(Participant.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Race, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string race_id = 1; */
        if (message.raceId !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.raceId);
        /* string name = 2; */
        if (message.name !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.name);
        /* string date = 3; */
        if (message.date !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.date);
        /* repeated race.Participant participants = 4; */
        for (let i = 0; i < message.participants.length; i++)
            Participant.internalBinaryWrite(message.participants[i], writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message race.Race
 */
export const Race = new Race$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Participant$Type extends MessageType<Participant> {
    constructor() {
        super("race.Participant", [
            { no: 1, name: "driver_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "car_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<Participant>): Participant {
        const message = { driverId: "", carId: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Participant>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Participant): Participant {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string driver_id */ 1:
                    message.driverId = reader.string();
                    break;
                case /* string car_id */ 2:
                    message.carId = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Participant, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string driver_id = 1; */
        if (message.driverId !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.driverId);
        /* string car_id = 2; */
        if (message.carId !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.carId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message race.Participant
 */
export const Participant = new Participant$Type();
