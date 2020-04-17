<script>
  import { onMount } from 'svelte';
  let canvas;

  let ctx;
  onMount(() => {
    ctx = canvas.getContext('2d');
  });

  let hLum = 50;
  let canvasImage;
  $: {
    if (ctx) {
      let hgradient = ctx.createLinearGradient(0, 0, 360, 0);
      let vgradient = ctx.createLinearGradient(0, 0, 0, 360);
      let numSteps = 36;
      let pct = hLum + '%';
      for (let i = 0; i <= numSteps; i++) {
        let ratio = i / numSteps;
        hgradient.addColorStop(ratio, `hsl(${ratio}turn, 100%, ${pct}`);
        vgradient.addColorStop(ratio, `hsl(0, 0%, 100%, ${1 - ratio})`);
      }
      ctx.fillStyle = hgradient;
      ctx.fillRect(0, 0, 360, 360);
      ctx.fillStyle = vgradient;
      ctx.fillRect(0, 0, 360, 360);
    }
  }

  let msg = '';
  let color = `hsl(250, 0, 0)`;
  function handleClick(evt) {
    let x = evt.offsetX / canvas.clientWidth;
    let y = evt.offsetY / canvas.clientHeight;

    let h = x;
    let s = y;
    let l = hLum;

    color = `hsl(${h}turn, ${s * 100}%, ${l}%)`;
    msg = `${x} ${y}: ${color}`;
  }

  // 	setInterval(() => {
  // 		hLum += 1;
  // 		if(hLum > 100) {
  // 			hLum = 0;
  // 		}
  // 	}, 10)
</script>

<div style="width:256px;height:256px">
  <canvas
    on:click={handleClick}
    width="360"
    height="360"
    style="height:100%;width:100%"
    bind:this={canvas} />
</div>

<p style="color:{color}">{msg}</p>
