export class TextareaController {
  static activeInstance;

  CARET_BLINK_TIME = 1000;

  constructor(layout) {
    if (TextareaController.activeInstance) {
      TextareaController.activeInstance.id;
      return TextareaController.activeInstance;
    }

    this.textarea = layout.textarea;

    // this.watchCaret();

    TextareaController.activeInstance = this;
  }

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

  watchCaret() {
    const textareaContent = this.textarea.querySelector('.textarea__content');

    this.watchCaretInterval = setInterval(() => textareaContent.focus(),
        this.CARET_BLINK_TIME);
  }

  stopWatchCaret() {
    clearInterval(this.watchCaretInterval);
  }

  destroy() {
    this.stopWatchCaret();
    TextareaController.activeInstance = null;
  }
}