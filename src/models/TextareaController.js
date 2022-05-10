// eslint-disable-next-line import/prefer-default-export
export class TextareaController {
  static activeInstance;

  CARET_BLINK_TIME = 1000;

  constructor({layout: {textarea}} = {}) {
    if (TextareaController.activeInstance) {
      // eslint-disable-next-line no-constructor-return
      return TextareaController.activeInstance;
    }

    this.textarea = textarea;

    TextareaController.activeInstance = this;
  }

  // eslint-disable-next-line class-methods-use-this
  exec(action, value) {
    if (action === 'insert') {
      document.execCommand('insertText', false, value);
    }

    if (action === 'delete') {
      const selection = window.getSelection();
      const node = selection.focusNode;

      if (selection.type === 'Range') {
        selection.getRangeAt(0).deleteContents();
      } else {
        node.textContent = node.textContent.slice(0, -1);
      }
    }
  }

}
