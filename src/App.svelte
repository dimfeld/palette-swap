<script>
  import Pickr from './Pickr.svelte';
  import '@simonwep/pickr/dist/themes/classic.min.css';

  const pickrOptions = {
    theme: 'classic',
    lockOpacity: true,
    autoReposition: false,
    inline: true,
    comparison: false,
    defaultRepresentation: 'RGBA',
    showAlways: true,

    components: {
      // Input / output Options
      interaction: {
        clear: false,
        save: false,
      },
    },
  };

  let currentColor = 'rgb(0.2,0.4,0.6)';
</script>

<Pickr
  class="flex flex-col items-center space-y-4"
  options={pickrOptions}
  bind:value={currentColor} />
{currentColor.toRGBA ? currentColor.toRGBA() : currentColor}
