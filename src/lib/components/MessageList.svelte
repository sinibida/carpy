<script lang="ts">
  import MessageBox from "./MessageBox.svelte";
  import { getUser } from "$lib/utils/pocketBasePresenter";
  import { loggedUser } from "$lib/stores/mainStores";
  import { createEventDispatcher, getContext, tick } from "svelte";
  import viewport from "$lib/model/useViewportAction";

  const dispatch = createEventDispatcher<{
    top: null
  }>();

  export let messages: Message[] = []
  export let noMoreMessage: boolean

  let cachedUserInfo: {
    [key in string]: User | null
  } = {
    
  }
  $: {
    for (const message of messages) {
      if (!Object.hasOwn(cachedUserInfo, message.creator)) {
        cachedUserInfo[message.creator] = null
        getUser(message.creator).then(userInfo => {
          cachedUserInfo[message.creator] = Object(userInfo)
        })
      }
    }
  }

  function isDuplicate(msg: Message, i: number) {
    if (i === messages.length - 1) return false;
    
    return messages[i+1].creator === msg.creator
  }

  let root: HTMLElement;
  function onTopViewportEnter() {
    if (root) {
      let src = root.scrollTop;
      dispatch('top')
      tick().then(() => {
        root.scroll({
          top: src,
          behavior: 'smooth',
        });
      })
    } else {
      dispatch('top')
    }
  }
</script>

<div class="root" bind:this={root}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="message-list">
    {#each messages as message, i (message.id)}
      <div class="box">
        <MessageBox 
        fromSelf={$loggedUser?.id === message.creator} 
        userInfo={cachedUserInfo[message.creator] || undefined}
        isDuplicate={isDuplicate(message, i)}
        >
          {message.content}
        </MessageBox>
      </div>
    {:else}
      <div class="g-ui-ghost so-quiet">
        <span style="font-size: 104px">😴</span><br/>
        So quiet here...
      </div>
    {/each}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    {#if !noMoreMessage}
      <div 
      on:click={() => {dispatch('top')}}
      class="top"
      >
        Load More
        {#key messages}
          {#if !noMoreMessage}
            <div
            use:viewport 
            class="top-trigger"
            on:enterViewport={onTopViewportEnter}
            >
            </div>
          {/if}
        {/key}
      </div>
    {/if}
  </div>
</div>

<style>
  .root {
		display: flex;
		flex-direction: column-reverse;
    position: relative;
    overflow-y: auto;
    height: 100%;
  }
	.message-list {
    position: absolute;
		display: flex;
		flex-direction: column-reverse;
		align-items: stretch;
    padding: 8px;
    right: 0px;
    left: 0px;
	}
  .so-quiet {
    text-align: center;
  }
  .top {
    text-align: center;
  }
  .top-trigger {
    position: absolute;
    /* background-color: #ff000044; */
    top: 0px;
    left: 0px;
    right: 0px;
    height: 256px;
  }
  .box {
    padding: 4px 0px;
  }
</style>