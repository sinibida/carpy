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
    let cachedUserInfo: {
      [key in string]: User
    } = {

    }
    for (const message of messages) {
      let userInfo: User | null = null;

      if (lastCreatorId !== message.creator) {
        if (Object.hasOwn(cachedUserInfo, message.creator))
          userInfo = cachedUserInfo[message.creator]
        else {
          userInfo = await getUser(message.creator)
          cachedUserInfo[message.creator] = Object(userInfo)
        }
      }

      let procMessage: ProcessedMessage = {
        message: message,
        userInfo
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
      {:else}
        <div class="g-ui-ghost so-quiet">
          <span style="font-size: 104px">😴</span><br/>
          So quiet here...
        </div>
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
  .so-quiet {
    text-align: center;
  }
</style>