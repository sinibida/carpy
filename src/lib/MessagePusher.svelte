<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{
    push: MessageContent
  }>();

  let value: string;

  function onPush() {
    dispatch('push', value);
    value = ""
  }
</script>

<div class="root">
  <div class="content">
    <input 
    type="text" 
    class="g-elevated"
    bind:value={value}
    on:keydown={event => {if (event.key === "Enter") onPush()}}
    />
    <button 
    class="g-elevated"
    on:click={onPush}
    >
      Send
    </button>
  </div>
</div>

<style>
  .root {
    position: relative;
    height: 48px;
    z-index: 100;

    & .content {
      position: absolute;
      left: 8px;
      right: 8px;
      top: 8px;
      bottom: 8px;
      display: flex;
      gap: 8px;

      & input {
        flex: 1;
        border: none;
        border-radius: 1000px;
        outline: none;
        padding: 0px 16px;
        color: black;
      }

      & button {
        border: none;
        border-radius: 1000px;
        outline: none;
        padding: 0px 16px;
        background-color: var(--ui-accent);
        color: black;
      }
    }
  }
</style>
