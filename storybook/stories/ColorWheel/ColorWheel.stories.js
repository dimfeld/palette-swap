import { storiesOf } from '@storybook/svelte';
import ColorWheel from '../../../src/components/ColorWheel.svelte';

storiesOf('ColorWheel', module)
  //Modern Alert
  .add(
    'Normal',
    () => ({
      Component: ColorWheel,
      props: {},
    })
    // { notes: { markdown: markdownNotes } },
  );
