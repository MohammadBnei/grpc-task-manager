import type {PageServerLoad} from "./$types";
import {toJson} from "$src/lib/helper/mediaDto";
import {ListMediasRequest} from "$lib/stubs/media/v1alpha/media";

export const load: PageServerLoad = async ({ locals}) => {
    const listMediaRequest = ListMediasRequest.create()
    const request = await locals.mediaClient.listMediaForTask(listMediaRequest)
    const listMediaResponse = request.response;

    const medias = listMediaResponse.medias.map(toJson)

    return {
        medias
    }
}