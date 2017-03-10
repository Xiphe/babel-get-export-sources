import { hoc } from 'hoc'; // eslint-disable-line
import { lorem as ipsum } from './function';

function getBar() {
  return ipsum;
}

function getAsd() {
  const b = getBar();

  return b;
}

const Component = getAsd();

export default hoc(Component, 'asd');
