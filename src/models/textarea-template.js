import 'simplebar';
import 'simplebar/dist/simplebar.css';

export const textareaTemplate = () => {
  return `
    <div class="textarea">
      <div class="textarea__inner" data-simplebar>
        <div class="textarea__content" contenteditable="true">Пожалуйста, дайте еще 1 день на доработку🥺</div>
      </div>
    </div>
  `;
};