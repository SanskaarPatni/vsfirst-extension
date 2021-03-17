<script lang="ts">
  import { onMount } from "svelte";

  let todos: Array<{ text: String; completed: boolean }> = [];
  let text = "";

  onMount(() => {
    window.addEventListener("message", (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
        case "new-todo":
          todos = [{ text: message.value, completed: false }];
          break;
      }
    });
  });
</script>

<form
  on:submit|preventDefault={() => {
    todos = [{ text, completed: false }, ...todos];
    text = "";
  }}
>
  <input bind:value={text} />
</form>
<ul>
  {#each todos as todo (todo.text)}
    <li
      class:complete={todo.completed}
      on:click={() => {
        todo.completed = !todo.completed;
      }}
    >
      {todo.text}
    </li>
  {/each}
</ul>
<!-- svelte-ignore missing-declaration -->
<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onInfo",
      value: "info message",
    });
  }}>click me</button
>
<!-- svelte-ignore missing-declaration -->
<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onError",
      value: "info message",
    });
  }}>click me</button
>

<style>
  .complete {
    text-decoration: line-through;
  }
</style>
