// @generated by protobuf-ts 2.9.0
// @generated from protobuf file "media/v1alpha/message.proto" (package "media.v1alpha", syntax proto3)
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
 * @generated from protobuf message media.v1alpha.Media
 */
export interface Media {
    /**
     * @generated from protobuf field: int32 id = 1;
     */
    id: number;
    /**
     * @generated from protobuf field: string name = 2;
     */
    name: string;
    /**
     * @generated from protobuf field: string url = 3;
     */
    url: string;
    /**
     * @generated from protobuf field: int32 user_id = 4;
     */
    userId: number;
}
/**
 * @generated from protobuf message media.v1alpha.CreateMediaRequest
 */
export interface CreateMediaRequest {
    /**
     * @generated from protobuf field: string name = 2;
     */
    name: string;
    /**
     * @generated from protobuf field: string url = 3;
     */
    url: string;
    /**
     * @generated from protobuf field: int32 userId = 4;
     */
    userId: number;
}
/**
 * @generated from protobuf message media.v1alpha.CreateMediaResponse
 */
export interface CreateMediaResponse {
    /**
     * @generated from protobuf field: media.v1alpha.Media media = 1;
     */
    media?: Media;
}
/**
 * @generated from protobuf message media.v1alpha.UpdateMediaRequest
 */
export interface UpdateMediaRequest {
    /**
     * @generated from protobuf field: string name = 1;
     */
    name: string;
    /**
     * @generated from protobuf field: string url = 2;
     */
    url: string;
}
/**
 * @generated from protobuf message media.v1alpha.UpdateMediaResponse
 */
export interface UpdateMediaResponse {
    /**
     * @generated from protobuf field: media.v1alpha.Media media = 1;
     */
    media?: Media;
}
/**
 * @generated from protobuf message media.v1alpha.DeleteMediaRequest
 */
export interface DeleteMediaRequest {
    /**
     * @generated from protobuf field: int32 id = 1;
     */
    id: number;
}
/**
 * @generated from protobuf message media.v1alpha.DeleteMediaResponse
 */
export interface DeleteMediaResponse {
    /**
     * @generated from protobuf field: media.v1alpha.Media media = 1;
     */
    media?: Media;
}
/**
 * @generated from protobuf message media.v1alpha.ListMediasRequest
 */
export interface ListMediasRequest {
    /**
     * The parent resource name, for example, "shelves/shelf1"
     *
     * @generated from protobuf field: string parent = 1;
     */
    parent: string;
    /**
     * The maximum number of items to return.
     *
     * @generated from protobuf field: int32 page_size = 2;
     */
    pageSize: number;
    /**
     * The next_page_token value returned from a previous List request, if any.
     *
     * @generated from protobuf field: string page_token = 3;
     */
    pageToken: string;
}
/**
 * @generated from protobuf message media.v1alpha.ListMediasResponse
 */
export interface ListMediasResponse {
    /**
     * The field name should match the noun "Task" in the method name.
     * There will be a maximum number of items returned based on the page_size field in the request.
     *
     * @generated from protobuf field: repeated media.v1alpha.Media medias = 1;
     */
    medias: Media[];
    /**
     * Token to retrieve the next page of results, or empty if there are no more results in the list.
     *
     * @generated from protobuf field: string next_page_token = 2;
     */
    nextPageToken: string;
}
/**
 * @generated from protobuf message media.v1alpha.GetMediaRequest
 */
export interface GetMediaRequest {
    /**
     * @generated from protobuf field: string name = 1;
     */
    name: string;
}
/**
 * @generated from protobuf message media.v1alpha.GetMediaResponse
 */
