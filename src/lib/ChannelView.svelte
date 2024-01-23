<script lang="ts">
  import MessageList from "./MessageList.svelte";
  import MessagePusher from "./MessagePusher.svelte";
  import { createMessageToChannel, getMessagesFromChannel } from "../api/pocketBasePresenter";
  import { onMount } from "svelte";

  export let channel: Channel;

  let loadedMessages: Message[] | null = null;
  
  onMount(async () => {
    await reloadMessages();
  })

  async function reloadMessages() {
    loadedMessages = null
    loadedMessages = await getMessagesFromChannel(
      channel.id
    )
  }

  async function push(message: Local<Message>) {
    await createMessageToChannel(message)
  }

  async function onPushListen(event: CustomEvent<MessageContent>) {
    const content = event.detail;
    await push({
      channel: channel.id,
      creator: 'vka9xdjd3sib7v0',
      content
    })
    await reloadMessages();
  }
</script>

<div class="content">
  {#key loadedMessages}
    {#if loadedMessages}
      <MessageList
      messages={loadedMessages}
      fromSelfPredicate={(x) => x.creator === 'vka9xdjd3sib7v0'}
      />
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