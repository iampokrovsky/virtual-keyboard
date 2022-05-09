import 'simplebar';
import 'simplebar/dist/simplebar.css';

export class Textarea {
  get template() {

    // setTimeout(() => {
    //   document.querySelector('.textarea__content').focus();
    // }, 1000);

    return `
      <div class="textarea">
        <div class="textarea__inner" data-simplebar>
          <div class="textarea__content" contenteditable="true"></div>
        </div>
      </div>
    `;
  }
}