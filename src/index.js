import '@/index.html';
import '@styles/style.scss';
import 'simplebar';
import 'simplebar/dist/simplebar.css';

console.log(window.navigator);
document.execCommand('defaultParagraphSeparator', false, 'span');

setTimeout(() => {
  document.querySelector('.textarea__content').focus();
}, 1000);
