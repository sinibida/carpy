<script lang="ts">
  import { loadSvelteConfig } from "@sveltejs/vite-plugin-svelte";
  import MessageList from "./MessageList.svelte";
  import MessagePusher from "./MessagePusher.svelte";
  // import { pb } from "../api/pocketBasePresenter";

  export let channel: Channel;

  let loadedMessages: LocalMessage[] | null = null;
  
  function push(message: LocalMessage) {
    channel.messages.push(message)
    channel.messages = channel.messages
  }

  function onPushListen(event: CustomEvent<MessageContent>) {
    const content = event.detail;
    push({
      id: crypto.randomUUID(),
      fromSelf: true,
      content
    })
  }

  // async function getMessages() {
  //   pb.collection('messages').getList(1, 20, {
  //     filter: ''
  //   })
  // }
</script>

<div class="content">
  {#key loadedMessages}
    {#if loadedMessages}
      <MessageList messages={loadedMessages}/>
    {:else}
      Loading...
    {/if}
  {/key}
</div>
<MessagePusher on:push={onPushListen}/>

<style>
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
</style>