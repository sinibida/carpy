<script lang="ts">
  import MessageList from "./MessageList.svelte";
  import MessagePusher from "./MessagePusher.svelte";
  import { createMessageToChannel, getMessagesFromChannel, subscribeToChannel } from "../utils/pocketBasePresenter";
  import { onDestroy, onMount } from "svelte";
  import { loggedUser } from "../../stores/mainStores";
  import { get } from "svelte/store";

  export let channel: Channel;

  let loadedMessages: Message[] | null = null;

  let unsubscribe: () => Promise<void>
  
  onMount(async () => {
    await reloadMessages();

    unsubscribe = await subscribeToChannel(channel.id, (e) => {
      // TODO: Naive Reaction
      reloadMessages();
    });
    console.log("subed!", channel.title)
  })

  onDestroy(async () => {
    await unsubscribe();
    console.log("unsubed!", channel.title)
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
      fromSelfPredicate={(x) => get(loggedUser)?.id === x.creator}
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