<script>
  import Pickr from '@simonwep/pickr';

  import { createEventDispatcher, onDestroy } from 'svelte';
  const dispatch = createEventDispatcher();

  let classNames = undefined;
  export { classNames as class };

  export let options;

  export let value = undefined;

  export let visible = false;

  /** This gets set to the pickr component */
  export let pickr = undefined;

  const defaultComponents = {
    // Main components
    preview: true,
    opacity: true,
    hue: true,
  };

  const defaultInteraction = {
    hex: true,
    rgba: true,
    hsla: true,
    hsva: true,
    cmyk: true,
    input: true,
    clear: true,
    save: true,
  };

  onDestroy(() => {
    if (pickr) {
      pickr.destroy();
    }
  });

  let container;
  $: if (container) {
    if (pickr) {
      pickr.destroy();
    }

    let opt = options || {};
    let components = opt.components || {};
    let interaction = components.interaction || {};

    pickr = Pickr.create({
      ...opt,
      components: {
        ...defaultComponents,
        ...components,
        interaction: {
          ...defaultInteraction,
          ...interaction,
        },
      },

      el: container,
    })
      .on('init', (p) => dispatch('init', p))
      .on('hide', (p) => {
        visible = false;
        dispatch('hide', p);
      })
      .on('show', (p) => {
        visible = true;
        dispatch('show', p);
      })
      .on('save', (color, instance) => {
        dispatch('save', { color, pickr });
      })
      .on('clear', (pickr) => dispatch('clear', pickr))
      .on('change', (color, pickr) => {
        console.log({ color, pickr });
        value = color;
        dispatch('change', { color, pickr });
      })
      .on('changestop', (p) => dispatch('changestop', p))
      .on('cancel', (p) => dispatch('cancel', p))
      .on('swatchselect', (color, pickr) => {
        value = color;
        dispatch('swatchselect', { color, pickr });
      });
  }

  $: if (pickr && value) {
    if (typeof value === 'string') {
      pickr.setColor(value);
    } else if (value.toHSVA) {
      let [h, s, v, a] = value.toHSVA();
      pickr.setHSVA(h, s, v, a);
    }
  }
  $: if (pickr) {
    if (visible) {
      pickr.show();
    } else {
      pickr.hide();
    }
  }
</script>

<div class={classNames}>
  <div bind:this={container} />
</div>
