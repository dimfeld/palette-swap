<script>
  import Iro from './IroColorPicker.svelte';
  import Color from 'ac-colors';
  import { set as setIdb, get as getIdb } from 'idb-keyval';

  let currentColor = '#91c775';
  $: colorAsString = currentColor.hexString
    ? currentColor.hexString
    : currentColor;

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

  $: setIdb('current-color', colorAsString);

  const sourcePalette = [
    { name: '50', value: '#f0f5ff' },
    { name: '100', value: '#e5edff' },
    { name: '200', value: '#cddbfe' },
    { name: '300', value: '#b4c6fc' },
    { name: '400', value: '#8da2fb' },
    { name: '500', value: '#6875f5' },
    { name: '600', value: '#5850ec' },
    { name: '700', value: '#5145cd' },
    { name: '800', value: '#42389d' },
    { name: '900', value: '#362f78' },
  ];

  $: activeColor = new Color({ type: 'hex', color: colorAsString });
  $: [activeL, activeC, activeH] = activeColor.lchab;
  $: output = sourcePalette.map(({ name, value }) => {
    let sourceColor = new Color({ type: 'hex', color: value });

    // Set the color to the chrome and hue of the active color, but the luminance of the source color
    sourceColor.lchab = [sourceColor.lchab[0], activeC, activeH];

    return {
      name,
      source: value,
      dest: sourceColor.hexString,
    };
  });
</script>

<div class="flex flex-col items-center space-y-4">
  <Iro bind:value={currentColor} />
  <div>{colorAsString}</div>
  <div class="h-32 w-32" style="background-color:{colorAsString}" />

  <div class="flex flex-col">
    {#each output as item}
      <div class="flex flex-row">
        <div class="h-12 w-12" style="background-color:{item.source}" />
        <div class="h-12 w-12" style="background-color:{item.dest}" />
      </div>
    {/each}
  </div>
</div>
