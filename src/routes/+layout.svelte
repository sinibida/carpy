<script lang="ts">
  import { appWindow } from '@tauri-apps/api/window';
  import { onMount } from 'svelte';
  import * as ms from '../lib/stores/mainStores';
  import './styles.css'
  import UserModal from '$lib/components/UserModal.svelte';
  import { isWindowed } from '$lib/utils';

  let maximized = false;
  let title: string | null = null;
  $: onMaximizedChange(maximized)

  onMount(async () => {
    await appWindow.listen('tauri://resize', async () => {
      maximized = await appWindow.isMaximized()
    })

    ms.title.subscribe((x) => {
      title = x;
    })
  })

  async function onCloseClick() {
    await appWindow.close()
  } 

  async function onMaximizeClick() {
    await appWindow.toggleMaximize()
  } 

  async function onMinimizeClick() {
    await appWindow.minimize()
  } 

  function onMaximizedChange(maximized: boolean) {
    if (maximized) {
      document.querySelector('html')?.classList.remove('rounded')
    } else {
      document.querySelector('html')?.classList.add('rounded')
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
class="g-elevated header"
>
  <div class="title">
    🍠
    Carpy
    {#if title}
      ({title})
    {/if}
    <div data-tauri-drag-region class="dragging-area">

    </div>
  </div>
  <div class="left">
    <UserModal/>
  </div>
  <div class="right">
    {#if isWindowed()}
      <button class="g-icon-button" on:click={onMinimizeClick}>
        <i class="mi">minimize</i>
      </button>
      <button class="g-icon-button" on:click={onMaximizeClick}>
        {#if maximized}
          <i class="mi">close_fullscreen</i>
        {:else}
          <i class="mi">open_in_full</i>
        {/if}
      </button>
      <button class="g-icon-button close-button" on:click={onCloseClick}>
        <i class="mi">close</i>
      </button>
    {/if}
  </div>
</div>

<main>
  <slot/>
</main>

<style>
  main {
    flex: 1;
    background-color: var(--ui-1);
    display: flex;
    position: relative;
  }

  .close-button:hover {
    color: var(--ui-error)
  }

  .header {
		z-index: 1000;
    position: relative;
    background-color: var(--ui-2);
    height: 32px;
    min-height: 32px;

    & .left {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
    }

    & .right {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
    }

    & .left,
    & .right {
      font-size: 20px;
      padding: 0px 16px;
      display: flex;
      align-items: center;
    }

    & .title {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      user-select: none;

      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;

      font-weight: bold;

      & .dragging-area {
        position: absolute;
        left: 4px;
        right: 4px;
        top: 4px;
        bottom: 0;
      }
    }
  }
</style>