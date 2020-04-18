import '../../css/utils.css';
import { storiesOf } from '@storybook/svelte';
import ColorWheelContainer from './ColorWheelContainer.svelte';

storiesOf('ColorWheel', module).add(
  'Normal',
  () => ({
    Component: ColorWheelContainer,
    props: {},
  })
  // { notes: { markdown: markdownNotes } },
);
