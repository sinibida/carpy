<script lang="ts">
  import MessageBox from "./MessageBox.svelte";
  import { getUser } from "$lib/utils/pocketBasePresenter";

  export let fromSelfPredicate: 
    (msg: Message) => boolean = 
    () => false
  export let messages: Message[] = []

  type ProcessedMessage = {
    userInfo: User | null,
    message: Message,
  }

  async function processMessages(messages: Message[]) {
    let lastCreatorId: string | undefined = undefined
    let ret: ProcessedMessage[] = []
    for (const message of messages) {
      let procMessage: ProcessedMessage = {
        message: message,
        userInfo: lastCreatorId !== message.creator ? 
          await getUser(message.creator) : 
          null,
      }

      ret.push(procMessage)

      lastCreatorId = message.creator;
    }
    return ret;
  }
</script>

<div class="root">
  <div class="message-list">
    {#await processMessages(messages)}
      Loading...
    {:then procMessages} 
      {#each procMessages as message}
        <MessageBox 
        fromSelf={fromSelfPredicate(message.message)} 
        userInfo={message.userInfo}
        >
          {message.message.content}
        </MessageBox>
      {/each}
    {/await}
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