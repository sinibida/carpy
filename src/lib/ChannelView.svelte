<script lang="ts">
  import MessageList from "./MessageList.svelte";
  import MessagePusher from "./MessagePusher.svelte";
  import { getMessagesFromChannel } from "../api/pocketBasePresenter";
  import { onMount } from "svelte";

  export let channel: Channel;

  let loadedMessages: LocalMessage[] | null = null;
  
  onMount(async () => {
    loadedMessages = await getMessagesFromChannel(
      channel.id
    )
  })

  function push(message: LocalMessage) {
    channel.messages.push(message)
    channel.messages = channel.messages
  }

  function onPushListen(event: CustomEvent<MessageContent>) {
    const content = event.detail;
    push({
      id: crypto.randomUUID(),
      channelId: channel.id,
      fromSelf: true,
      content
    })
  }
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