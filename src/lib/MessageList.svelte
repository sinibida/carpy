<script lang="ts">
  import MessageBox from "./MessageBox.svelte";

  export let messages: LocalMessage[] = []
</script>

<div class="root">
  <div class="message-list">
    {#each messages as {
      id,
      fromSelf,
      content,
    }}
      <MessageBox {fromSelf}>
        {content}
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
	}
</style>