<script>
  import * as d3 from 'd3-color';
  import { onMount } from 'svelte';

  export let mode = 'hsl';

  export let value;

  export let angleType = 'h';
  export let radiusType = 's';
  export let fixedValue = 0.5;
  export let square = false;

  let canvas;

  let ctx;
  onMount(() => {
    ctx = canvas.getContext('2d');
  });

  async function createColorWheel(s, colorFunc) {
    let endSize = Math.round(s / 2);
    let startSize = -endSize;

    let imageData = new Uint8ClampedArray(4 * s * s);
    let imageDataIndex = 0;

    for (let y = startSize; y < endSize; ++y) {
      for (let x = startSize; x < endSize; ++x) {
        let radius = Math.sqrt(x * x + y * y);
        if (square || radius < endSize) {
          let angle = Math.atan2(y, x);
          let color = colorFunc(angle / (2 * Math.PI), radius / endSize).rgb();
          imageData[imageDataIndex] = color.r;
          imageData[imageDataIndex + 1] = color.g;
          imageData[imageDataIndex + 2] = color.b;
          imageData[imageDataIndex + 3] = 255;
        }
        imageDataIndex += 4;
      }
    }

    let data = new ImageData(imageData, size, size);
    ctx.putImageData(data, 0, 0);
  }

  // Keyed by mode-angleTyperadiusType
  const colorCreators = {
    // HSL Variants
    'hsl-hs': (angle, radius) => d3.hsl(angle * 360, radius, fixedValue),
    'hsl-hl': (angle, radius) => d3.hsl(angle * 360, fixedValue, radius),
    'hsl-sh': (angle, radius) => d3.hsl(radius * 360, angle, fixedValue),
    'hsl-sl': (angle, radius) => d3.hsl(fixedValue, angle, radius),
    'hsl-ls': (angle, radius) => d3.hsl(fixedValue, radius, angle),
    'hsl-lh': (angle, radius) => d3.hsl(radius * 360, fixedValue, angle),

    // RGB Variants
    'rgb-rg': (angle, radius) => d3.rgb(angle * 255, radius * 255, fixedValue),
    'rgb-rb': (angle, radius) => d3.rgb(angle * 255, fixedValue, radius * 255),
    'rgb-gr': (angle, radius) => d3.rgb(radius * 255, angle * 255, fixedValue),
    'rgb-gb': (angle, radius) => d3.rgb(fixedValue, angle * 255, radius * 255),
    'rgb-br': (angle, radius) => d3.rgb(radius * 255, fixedValue, angle * 255),
    'rgb-bg': (angle, radius) => d3.rgb(fixedValue, radius * 255, angle * 255),

    // LCH Variants
    'lch-ch': (angle, radius) => d3.lch(fixedValue, angle * 230, radius * 360),
    'lch-cl': (angle, radius) => d3.lch(radius * 100, angle * 230, fixedValue),
    'lch-hc': (angle, radius) => d3.lch(fixedValue, radius * 230, angle * 360),
    'lch-hl': (angle, radius) => d3.lch(radius * 100, fixedValue, angle * 360),
    'lch-lc': (angle, radius) => d3.lch(angle * 100, radius, fixedValue),
    'lch-lh': (angle, radius) => d3.lch(angle * 100, fixedValue, radius * 360),
  };

  const size = 360;
  $: colorCreator = colorCreators[`${mode}-${angleType}${radiusType}`];
  $: if (colorCreator && ctx) {
    createColorWheel(size, colorCreator);
  }

  function handleClick(evt) {
    if (!canvas) {
      return;
    }

    let x = Math.round(size * (evt.offsetX / canvas.clientWidth - 0.5));
    let y = Math.round(size * (evt.offsetY / canvas.clientHeight - 0.5));

    let angle = Math.atan2(y, x);
    let radius = Math.sqrt(x * x + y * y);

    value = colorCreator(angle / (2 * Math.PI), radius / (size / 2)).rgb();
  }
</script>

<div style="width:256px;height:256px">
  <canvas
    on:click={handleClick}
    width="360"
    height="360"
    style="height:100%;width:100%"
    bind:this={canvas} />
</div>

{#if value}
  <p style="color:{value.formatHsl()}">{value.formatHsl()}</p>
  <p style="color:{value.rgb().formatRgb()}">{value.rgb().formatRgb()}</p>
{/if}
