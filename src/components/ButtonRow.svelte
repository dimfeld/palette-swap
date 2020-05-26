<script>
  import { createEventDispatcher } from 'svelte';
  let classNames = '';
  export { classNames as class };
  export let id = undefined;
  /**
   * Array of
   * {
   *   id: string;
   *   label: string;
   *   onClick?: () => void;
   * }
   */
  export let buttons;
  export let buttonClass = '';
  export let value = undefined;
  export let size = 'md';

  const sizes = {
    xxs: 'px-2 py-1 text-xs leading-3',
    xs: 'px-2.5 py-1.5 text-xs leading-4',
    sm: 'px-3 py-2 text-sm leading-4',
    md: 'px-4 py-2 text-sm leading-5',
    lg: 'px-4 py-2 text-base leading-6',
    xl: 'px-6 py-3 text-base leading-6',
  };

  const dispatch = createEventDispatcher();

  function select(button) {
    value = button.id;
    if (button.onClick) {
      button.onClick();
    }
    dispatch('click', button.id);
  }
</script>

<style type="text/postcss">
  button.selected {
    @apply bg-primary-200 text-primary-900;
  }
</style>

<span {id} class="relative z-0 inline-flex shadow-sm {classNames}">
  {#each buttons as button, index}
    <button
      type="button"
      on:click={() => select(button)}
      class:selected={value == button.id}
      class:-ml-px={index > 0}
      class:rounded-l-md={index === 0}
      class:rounded-r-md={index === buttons.length - 1}
      class="relative inline-flex items-center border border-gray-300 bg-white
      font-medium text-primary-700 hover:text-primary-500 focus:z-10
      focus:outline-none focus:border-blue-300 focus:shadow-outline-blue
      active:bg-gray-100 active:text-primary-700 transition ease-in-out
      duration-150 {sizes[size]}
      {buttonClass}">
      <slot {button}>
        <span class="mx-auto whitespace-no-wrap">{button.label}</span>
      </slot>
    </button>
  {/each}
</span>
