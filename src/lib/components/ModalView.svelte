<script lang="ts">
  import { currentModal, modalResults } from "../stores/modalStores";

  let enabled: boolean
  $: enabled = $currentModal !== null;
  let content: string = ""
  let header: string = ""
  let submitText: string | number | undefined = ""
  $: {
    if ($currentModal) {
      ({
        content,
        header,
        submitText
      } = $currentModal);
    }
  }

  let submitActualText: string | undefined
  $: {
    switch (typeof submitText) {
      case 'string': submitActualText = submitText; break;
      case 'number': submitActualText = ['OK', 'Submit'][submitText]; break;
      default: submitActualText = undefined; break;
    }
  }

  function onCloseClick() {
    currentModal.set(null)
    $modalResults = {
      type: 'closed',
      value: undefined,
    }
  }

  function onSubmit(event: SubmitEvent) {
    // https://stackoverflow.com/a/39163980
    const formEl = Array.from(document.forms).find(x => x.id == "carpyModalForm");
    if (formEl === undefined) {
      throw Error("Form not found???")
    }
    const data = new FormData(formEl);

    currentModal.set(null)
    $modalResults = {
      type: 'sumbitted',
      value: Object.fromEntries(data.entries()),
    }
  }
</script>

<div class="root" class:enabled={enabled}>
  <div class="modal g-elevated">
    <div class="header">
      <div class="header-text">
        {header}
      </div>
      <button class="g-icon-button" on:click={onCloseClick}>
        <i class="mi">close</i>
      </button>
    </div>
    <hr>
    <form class="content" id="carpyModalForm" on:submit={onSubmit}>
      {#key $currentModal}
        {@html content}
        {#if submitActualText}
          <input value={submitActualText} class="g-bubble sumbit-button" type="submit"/>
        {/if}
      {/key}
    </form>
  </div>
</div>

<style>
  .root {
    width: 100%;
    height: 100%;
    background-color: transparent;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 400ms ease;

    & .modal {
      background: var(--ui-2);
      padding: 16px;
      border-radius: 16px;
      transform: scale(0.8);
      opacity: 0%;
      transition: 
        transform 200ms ease,
        opacity 200ms ease;
    }

    &.enabled {
      background-color: #0008;
      pointer-events: all;

      & .modal {
        transform: scale(1.0);
        opacity: 100%;
      }
    }
  }
  
  .modal {
    display: flex;
    flex-direction: column;
    min-width: 200px;

    & .header {
      height: 24px;
      display: flex;
      align-items: center;

      & .header-text {
        flex: 1;
        font-size: large;
        font-weight: bold;
      }
    }

    & hr {
      width: 100%;
      border: solid var(--ui-3) thin;
    }

    & .content {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 8px;

      & .sumbit-button {
        align-self: flex-end;
      }
    }
  }
</style>