import '../../css/utils.css';
import { storiesOf } from '@storybook/svelte';
import ColorSliderContainer from './ColorSliderContainer.svelte';

storiesOf('ColorSlider', module).add(
  'HSL - L',
  () => ({
    Component: ColorSliderContainer,
    props: {},
  })
  // { notes: { markdown: markdownNotes } },
);
