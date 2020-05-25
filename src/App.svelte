<script>
  import Pickr from './Pickr.svelte';
  import '@simonwep/pickr/dist/themes/classic.min.css';
  import { set as setIdb, get as getIdb } from 'idb-keyval';

  const pickrOptions = {
    theme: 'classic',
    lockOpacity: true,
    autoReposition: false,
    inline: true,
    comparison: false,
    defaultRepresentation: 'RGBA',
    showAlways: true,
    useAsButton: true,
    // sliders: 'hv',

    components: {
      // Input / output Options
      interaction: {
        hex: false,
        rgba: false,
        hsla: false,
        hsva: false,
        cmyk: false,
        clear: false,
        save: false,
      },
    },
  };

  let currentColor = 'rgb(0.2,0.4,0.6)';

  function colorToString(c) {
    return currentColor.toRGBA
      ? currentColor.toRGBA().toString()
      : currentColor.toString();
  }

  getIdb('current-color')
    .then((c) => {
      console.log('loaded', c);
      if (c) {
        currentColor = c;
      }
    })
    .catch((e) => {
      console.error(e);
    });

  $: setIdb('current-color', colorToString(currentColor));
</script>

<Pickr
  class="flex flex-col items-center space-y-4"
  options={pickrOptions}
  bind:value={currentColor} />
{colorToString(currentColor)}
<div class="h-32 w-32" style="background-color:{colorToString(currentColor)}" />
