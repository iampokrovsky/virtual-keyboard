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
  setSelection(start, end) {
    this.textarea.selectionStart = start;
    this.textarea.selectionEnd = end || start;
  }

  getRows() {
    const text = this.textarea.value;
    const caretPos = this.textarea.selectionStart;

    const sep = '\n';

    let start = 0;

    return text.split(sep).reduce((rows, rowText, index) => {
      rowText += sep;

      const end = start + rowText.length;

      const row = {
        index,
        text: rowText,
        length: rowText.length,
        start,
        end,
      };

      if (caretPos >= start && caretPos <= end) {
        row.caret = true;
        row.caretPosition = caretPos - start;

        rows.caretRow = index;
      }

      rows.push(row);

      start = end;

      return rows;
    }, []);
  }

  moveCaret(direction, start) {
    const directionsShifts = {
      left: -1,
      right: +1,
      up: -1,
      down: +1,
    };

    const shift = directionsShifts[direction];
    let newPosition;

    if (direction === 'left' || direction === 'right') {
      newPosition = (start || this.textarea.selectionStart) + shift;

      if (newPosition < 0) return;
    }

    if (direction === 'up' || direction === 'down') {
      const rows = this.getRows();
      const currentRow = rows[rows.caretRow];
      const targetRowIndex = rows.caretRow + shift;
      const targetRow = rows[targetRowIndex];

      if (!targetRow) return;

      const offset = Math.floor(
          Math.abs(currentRow.length - targetRow.length) / 2);

      const multiplier = (currentRow.length > targetRow.length) ? -1 : 1;

      newPosition = currentRow.caretPosition + offset * multiplier +
          targetRow.start;

      if (newPosition < targetRow.start) {
        newPosition = targetRow.start;
      }

      if (newPosition > targetRow.end) {
        newPosition = targetRow.end - 1;
      }
    }

    this.setSelection(newPosition);
  }

  exec(action, value) {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const fieldValue = this.textarea.value;

    this.textarea.focus();

    if (action === 'moveLeft') {
      this.moveCaret('left');
    }

    if (action === 'moveRight') {
      this.moveCaret('right');
    }

    if (action === 'moveUp') {
      this.moveCaret('up');
    }

    if (action === 'moveDown') {
      this.moveCaret('down');
    }

    if (action === 'insert') {
      this.textarea.setRangeText(value, start, end, 'end');
    }

    if (action === 'delete') {
      if (start === end && start > 0) {
        const changedSubStr = fieldValue.slice(0, start - 1);
        const unchangedSubStr = fieldValue.slice(start);
        this.textarea.value = changedSubStr + unchangedSubStr;

        this.moveCaret('left', start);
      } else {
        this.textarea.setRangeText('');
      }
    }

    if (action === 'selectAll') {
      this.textarea.select();
    }
  }
}
