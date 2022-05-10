import {VirtualKeyboard} from '@models/VirtualKeyboard.js';

const virtualKeyboard = new VirtualKeyboard();

virtualKeyboard.render();

console.log('pointerdown'.match(/^pointer/gi));