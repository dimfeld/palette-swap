<script>
  import { get } from 'lodash-es';
  import * as colors from './colors.ts';
  import * as d3 from 'd3-color';

  export let id;
  let classNames = undefined;
  export { classNames as class };

  export let baseColor;
  export let mode = 'hsl';
  export let valueType = 'l';
  export let value;

  export let vertical = false;

  $: max = get(colors, [mode, valueType, 'max']);

  let bg;
  $: {
    let startColor;
    let midColor;
    let endColor;
    switch (`${mode}-${valueType}`) {
      case 'hsl-h': {
        let c = d3.hsl(baseColor);
        startColor = d3.hsl(0, c.s, c.l).formatHsl();
        midColor = d3.hsl(colors.hsl.h.max / 2, c.s, c.l).formatHsl();
        endColor = d3.hsl(colors.hsl.h.max, c.s, c.l).formatHsl();
        break;
      }
      case 'hsl-s': {
        let c = d3.hsl(baseColor);
        startColor = d3.hsl(c.h, 0, c.l).formatHsl();
        endColor = d3.hsl(c.h, colors.hsl.s.max, c.l).formatHsl();
        break;
      }
      case 'hsl-l': {
        let c = d3.hsl(baseColor);
        startColor = d3.hsl(c.h, c.s, 0).formatHsl();
        midColor = d3.hsl(c.h, c.s, colors.hsl.l.max / 2).formatHsl();
        endColor = d3.hsl(c.h, c.s, colors.hsl.l.max).formatHsl();
        break;
      }

      case 'rgb-r': {
        let c = baseColor.rgb();
        startColor = d3.rgb(0, c.g, c.b).formatRgb();
        endColor = d3.rgb(colors.rgb.r.max, c.g, c.b).formatRgb();
        break;
      }
      case 'rgb-g': {
        let c = baseColor.rgb();
        startColor = d3.rgb(c.r, 0, c.b).formatRgb();
        endColor = d3.rgb(c.r, colors.rgb.g.max, c.b).formatRgb();
        break;
      }
      case 'rgb-b': {
        let c = baseColor.rgb();
        startColor = d3.rgb(c.r, c.g, 0).formatRgb();
        endColor = d3.rgb(c.r, c.g, colors.rgb.b.max).formatRgb();
        break;
      }

      case 'lch-l': {
        let c = d3.lch(baseColor);
        startColor = d3.lch(0, c.c, c.h);
        endColor = d3.lch(colors.lch.l.max, c.c, c.h);
        break;
      }

      case 'lch-c': {
        let c = d3.lch(baseColor);
        startColor = d3.lch(c.l, 0, c.h);
        endColor = d3.lch(c.l, colors.lch.c.max, c.h);
        break;
      }

      case 'lch-h': {
        let c = d3.lch(baseColor);
        startColor = d3.lch(c.l, c.c, 0);
        endColor = d3.lch(c.l, c.c, colors.lch.h.max);
        break;
      }
    }

    let direction = vertical ? 'to bottom' : 'to right';
    bg = `background: linear-gradient(${direction}, ${startColor}, ${midColor}, ${endColor})`;
  }
</script>

<style>
  .vertical {
    -webkit-appearance: slider-vertical;
    appearance: slider-vertical;
  }
</style>

<input
  {id}
  name={id}
  min="0"
  step="0.01"
  {max}
  class:vertical
  class="appearance-none {classNames}"
  type="range"
  style={bg}
  {value}
  on:input={({ target }) => (value = target.valueAsNumber)} />
