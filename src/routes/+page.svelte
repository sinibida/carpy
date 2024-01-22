<script lang="ts">
  import ChannelView from "$lib/ChannelView.svelte";
  import IndexView from "$lib/IndexView.svelte";
  import './styles.css'
  import {title}  from '../stores/mainStores'

  let channels: Channel[] = [
    {
    title: "Channel 1",
    messages: [],
    },
    {
    title: "Channel 2",
    messages: [],
    },
  ]
  let currentChannel: Channel | null = null;

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
  {#each channels as channel}
    <button on:click={() => onChangeChannelClicked(channel)}>
      {channel.title[0] + channel.title[channel.title.length - 1]}
    </button>
  {/each}
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
