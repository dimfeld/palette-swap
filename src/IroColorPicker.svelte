<script>
  import iro from '@jaames/iro';
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  export let value = undefined;
  export let options = undefined;
  let classNames = undefined;
  export { classNames as class };
  export let picker = undefined;

  let container;
  onMount(() => {
    picker = new iro.ColorPicker(container, {
      color: value,
      ...(options || {}),
    });

    picker.on('input:change', (color) => {
      value = color;
      dispatch('change', color);
    });
  });

  $: if (picker && value) {
    picker.color.set(value);
  }
</script>

<div class={classNames} bind:this={container} />
