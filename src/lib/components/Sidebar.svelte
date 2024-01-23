<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let channels: Channel[] | null;

  const dispatch = createEventDispatcher<{
    changeChannel: Channel | null
    addChannel: undefined
  }>()
</script>

<div class="sidebar">
  <button class="g-bubble" on:click={() => dispatch('changeChannel', null)}>
    <i class="mi">home</i>
  </button>
  {#key channels}
    {#if channels}
      {#each channels as channel}
        <button class="g-bubble" on:click={() => dispatch('changeChannel', channel)}>
          {channel.title[0] + channel.title[channel.title.length - 1]}
        </button>
      {/each}
    {:else}
      loading...
    {/if}
  {/key}
  <button class="g-bubble gb-plain" on:click={() => dispatch('addChannel')}>
    <i class="mi">add</i>
  </button>
</div>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 8px;
    padding-top: 16px;
    gap: 8px;

    & button {
      user-select: none;
      aspect-ratio: 1 / 1;
      color: var(--on-accent);
      font-weight: bold;
      font-size: x-large;
      border-radius: 16px;
      padding: 0;
    }
  }
</style>
