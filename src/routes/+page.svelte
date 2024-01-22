<script lang="ts">
  import ChannelView from "$lib/ChannelView.svelte";
	import './styles.css'

	let channels: Channel[] = [
		{
		title: "Channel 1",
		messages: [],
		},
		{
		title: "Channel 2",
		messages: [],
		},
	]
  let currentChannel: Channel = channels[0];
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="sidebar g-elevation">
	<button on:click={() => currentChannel = channels[0]}>aaa</button>
	<button on:click={() => currentChannel = channels[1]}>bbb</button>
</section>
<section class="content">
	{#key currentChannel}
		<ChannelView channel={currentChannel}/>
	{/key}
</section>

<style>
	.sidebar {
		width: 64px;
		background-color: var(--ui-2);
		z-index: 500;
		display: flex;
		flex-direction: column;

		& button {
			width: 64px;
			height: 64px;
			color: black
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		height: 100%;
		flex: 1;
	}
</style>
