import type {Media} from "../stubs/media/v1alpha/media";

export interface IMedia {
    name: string,
    type: string,
    link: string,
    taskId: string
}

export const toJson = (media: Media) => ({
    name: media.name,
    type: media.type,
    link: media.link,
    taskId: media.taskId
})