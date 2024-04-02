<script lang="ts">
  import { channelContextProviderObj } from "$lib/utils/contextKeys";
  import { getContext } from "svelte";
  import MessageList from "./MessageList.svelte";
  import MessagePusher from "./MessagePusher.svelte";

  let context = getContext<ChannelContext>(channelContextProviderObj);
  let { push, loadMoreMessages } = context;

  let loadedMessages: Message[];
  let noMoreMessage: boolean;
  $: ({ loadedMessages, noMoreMessage } = $context || {
    loadedMessages: [],
    noMoreMessage: false,
  });

  async function onPushListen(event: CustomEvent<MessageContent>) {
    const content = event.detail;
    await push({
      content,
    });
    //await reloadMessages();
  }

  function onTop() {
    loadMoreMessages();
  }
</script>

<div class="content">
  <MessageList messages={loadedMessages} on:top={onTop} {noMoreMessage} />
</div>
<MessagePusher on:push={onPushListen} />

<style>
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
</style>