export interface GetMediaResponse {
    /**
     * @generated from protobuf field: media.v1alpha.Media media = 1;
     */
    media?: Media;
}
// @generated message type with reflection information, may provide speed optimized methods
class Media$Type extends MessageType<Media> {
    constructor() {
        super("media.v1alpha.Media", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "user_id", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<Media>): Media {
        const message = { id: 0, name: "", url: "", userId: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Media>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Media): Media {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 id */ 1:
                    message.id = reader.int32();
                    break;
                case /* string name */ 2:
                    message.name = reader.string();
                    break;
                case /* string url */ 3:
                    message.url = reader.string();
                    break;
                case /* int32 user_id */ 4:
                    message.userId = reader.int32();
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
    internalBinaryWrite(message: Media, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int32(message.id);
        /* string name = 2; */
        if (message.name !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.name);
        /* string url = 3; */
        if (message.url !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.url);
        /* int32 user_id = 4; */
        if (message.userId !== 0)
            writer.tag(4, WireType.Varint).int32(message.userId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message media.v1alpha.Media
 */
export const Media = new Media$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CreateMediaRequest$Type extends MessageType<CreateMediaRequest> {
    constructor() {
        super("media.v1alpha.CreateMediaRequest", [
            { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "userId", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<CreateMediaRequest>): CreateMediaRequest {
        const message = { name: "", url: "", userId: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<CreateMediaRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CreateMediaRequest): CreateMediaRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string name */ 2:
                    message.name = reader.string();
                    break;
                case /* string url */ 3:
                    message.url = reader.string();
                    break;
                case /* int32 userId */ 4:
                    message.userId = reader.int32();
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
    internalBinaryWrite(message: CreateMediaRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string name = 2; */
        if (message.name !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.name);
        /* string url = 3; */
        if (message.url !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.url);
        /* int32 userId = 4; */
        if (message.userId !== 0)
            writer.tag(4, WireType.Varint).int32(message.userId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message media.v1alpha.CreateMediaRequest
 */
export const CreateMediaRequest = new CreateMediaRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CreateMediaResponse$Type extends MessageType<CreateMediaResponse> {
    constructor() {
        super("media.v1alpha.CreateMediaResponse", [
            { no: 1, name: "media", kind: "message", T: () => Media }
        ]);
    }
    create(value?: PartialMessage<CreateMediaResponse>): CreateMediaResponse {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<CreateMediaResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CreateMediaResponse): CreateMediaResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* media.v1alpha.Media media */ 1:
                    message.media = Media.internalBinaryRead(reader, reader.uint32(), options, message.media);
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
    internalBinaryWrite(message: CreateMediaResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* media.v1alpha.Media media = 1; */
        if (message.media)
            Media.internalBinaryWrite(message.media, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message media.v1alpha.CreateMediaResponse
 */
export const CreateMediaResponse = new CreateMediaResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UpdateMediaRequest$Type extends MessageType<UpdateMediaRequest> {
    constructor() {
        super("media.v1alpha.UpdateMediaRequest", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "url", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<UpdateMediaRequest>): UpdateMediaRequest {
        const message = { name: "", url: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<UpdateMediaRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UpdateMediaRequest): UpdateMediaRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string name */ 1:
                    message.name = reader.string();
                    break;
                case /* string url */ 2:
                    message.url = reader.string();
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
    internalBinaryWrite(message: UpdateMediaRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string name = 1; */
        if (message.name !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.name);
        /* string url = 2; */
        if (message.url !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.url);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message media.v1alpha.UpdateMediaRequest
 */
export const UpdateMediaRequest = new UpdateMediaRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UpdateMediaResponse$Type extends MessageType<UpdateMediaResponse> {
    constructor() {
        super("media.v1alpha.UpdateMediaResponse", [
            { no: 1, name: "media", kind: "message", T: () => Media }
        ]);
    }
    create(value?: PartialMessage<UpdateMediaResponse>): UpdateMediaResponse {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<UpdateMediaResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UpdateMediaResponse): UpdateMediaResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* media.v1alpha.Media media */ 1:
                    message.media = Media.internalBinaryRead(reader, reader.uint32(), options, message.media);
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
    internalBinaryWrite(message: UpdateMediaResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* media.v1alpha.Media media = 1; */
        if (message.media)
            Media.internalBinaryWrite(message.media, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message media.v1alpha.UpdateMediaResponse
 */
export const UpdateMediaResponse = new UpdateMediaResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DeleteMediaRequest$Type extends MessageType<DeleteMediaRequest> {
    constructor() {
        super("media.v1alpha.DeleteMediaRequest", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<DeleteMediaRequest>): DeleteMediaRequest {
        const message = { id: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<DeleteMediaRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DeleteMediaRequest): DeleteMediaRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 id */ 1:
                    message.id = reader.int32();
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
    internalBinaryWrite(message: DeleteMediaRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int32(message.id);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message media.v1alpha.DeleteMediaRequest
 */
export const DeleteMediaRequest = new DeleteMediaRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DeleteMediaResponse$Type extends MessageType<DeleteMediaResponse> {
    constructor() {
        super("media.v1alpha.DeleteMediaResponse", [
            { no: 1, name: "media", kind: "message", T: () => Media }
        ]);
    }
    create(value?: PartialMessage<DeleteMediaResponse>): DeleteMediaResponse {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<DeleteMediaResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DeleteMediaResponse): DeleteMediaResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* media.v1alpha.Media media */ 1:
                    message.media = Media.internalBinaryRead(reader, reader.uint32(), options, message.media);
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
    internalBinaryWrite(message: DeleteMediaResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* media.v1alpha.Media media = 1; */
        if (message.media)
            Media.internalBinaryWrite(message.media, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message media.v1alpha.DeleteMediaResponse
 */
export const DeleteMediaResponse = new DeleteMediaResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ListMediasRequest$Type extends MessageType<ListMediasRequest> {
    constructor() {
        super("media.v1alpha.ListMediasRequest", [
            { no: 1, name: "parent", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "page_size", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "page_token", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<ListMediasRequest>): ListMediasRequest {
        const message = { parent: "", pageSize: 0, pageToken: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<ListMediasRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ListMediasRequest): ListMediasRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string parent */ 1:
                    message.parent = reader.string();
                    break;
                case /* int32 page_size */ 2:
                    message.pageSize = reader.int32();
                    break;
                case /* string page_token */ 3:
                    message.pageToken = reader.string();
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
    internalBinaryWrite(message: ListMediasRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string parent = 1; */
        if (message.parent !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.parent);
        /* int32 page_size = 2; */
        if (message.pageSize !== 0)
            writer.tag(2, WireType.Varint).int32(message.pageSize);
        /* string page_token = 3; */
        if (message.pageToken !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.pageToken);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message media.v1alpha.ListMediasRequest
 */
export const ListMediasRequest = new ListMediasRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ListMediasResponse$Type extends MessageType<ListMediasResponse> {
    constructor() {
        super("media.v1alpha.ListMediasResponse", [
            { no: 1, name: "medias", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Media },
            { no: 2, name: "next_page_token", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<ListMediasResponse>): ListMediasResponse {
        const message = { medias: [], nextPageToken: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<ListMediasResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ListMediasResponse): ListMediasResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated media.v1alpha.Media medias */ 1:
                    message.medias.push(Media.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* string next_page_token */ 2:
                    message.nextPageToken = reader.string();
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
    internalBinaryWrite(message: ListMediasResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated media.v1alpha.Media medias = 1; */
        for (let i = 0; i < message.medias.length; i++)
            Media.internalBinaryWrite(message.medias[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* string next_page_token = 2; */
        if (message.nextPageToken !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.nextPageToken);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message media.v1alpha.ListMediasResponse
 */
export const ListMediasResponse = new ListMediasResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetMediaRequest$Type extends MessageType<GetMediaRequest> {
    constructor() {
        super("media.v1alpha.GetMediaRequest", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<GetMediaRequest>): GetMediaRequest {
        const message = { name: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<GetMediaRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetMediaRequest): GetMediaRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string name */ 1:
                    message.name = reader.string();
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
    internalBinaryWrite(message: GetMediaRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string name = 1; */
        if (message.name !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.name);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message media.v1alpha.GetMediaRequest
 */
export const GetMediaRequest = new GetMediaRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetMediaResponse$Type extends MessageType<GetMediaResponse> {
    constructor() {
        super("media.v1alpha.GetMediaResponse", [
            { no: 1, name: "media", kind: "message", T: () => Media }
        ]);
    }
    create(value?: PartialMessage<GetMediaResponse>): GetMediaResponse {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<GetMediaResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetMediaResponse): GetMediaResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* media.v1alpha.Media media */ 1:
                    message.media = Media.internalBinaryRead(reader, reader.uint32(), options, message.media);
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
    internalBinaryWrite(message: GetMediaResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* media.v1alpha.Media media = 1; */
        if (message.media)
            Media.internalBinaryWrite(message.media, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message media.v1alpha.GetMediaResponse
 */
export const GetMediaResponse = new GetMediaResponse$Type();
