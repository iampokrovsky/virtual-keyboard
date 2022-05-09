import 'simplebar';
import 'simplebar/dist/simplebar.css';

export class Textarea {
  get template() {
    // document.execCommand('defaultParagraphSeparator', false, 'span');

    // setTimeout(() => {
    //   document.querySelector('.textarea__content').focus();
    // }, 1000);

    return `
      <div class="textarea">
        <div class="textarea__inner" data-simplebar>
          <textarea class="textarea__content" contenteditable="true">
          </textarea>
        </div>
      </div>
    `;
  }
}