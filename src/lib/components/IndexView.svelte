<script lang="ts">
  import { onMount } from "svelte";
  import { loggedUser } from "../stores/mainStores";

  let username: string | undefined = undefined;

  onMount(() => {
    loggedUser.subscribe((x) => username = x?.username)
  })
</script>

<div class="root g-ui-ghost">
  <div class="foods">
    🍠🥔<br>
    🌾<br>
  </div>
  <div style="height: 16px"/>
  <div class="welcome">
    {#if username}
      Welcome, {username}!
    {:else}
      Welcome!
    {/if}
  </div>
</div>

<style>
  .root {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex-direction: column;

    & .foods {
      font-size: 104px;
      text-align: center;
    }

    & .welcome {
      font-size: large;
    }
  }
</style>