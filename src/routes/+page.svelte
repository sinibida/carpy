<script lang="ts">
  import MessageListView from "$lib/components/MessageListView.svelte";
  import IndexView from "$lib/components/IndexView.svelte";
  import ModalView from "$lib/components/ModalView.svelte";
  import {title, loggedUser}  from '../lib/stores/mainStores'
  import { onMount } from "svelte";
  import { createChannel, getAllChannels, getChannels, logout, updateLoggedUser, userJoinChannel } from "../lib/utils/pocketBasePresenter";
  import { goto } from '$app/navigation';
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { currentModal, showModal, type ModalContent } from "$lib/stores/modalStores";
  import ChannelContextProvider from "$lib/components/ChannelContextProvider.svelte";

  let channels: Channel[] | null = null
  let currentChannel: Channel | null = null;

  const createChannelModal: ModalContent = {
    content: `
    <label for="title">Channel Title</label>
    <input id="title" name="title" type="text">
    `,
    header: "Create Channel",
    submitText: 0,
  }

  onMount(async () => {
    const user = await updateLoggedUser();
    if (user === null) {
      goto("/login");
      return;
    }
    await reloadChannels();
  })

  async function reloadChannels() {
    console.log($loggedUser?.joinedChannels)
    if ($loggedUser)
      channels = await getChannels($loggedUser.joinedChannels);
    else
      channels = []
  }

  function onChangeChannelClicked(event: CustomEvent<Channel | null>) {
    const channel = event.detail
    currentChannel = channel
    $title = channel?.title || null;
  }

  function onAddChannelClicked() {
    showModal(createChannelModal).then(async (x) => {
      if (x.type === 'sumbitted') {
        const createdChannel = await createChannel({
          title: x.value.title,
          type: 'talkRoom', // TODO
        })
        await userJoinChannel(
          $loggedUser!,
          createdChannel.id
        )
        await updateLoggedUser();
        await reloadChannels()
      }
    })
  }
</script>

<svelte:head>
  <title>
    Carpy
  </title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="sidebar g-elevated">
  <Sidebar
  {channels}
  on:changeChannel={onChangeChannelClicked}
  on:addChannel={onAddChannelClicked}
  />
</section>
<section class="content">
  {#key currentChannel}
  {#if currentChannel}
  <ChannelContextProvider channel={currentChannel}>
    <MessageListView/>
  </ChannelContextProvider>
  {:else}
  <IndexView/>
  {/if}
  {/key}
</section>
<section class="modal">
  <ModalView/>
</section>

<style>
  .sidebar {
    width: 64px;
    background-color: var(--ui-2);
    z-index: 500;
  }

  .content {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
  }

  .modal {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    pointer-events: none;
  }
</style>
