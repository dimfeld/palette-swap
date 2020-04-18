<script>
  import ColorWheel from '../../../src/components/ColorWheel.svelte';

  let fixedValue = 0.5;
  let value;
</script>

<div class="flex flex-col">
  <ColorWheel class="h-64 w-64" bind:fixedValue bind:value />
  <p class="mt-4 mx-2">Luminance</p>
  <input
    bind:value={fixedValue}
    class="mt-1 mx-2 form-input"
    type="number"
    min="0"
    max="1"
    step="0.05" />
</div>

{#if value}
  <p class="mx-2" style="color:{value.rgb().formatHsl()}">
    {value.rgb().formatHsl()}
  </p>
  <p class="mx-2" style="color:{value.rgb().formatRgb()}">
    {value.rgb().formatRgb()}
  </p>
{/if}
