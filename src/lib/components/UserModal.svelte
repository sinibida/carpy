<script>
  import { goto } from "$app/navigation";
  import { logout } from "$lib/utils/pocketBasePresenter";
  import { loggedUser } from "../stores/mainStores";

  let expand = false;

  function onLogOutClick() {
    logout();
    goto("/login");
    expand = false;
  }
</script>

<div class="root">
  <div class="username">
    {#if $loggedUser}
      {$loggedUser.username}
    {:else}
      Not Logged In
    {/if}
  </div>
  <button class="g-icon-button" on:click={() => expand = !expand}>
    <i class="mi">{#if expand}
      expand_less
      {:else}
      expand_more
    {/if}</i>
  </button>
  <div class="dropdown g-elevated" class:active={expand}>
    <button on:click={onLogOutClick}>
      <i class="mi">logout</i>
      Log Out
    </button>
  </div>
</div>

<style>
  .root {
    font-size: medium;
    display: flex;
    align-items: center;
    position: relative;
  }
  .dropdown {
    position: absolute;
    top: 24px;
    width: 128px;
    background-color: var(--ui-3);
    opacity: 0%;
    transform: translate(0, -16px);
    pointer-events: none;
    transition:
      opacity 200ms ease,
      transform 200ms ease;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 8px;

    &.active {
      opacity: 100%;
      transform: translate(0, -0px);
      pointer-events: all;
    }

    &>button {
      background: none;
      padding: none;
      border: none;
      font-size: inherit;
      text-align: left;

      &:hover {
        background-color: grey;
      }
    }
  }
</style>