<script lang="ts">
  import { goto } from '$app/navigation';
  import { login, register } from '../../lib/utils/pocketBasePresenter';
  import { loggedUser } from '../../lib/stores/mainStores';

  let username: string;
  let password: string;
  let email: string;
  let confirmPassword: string;
  let loggingIn: boolean = false;
  let loginError: unknown | null = null;

  $: loginDisplay = getLoginDisplay(loginError)

  async function onSubmit(event: SubmitEvent) {
    
    loggingIn = true
    try {
      if (password !== confirmPassword) {
        loginError = "The password and the confirmation is not same. Please check your input again."
        return;
      }
      const res = await register(username, email, password, confirmPassword)
      goto('/login')
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
    <h1>Register</h1>
    <hr>
    <div style="height: 16px"/>
    <form class="login-form" on:submit={onSubmit}>
      <div class="form-field">
        <label for="username">Username</label>
        <input required id="username" type="text" bind:value={username}/>
      </div>
      <div style="height: 16px"/>
      <div class="form-field">
        <label for="email">Email</label>
        <input required id="email" type="email" bind:value={email}/>
      </div>
      <div style="height: 16px"/>
      <div class="form-field">
        <label for="password">Password</label>
        <input required id="password" type="password" bind:value={password}/>
      </div>
      <div style="height: 16px"/>
      <div class="form-field">
        <label for="confirm-password">Confirm Password</label>
        <input required id="confirm-password" type="password" bind:value={confirmPassword}/>
      </div>
      <div style="height: 16px"/>
      <div class="login-row">
        <input type="submit" class="g-bubble login" value="Register" disabled={loggingIn}/>
      </div>
    </form>
  </div>
</div>

<style>
  .root {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: max-content;
    min-height: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
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

  .login-row {
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 8px;

    & a {
      color: var(--on-ui-weak);
      font-size: small;
    }
  }
</style>
