<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteMap } from "svelte/reactivity";
  import * as Pixi from "pixi.js";
  import P from "../src/p.svelte";

  let textures = $state<SvelteMap<string, Pixi.Texture>>(new SvelteMap());
  let appRef = $state<Pixi.Application>();
  let containerRef = $state<Pixi.Container>();
  const bunnyTexture = $derived(textures.get("bunny"));

  onMount(() => {
    Pixi.Assets.load("https://pixijs.com/assets/bunny.png").then((texture) => {
      textures.set("bunny", texture);
    });
  });

  $effect(() => {
    if (!appRef) return;
    if (!containerRef) return;
    if (!bunnyTexture) return;

    containerRef.x = appRef.screen.width / 2;
    containerRef.y = appRef.screen.height / 2;
    containerRef.pivot.x = containerRef.width / 2;
    containerRef.pivot.y = containerRef.height / 2;

    function spin(time: Pixi.Ticker) {
      if (!containerRef) return;
      containerRef.rotation -= 0.01 * time.deltaTime;
    }

    appRef.ticker.add(spin);

    return () => {
      appRef.ticker.remove(spin);
    };
  });
</script>

<P
  is={Pixi.Application}
  options={{
    background: 0x1099bb,
    resizeTo: document.querySelector("#app") as HTMLElement,
  }}
  bind:ref={appRef}
>
  <P is={Pixi.Container} bind:ref={containerRef}>
    {#if bunnyTexture}
      {#each Array(25) as _, i}
        <P
          is={Pixi.Sprite}
          options={{
            x: (i % 5) * 40,
            y: Math.floor(i / 5) * 40,
            texture: bunnyTexture,
          }}
        />
      {/each}
    {/if}
  </P>
</P>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  :global(#app) {
    width: 100%;
    height: 100vh;
  }
</style>
