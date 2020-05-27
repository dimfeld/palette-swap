<script>
  import Iro from './IroColorPicker.svelte';
  import Color from 'ac-colors';
  import Button from './components/Button.svelte';
  import ButtonRow from './components/ButtonRow.svelte';
  import { set as setIdb, get as getIdb } from 'idb-keyval';
  import sourcePalettes from './palettes';
  import * as clipboard from 'clipboard-polyfill';

  let currentColor = '#5ab896';
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

  getIdb('settings').then((s) => {
    if (!s) {
      return;
    }

    function maybe(key, fn) {
      if (s[key] !== undefined) {
        fn(s[key]);
      }
    }

    maybe('themePalette', (v) => (themePalette = v));
    maybe('chromaSource', (v) => (chromaSource = v));
    maybe('activePaletteId', (v) => (activePaletteId = v));
    if (!sourcePalettes[activePaletteId]) {
      activePaletteId = 'tailwind-indigo';
    }
  });

  $: setIdb('current-color', colorAsString);
  $: setIdb('settings', { chromaSource, themePalette, activePaletteId });

  let activePaletteId = 'tailwind-indigo';
  $: sourcePalette = Object.entries(
    sourcePalettes[activePaletteId].palette
  ).map(([key, value]) => ({ name: key, value }));

  $: activeColor = new Color({ type: 'hex', color: colorAsString });
  $: [activeL, activeC, activeH] = activeColor.lchab;
  $: output = sourcePalette.map(({ name, value }) => {
    let sourceColor = new Color({ type: 'hex', color: value });

    // Use the hue of the palette color and the luminance of the source color. Chroma is selectable.
    let c = chromaSource === 'active-color' ? activeC : sourceColor.lchab[1];
    sourceColor.lchab = [sourceColor.lchab[0], c, activeH];

    return {
      name,
      source: value,
      dest: sourceColor.hexString,
    };
  });

  let copyButtonText = 'Copy Results';

  function copyResults() {
    let obj = {};
    for (let { name, dest } of output) {
      obj[name] = dest;
    }

    let json = JSON.stringify(obj, null, 2);
    try {
      clipboard.writeText(json);
      copyButtonText = 'Copied!';
      setTimeout(() => (copyButtonText = 'Copy Results'), 2000);
    } catch (e) {
      showCopyModal(json);
    }
  }

  function showCopyModal(content) {
    alert(content);
  }

  function sortStrings(a, b) {
    a = a[1].name;
    b = b[1].name;
    if (a < b) {
      return -1;
    } else if (b < a) {
      return 1;
    } else {
      return 0;
    }
  }

  $: themeVarStyles = output
    .map((o) => {
      let varName = `--color-primary-${o.name}`;
      let value = themePalette === 'output-palette' ? o.dest : o.source;
      return `${varName}:${value}`;
    })
    .join(';');

  let themePalette = 'output-palette';
  const styleSourceButtons = [
    { id: 'source-palette', label: 'Source' },
    { id: 'output-palette', label: 'Result' },
  ];

  let chromaSource = 'source-palette';
  const chromaSourceButtons = [
    { id: 'source-palette', label: 'Source Palette' },
    { id: 'active-color', label: 'Selected Color' },
  ];
</script>

<style global language="postcss">
  p {
    max-width: 70ch;
    @apply my-4 text-left w-full;
  }

  a {
    @apply underline text-primary-700;
  }

  ul > li {
    list-style: disc;
    list-style-type: disc;
    list-style-position: outside;
  }
</style>

<div style={themeVarStyles} class="pt-4 px-4 w-full bg-primary-50 min-h-screen">
  <div class="flex flex-col items-center w-full mx-auto">
    <div class="mx-auto flex flex-col items-center space-y-4">
      <div
        class="flex flex-col sm:flex-row space-y-4 sm:space-x-8 sm:space-y-0
        sm:items-center">
        <Iro bind:value={currentColor} />
        <div class="flex flex-col space-y-4 items-center">
          <div class="h-32 w-32" style="background-color:{colorAsString}" />
          <div>{colorAsString}</div>
        </div>
      </div>

      <div
        class="flex flex-col items-center sm:flex-row space-y-4 sm:space-x-8
        sm:space-y-0 sm:justify-between sm:w-full">
        <div class="flex-1">
          <div class="mb-2 text-sm font-medium text-primary-800">
            Site Theme Palette
          </div>
          <ButtonRow
            buttonClass="w-32"
            buttons={styleSourceButtons}
            bind:value={themePalette} />
        </div>

        <div class="flex-1">
          <div class="mb-2 text-sm font-medium text-primary-800">
            Chroma from
          </div>
          <ButtonRow
            buttonClass="w-32"
            buttons={chromaSourceButtons}
            bind:value={chromaSource} />
        </div>
      </div>
      <div>
        <div class="mb-2 text-sm font-medium text-primary-800">
          Source Palette
        </div>
        <select
          class="form-select"
          id="source-palette"
          bind:value={activePaletteId}>
          {#each Object.entries(sourcePalettes).sort(sortStrings) as [key, { name }] (key)}
            <option value={key} selected={activePaletteId === key}>
              {name}
            </option>
          {/each}
        </select>
      </div>

      <div class="flex flex-col w-5/6 max-w-sm">
        {#each output as item}
          <div class="flex flex-row items-center justify-between">
            <div class="h-12 w-12" style="background-color:{item.source}" />

            <div class="w-3/4 text-center text-sm font-medium text-primary-700">
              {item.name}
            </div>

            <div class="h-12 w-12" style="background-color:{item.dest}" />
          </div>
        {/each}
      </div>

      <Button on:click={copyResults}>{copyButtonText}</Button>
    </div>

    <p class="text-primary-700 text-center">
      <strong>Custom source palettes coming soon!</strong>
    </p>

    <p>
      If you found this useful or interesting, please let me know and
      <a href="https://www.twitter.com/dimfeld">follow me on Twitter</a>
      where I post more about tech and web development.
    </p>
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
      Source palettes are from
      <a href="https://tailwindcss.com">Tailwind CSS</a>
      and
      <a href="https://material-ui.com/customization/color/">Material UI.</a>
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
