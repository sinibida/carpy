<script lang="ts">
  import { goto } from '$app/navigation';
  import { login } from '../../lib/utils/pocketBasePresenter';
  import { loggedUser } from '../../lib/stores/mainStores';

  let username: string;
  let password: string;
  let loggingIn: boolean = false;
  let loginError: unknown | null = null;

  $: loginDisplay = getLoginDisplay(loginError)

  async function onSubmit(event: SubmitEvent) {
    loggingIn = true
    try {
      const res = await login(username, password)
      goto('/')
    } catch (e) {
      loginError = e;
    } finally {
      loggingIn = false
    }
  }

  function getLoginDisplay(loginError: any | null): string | null {
    if (!loginError) return null

    if (loginError.response) {
      const { response } = loginError;
      if (response.code === 400 && response.message === "Failed to authenticate.")
      {
        return "Username/Password invalid. Please check your input again."
      }
    }

    return String(loginError)
  }
</script>

<div class="root">
  <div class="content">
    {#if loginDisplay}
      <div class="login-error">
        {loginDisplay}
      </div>
      <div style="height: 16px"/>
    {/if}
    <h1>Login</h1>
    <hr>
    <div style="height: 16px"/>
    <form class="login-form" on:submit={onSubmit}>
      <div class="form-field">
        <label for="username">Username</label>
        <input required id="username" type="text" bind:value={username}/>
      </div>
      <div style="height: 16px"/>
      <div class="form-field">
        <label for="password">Password</label>
        <input required id="password" type="password" bind:value={password}/>
      </div>
      <div style="height: 16px"/>
      <input type="submit" class="g-bubble login" value="Login" disabled={loggingIn}/>
    </form>
  </div>
</div>

<style>
  .root {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 240px;
    & hr {
      width: 100%
    }
    & h1 {
      margin: 0;
    }
  }

  .login-error {
    background-color: var(--ui-error);
    color: var(--on-ui);
    border-radius: 8px;
    padding: 16px;
    font-size: small;
  }

  .login-form {
    display: contents;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    & label {
      margin-bottom: 4px;
      font-style: italic;
    }
  }

  .login {
    align-self: flex-end;
  }
</style>
