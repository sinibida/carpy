<script lang="ts">
  import ChannelView from "$lib/components/ChannelView.svelte";
  import IndexView from "$lib/components/IndexView.svelte";
  import {title, loggedUser}  from '../stores/mainStores'
  import { onMount } from "svelte";
  import { getAllChannels, logout, updateLoggedUser } from "../lib/utils/pocketBasePresenter";
  import { goto } from '$app/navigation';

  let channels: Channel[] | null = null
  let currentChannel: Channel | null = null;

  onMount(async () => {
    const user = updateLoggedUser();
    if (user === null) {
      goto("/login");
      return;
    }
    channels = await getAllChannels();
  })

  function onChangeChannelClicked(channel: Channel | null) {
    currentChannel = channel
    $title = channel?.title || null;
  }
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="sidebar g-elevation">
  <button on:click={() => onChangeChannelClicked(null)}>
    <i class="mi">home</i>
  </button>
  {#key channels}
    {#if channels}
      {#each channels as channel}
        <button on:click={() => onChangeChannelClicked(channel)}>
          {channel.title[0] + channel.title[channel.title.length - 1]}
        </button>
      {/each}
    {:else}
      loading...
    {/if}
  {/key}
</section>
<section class="content">
  {#key currentChannel}
  {#if currentChannel}
  <ChannelView channel={currentChannel}/>
  {:else}
  <IndexView/>
  {/if}
  {/key}
</section>

<style>
  .sidebar {
    width: 64px;
    background-color: var(--ui-2);
    z-index: 500;
    display: flex;
    flex-direction: column;

    & button {
      user-select: none;
      width: 64px;
      height: 64px;
      color: black;
      font-weight: bold;
      font-size: x-large;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
  }
</style>
