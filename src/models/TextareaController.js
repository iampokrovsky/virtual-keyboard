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
  // actions = {}

  // getCaret(el) {
  //   if (el.selectionStart) {
  //     return el.selectionStart;
  //   } else if (document.selection) {
  //     el.focus();
  //
  //     var r = document.selection.createRange();
  //     if (r == null) {
  //       return 0;
  //     }
  //
  //     var re = el.createTextRange(),
  //         rc = re.duplicate();
  //     re.moveToBookmark(r.getBookmark());
  //     rc.setEndPoint('EndToStart', re);
  //
  //     return rc.text.length;
  //   }
  //   return 0;
  // }

  getCaretPos(obj) {
    obj.focus();
    if (obj.selectionStart) return obj.selectionStart;
    else if (document.selection) {
      var sel = document.selection.createRange();
      var clone = sel.duplicate();
      sel.collapse(true);
      clone.moveToElementText(obj);
      clone.setEndPoint('EndToEnd', sel);
      return clone.text.length;
    }
    return 0;
  }

  changeCaretPosition = (direction, start) => {
    const directions = {
      left: -1,
      right: +1,
    };

    const newPosition = (start || this.textarea.selectionStart) +
        directions[direction];

    if (newPosition < 0) return;

    this.textarea.selectionStart = newPosition;
    this.textarea.selectionEnd = newPosition;
  };

  exec(action, value) {
    const selectionStart = this.textarea.selectionStart;
    const selectionEnd = this.textarea.selectionEnd;
    const fieldValue = this.textarea.value;

    this.textarea.focus();

    if (action === 'moveLeft') {
      this.changeCaretPosition('left');
    }

    if (action === 'moveRight') {
      this.changeCaretPosition('right');
    }

    if (action === 'insert') {
      this.textarea.setRangeText(value, selectionStart, selectionEnd, 'end');
    }

    if (action === 'delete') {
      if (selectionStart === selectionEnd && selectionStart > 0) {
        const changedSubStr = fieldValue.slice(0, selectionStart - 1);
        const unchangedSubStr = fieldValue.slice(selectionStart);
        this.textarea.value = changedSubStr + unchangedSubStr;

        this.changeCaretPosition('left', selectionStart);
      } else {
        this.textarea.setRangeText('');
      }
    }

    if (action === 'selectAll') {
      this.textarea.select();
    }
  }

  // exec(action, value) {
  //   if (action === 'insert') {
  //     document.execCommand('insertText', false, value);
  //   }
  //
  //   if (action === 'delete') {
  //     const selection = window.getSelection();
  //     const node = selection.focusNode;
  //
  //     if (selection.type === 'Range') {
  //       selection.getRangeAt(0).deleteContents();
  //     } else {
  //       node.textContent = node.textContent.slice(0, -1);
  //     }
  //   }
  // }

}
