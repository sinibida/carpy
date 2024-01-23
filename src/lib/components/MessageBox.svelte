<script lang="ts">
  export let fromSelf: boolean;
</script>

<div
class="root"
class:self={fromSelf}
class:others={!fromSelf}
>
  <div class="container">
    <slot/>
  </div>
  <div class="gutter"></div>
</div>

<style>
  .root {
    display: flex;

    & .container {
      border-radius: 4px;
      padding: 4px 8px;
      background-color: gray;
      width: fit-content;
      word-break: break-all;
    }

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
    }

    &.others {
      flex-direction: row;
      & .container {
        background-color: var(--ui-accent);
        color: var(--on-accent);
      }
    }
  }

</style>
