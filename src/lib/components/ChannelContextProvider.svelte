<script lang="ts">
  import { page } from "$app/stores";
  import { channelContextProviderObj } from "$lib/utils/contextKeys";
  import { createMessageToChannel, getMessagesFromChannel, subscribeToChannel } from "../utils/pocketBasePresenter";
  import { onDestroy, onMount, setContext, tick } from "svelte";

  export let channel: Channel;

  let loadedMessages: Message[] = [];
  let currentPage = 1;
  let noMoreMessage: boolean = false;
  const perPage = 20; // TODO: For now

  let channelUnsubscribe: () => Promise<void>
  
  onMount(async () => {
    channelUnsubscribe = await subscribeToChannel(channel.id, (e) => {
      // https://pocketbase.io/docs/api-realtime
      switch(e.action) {
        case 'create':
          onServerMessageCreate(e.record);
          break;
        case 'update':
          onServerMessageUpdate(e.record);
          break;
        case 'delete':
          onServerMessageDelete(e.record);
          break;
        default:
          reloadMessages();
          break;
      }
    });
    //console.log("subed!", channel.title)
  })

  onDestroy(async () => {
    await channelUnsubscribe();
    //console.log("unsubed!", channel.title)
  })

  async function onServerMessageCreate(msg: Message) {
    loadedMessages.splice(0,0,msg)
    loadedMessages = loadedMessages
  }

  async function onServerMessageUpdate(msg: Message) {

  }

  async function onServerMessageDelete(msg: Message) {

  }

  async function loadMoreMessages() {
    //await new Promise(res => setTimeout(res, 100));

    const fetched = await getMessagesFromChannel(
      channel.id,
      currentPage,
      perPage,
    )
    currentPage++;
    //console.log("Messages fetched", fetched)
    loadedMessages.push(...fetched)
    loadedMessages = loadedMessages;

    if (fetched.length < perPage) noMoreMessage = true;
  }

  async function reloadMessages() {
    loadedMessages = [] // TODO: For now
    currentPage = 0;
    noMoreMessage = false;
  }

  async function push(message: Omit<Local<Message>, 'channel'>) {
    const pushed = await createMessageToChannel({
      ...message,
      channel: channel.id
    })
    return pushed
  }

  let subscribed = new Set<(value: ChannelContextCarry) => void>();
  function subscribe(fn: (value: ChannelContextCarry) => void) {
    subscribed.add(fn)
    return () => {
      subscribed.delete(fn)
    }
  }
  $: subscribed.forEach(x => x({
    loadedMessages,
    noMoreMessage
  }))

  setContext<ChannelContext>(channelContextProviderObj, {
    loadMoreMessages,
    push,
    subscribe
  })
</script>

<slot/>
