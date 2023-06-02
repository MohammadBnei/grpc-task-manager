<script lang="ts">
    import type { PageData } from './$types';
    import {onMount} from "svelte";
    import {browser} from "$app/environment";
    import {mediaStore} from "$stores/media";
    import {connectToMediaStream} from "$lib/service/media";
    import type {IMedia} from "../../lib/helper/mediaDto";
    export let data: PageData;

    onMount(() => {
        if (browser) {
            mediaStore.set(data.medias)
            connectToMediaStream();
        }
    })

    let medias: IMedia[];
</script>

<svelte:head>
    <title>Medias list</title>
</svelte:head>

<div class="flex w-full flex-wrap items-center justify-center p-4 overflow-x-auto">
    {#each medias as media (media.name)}
        <h3>{media.name}</h3>
    {/each}
</div>