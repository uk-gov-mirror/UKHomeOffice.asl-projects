import renderMark from './render-mark';
import { onKeyDown } from './handlers';

export default function Marks() {
  return {
    renderMark,
    onKeyDown
  }
}
