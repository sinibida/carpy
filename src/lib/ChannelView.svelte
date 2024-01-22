<script lang="ts">
  import MessageList from "./MessageList.svelte";
  import MessagePusher from "./MessagePusher.svelte";

  export let channel: Channel;
  
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
</script>

<div class="content">
  {#key channel.messages}
    <MessageList messages={channel.messages}/>
  {/key}
</div>
<MessagePusher on:push={onPushListen}/>

<style>
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 8px;
  }
</style>