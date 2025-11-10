<script lang="ts" generics="T extends new (...args: any[]) => any">
  import {
    Application,
    type Container,
    type Graphics,
    type NineSliceSprite,
    type Sprite,
    type TilingSprite,
    type Text,
    type Mesh,
    type ParticleContainer,
  } from "pixi.js";
  import {
    setContext,
    getContext,
    type Snippet,
    onDestroy,
    onMount,
  } from "svelte";

  type TIs =
    | Application
    | Container
    | Sprite
    | NineSliceSprite
    | TilingSprite
    | Graphics
    | Text
    | Mesh
    | ParticleContainer;

  interface Props {
    is: T;
    options?: ConstructorParameters<T>[0];
    children?: Snippet;
    onReady?: (instance: InstanceType<T>) => void | Promise<void>;
    ref?: TIs;
  }

  let {
    is: Is,
    options,
    children,
    onReady,
    ref = $bindable(),
  }: Props = $props();

  const rootComponent = document.querySelector("#app");
  const parent = getContext<TIs>("parent");

  const instance = new Is(options);
  let isReady = $state(false);
  ref = instance;

  setContext("parent", instance);

  onMount(() => {
    if (instance instanceof Application) {
      instance.init(options).then(() => {
        rootComponent?.appendChild(instance.canvas);
        isReady = true;
        onReady?.(instance as InstanceType<T>);
      });
    } else {
      if (parent instanceof Application) {
        parent.stage.addChild(instance);
      } else {
        parent?.addChild(instance);
      }
      isReady = true;
      onReady?.(instance as InstanceType<T>);
    }
  });

  onDestroy(() => {
    if (instance instanceof Application) {
      instance.canvas?.parentElement?.removeChild(instance.canvas);
      instance.destroy(true);
    } else {
      instance.parent?.removeChild?.(instance);
    }
  });
</script>

{#if children && isReady}{@render children?.()}{/if}
