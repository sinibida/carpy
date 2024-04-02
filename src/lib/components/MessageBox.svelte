<script lang="ts">
  export let isDuplicate: boolean;
  export let userInfo: User | undefined;
  export let fromSelf: boolean;

  let showUserInfo: boolean;
  $: showUserInfo = !isDuplicate;
</script>

<div
class="root"
class:self={fromSelf}
class:others={!fromSelf}
>
  {#if showUserInfo}
    <div class="pfp">
      <div class="pfp-placeholder">
        {userInfo ? userInfo.username[0].toUpperCase() : "?"}
      </div>
    </div>
  {:else}
    <div class="pfp hide">
    </div>
  {/if}

  <div class="content">
    {#if showUserInfo}
      <div class="username">
        {userInfo ? userInfo.username : "Loading..."}
      </div>
    {/if}
    <div class="container">
      <slot/>
    </div>
  </div>
  <div class="gutter"></div>
</div>

<style>
  .root {
    display: flex;
    gap: 8px;

    & .gutter {
      flex: 1;
      min-width: 96px;
    }

    &.self {
      flex-direction: row-reverse;
      & .container {
        background-color: var(--ui-2);
        color: var(--on-ui);
      }

      & .content {
        display: flex;
        align-items: flex-end;
        flex-direction: column;
      }
    }

    &.others {
      flex-direction: row;
      & .container {
        background-color: var(--ui-accent);
        color: var(--on-accent);
      }

      & .content {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
      }
    }
  }

  .content {
    & .username {
      font-size: small;
      margin-bottom: 4px;
    }

    & .container {
      border-radius: 4px;
      padding: 4px 8px;
      background-color: gray;
      width: fit-content;
      word-break: break-all;
    }
  }

  .pfp {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    background-color: var(--ui-2);
    border-radius: 4px;
    overflow: hidden;

    &.hide {
      background: none;
      height: unset;
      min-height: unset;
    }

    & .pfp-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: large;
      background-color: var(--ui-accent);
      color: var(--on-accent)
    }
  }

</style>
