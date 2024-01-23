<script>
  import { getLoggedUser } from "$lib/utils/pocketBasePresenter";

  let username = getLoggedUser()?.username
</script>

<div class="root">
  <div class="foods">
    🍠🥔<br>
    🌾<br>
  </div>
  <div style="height: 16px"/>
  <div class="welcome">
  Welcome, {username}!
  </div>
</div>

<style>
  .root {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex-direction: column;

    opacity: 25%;
    filter: grayscale();

    & .foods {
      font-size: 104px;
      text-align: center;
      user-select: none;
    }

    & .welcome {
      font-size: large;
    }
  }
</style>