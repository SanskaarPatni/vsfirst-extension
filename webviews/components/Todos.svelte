<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  export let accessToken: string;
  let text = "";
  let todos: Array<{ text: String; completed: boolean; id: number }> = [];
  export let user: User;

  const addTodo = async (t: string) => {
    const response = await fetch(
      "https://vstodo-mysql-server.herokuapp.com/todo" ||
        `http://localhost:3002/todo`,
      {
        method: "POST",
        body: JSON.stringify({
          text: t,
        }),
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const { todo } = await response.json();
    todos = [todo, ...todos];
  };
  const deleteTodo = async (id: number) => {
    const response = await fetch(
      "https://vstodo-mysql-server.herokuapp.com/todo" ||
        `http://localhost:3002/todo`,
      {
        method: "DELETE",
        body: JSON.stringify({
          id,
        }),
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    todos = todos.filter((todo) => todo.id != id);
  };
  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.type) {
        case "new-todo":
          await addTodo(message.value);
          break;
      }
    });
    const response = await fetch(
      "https://vstodo-mysql-server.herokuapp.com/todo" ||
        `http://localhost:3002/todo`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const payload = await response.json();
    todos = payload.todos;
  });
</script>

<div>Hello {user.name}</div>
<form
  on:submit|preventDefault={async () => {
    //todos = [{ text, completed: false }, ...todos];
    //since now we have an post api for todo
    addTodo(text);
    text = "";
  }}
>
  <input bind:value={text} />
</form>
<ul>
  {#each todos as todo (todo.id)}
    <li
      class:complete={todo.completed}
      on:click={async () => {
        todo.completed = !todo.completed;
        const response = await fetch(
          "https://vstodo-mysql-server.herokuapp.com/todo" ||
            `http://localhost:3002/todo`,
          {
            method: "PUT",
            body: JSON.stringify({
              id: todo.id,
            }),
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }}
    >
      {todo.text}
    </li>
    <button on:click={() => deleteTodo(todo.id)}>Delete todo</button>
  {/each}
</ul>

<style>
  .complete {
    text-decoration: line-through;
  }
</style>
