<script lang="ts">
  import MessageBox from "./MessageBox.svelte";

  export let messages: LocalMessage[] = []
</script>

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

<style>
	.message-list {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 8px;
	}
</style>