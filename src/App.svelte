<script>
  import Iro from './IroColorPicker.svelte';
  import { set as setIdb, get as getIdb } from 'idb-keyval';

  let currentColor = '#91c775';

  function colorToString(c) {
    return currentColor.hexString ? currentColor.hexString : currentColor;
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

<div class="flex flex-col items-center space-y-4">
  <Iro bind:value={currentColor} />
  <div>{colorToString(currentColor)}</div>
  <div
    class="h-32 w-32"
    style="background-color:{colorToString(currentColor)}" />
</div>
