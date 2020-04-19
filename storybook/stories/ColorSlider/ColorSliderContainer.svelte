<script>
  import * as d3 from 'd3-color';
  import ColorSlider from '../../../src/components/ColorSlider.svelte';

  let value = 0.5;
  $: baseColor = d3.hsl(0, 0.5, value);
</script>

<div class="flex flex-col w-48">
  <ColorSlider id="cs" class="h-12" {baseColor} bind:value />
  <p class="mt-4 mx-2">Luminance: {value}</p>
  <!-- <input
    bind:value={fixedValue}
    class="mt-1 mx-2 form-input"
    type="number"
    min="0"
    max="1"
    step="0.05" /> -->
</div>

{#if baseColor}
  <p class="mx-2" style="color:{baseColor.rgb().formatHsl()}">
    {baseColor.rgb().formatHsl()}
  </p>
  <p class="mx-2" style="color:{baseColor.rgb().formatRgb()}">
    {baseColor.rgb().formatRgb()}
  </p>
{/if}
