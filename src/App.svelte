<script>
  import Iro from './IroColorPicker.svelte';
  import Color from 'ac-colors';
  import * as twColors from '@tailwindcss/ui/colors.js';
  import { set as setIdb, get as getIdb } from 'idb-keyval';

  let currentColor = '#5ab896';
  $: colorAsString = currentColor.hexString
    ? currentColor.hexString
    : currentColor;

  let dynamicTheme = true;

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

  getIdb('settings').then((s) => {
    if (!s) {
      return;
    }

    function maybe(key, fn) {
      if (s[key] !== undefined) {
        fn(s[key]);
      }
    }

    maybe('dynamicTheme', (v) => (dynamicTheme = v));
  });

  $: setIdb('current-color', colorAsString);
  $: setIdb('settings', { dynamicTheme });

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

  $: themeVarStyles = output
    .map((o) => {
      let varName = `--color-primary-${o.name}`;
      let value = dynamicTheme ? o.dest : twColors.teal[o.name];
      return `${varName}:${value}`;
    })
    .join(';');
</script>

<style language="postcss">
  p {
    max-width: 70ch;
    @apply my-4;
  }

  a {
    @apply underline text-primary-700;
  }
</style>

<div style={themeVarStyles} class="pt-4 px-4 w-full bg-primary-50 min-h-screen">
  <div class="flex flex-col items-center w-full mx-auto">
    <div class="mx-auto flex flex-col items-center space-y-4 max-w-md">
      <Iro bind:value={currentColor} />
      <div>{colorAsString}</div>
      <div class="h-32 w-32" style="background-color:{colorAsString}" />

      <div>
        <input
          name="dynamic-theme"
          id="dynamic-theme"
          type="checkbox"
          bind:checked={dynamicTheme} />
        <label for="dynamic-theme">Use selected color for site theme</label>
      </div>

      <div class="flex flex-col w-5/6">
        {#each output as item}
          <div class="flex flex-row justify-between">
            <div class="h-12 w-12" style="background-color:{item.source}" />

            <div class="text-sm font-medium text-primary-700">{item.name}</div>

            <div class="h-12 w-12" style="background-color:{item.dest}" />
          </div>
        {/each}
      </div>
    </div>

    <p>
      This tool is the outgrowth of a blog post I wrote in early 2020 when I
      used the LCH color space to adapt the Angular Material blue-gray colors to
      match Tailwind UI's indigo palette.
      <a href="https://imfeld.dev/writing/transferring_color_palettes">
        Read the post
      </a>
      for the story and more details about how this works.
    </p>
    <p>
      If you found this useful or interesting, please let me know and
      <a href="https://www.twitter.com/dimfeld">follow me on Twitter</a>
      where I post more about tech and web development.
    </p>
    <p>
      This site is written in
      <a href="https://www.svelte.dev">Svelte</a>
      and uses the
      <a href="https://iro.js.org/">Iro color picker.</a>
      Hosting provided by
      <a href="https://www.vercel.com">Vercel.</a>
      See the code on
      <a href="https://www.github.com/dimfeld/palette-swap">Github.</a>

    </p>
  </div>
</div>
