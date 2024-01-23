<script lang="ts">
  import MessageBox from "./MessageBox.svelte";

  export let fromSelfPredicate: 
    (msg: Message) => boolean = 
    () => false
  export let messages: Message[] = []
</script>

<div class="root">
  <div class="message-list">
    {#each messages as message}
      <MessageBox fromSelf={fromSelfPredicate(message)}>
        {message.content}
      </MessageBox>
    {/each}
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
		flex-direction: column;
		align-items: stretch;
    padding: 8px;
		gap: 8px;
    right: 0px;
    left: 0px;
	}
</style>