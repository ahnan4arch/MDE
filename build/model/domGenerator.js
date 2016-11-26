"use strict";
const textEdit_1 = require("./textEdit");
const util_1 = require("../util");
class LineModelToDOMGenerator {
    constructor(_lm) {
        this._lineModel = _lm;
    }
    generate() {
        let div = util_1.DomHelper.elem("div", "editor-line");
        let span = util_1.DomHelper.elem("span");
        span.innerText = this._lineModel.text;
        div.appendChild(span);
        return div;
    }
}
exports.LineModelToDOMGenerator = LineModelToDOMGenerator;
class TextModelToDOMGenerator {
    constructor(_tm) {
        this._textModel = _tm;
    }
    generate() {
        let frame = util_1.DomHelper.elem("div", "editor-frame");
        for (let i = 1; i <= this._textModel.linesCount; i++) {
            let lm = this._textModel.lineAt(i);
            let lmGen = new LineModelToDOMGenerator(lm);
            frame.appendChild(lmGen.generate());
        }
        return frame;
    }
}
exports.TextModelToDOMGenerator = TextModelToDOMGenerator;
function deleteLineOfDom(_node, b, e) {
    let beginIndex = b - 1;
    let endIndex = e - 1;
    for (let i = endIndex; i >= beginIndex; i--) {
        _node.removeChild(_node.children.item(i));
    }
}
function refreshDOM(_tm, _dom, beginLine, endLine) {
    let childList = _dom.children;
    for (let i = beginLine; i <= endLine; i++) {
        let oldElm = childList.item(i - 1);
        let lineGen = new LineModelToDOMGenerator(_tm.lineAt(i));
        let dom = lineGen.generate();
        oldElm.parentElement.replaceChild(dom, oldElm);
    }
}
function applyTextEditToDOM(_textEdit, _tm, _dom) {
    let _range = _textEdit.range;
    switch (_textEdit.type) {
        case textEdit_1.TextEditType.InsertText:
            _tm.insertText(_textEdit.position, _textEdit.text);
            refreshDOM(_tm, _dom, _textEdit.position.line, _textEdit.position.line + _textEdit.lines.length - 1);
            break;
        case textEdit_1.TextEditType.DeleteText:
            _tm.deleteText(_textEdit.range);
            refreshDOM(_tm, _dom, _textEdit.range.begin.line, _textEdit.range.begin.line);
            if (_range.end.line - _range.begin.line >= 1) {
                deleteLineOfDom(_dom, _range.begin.line + 1, _range.end.line);
            }
            break;
        default:
            throw new Error("Error text edit type.");
    }
}
exports.applyTextEditToDOM = applyTextEditToDOM;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbC9kb21HZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLDJCQUFxQyxZQUNyQyxDQUFDLENBRGdEO0FBRWpELHVCQUF3QixTQUN4QixDQUFDLENBRGdDO0FBR2pDO0lBSUksWUFBWSxHQUFjO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQzFCLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxHQUFHLEdBQUcsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRS9DLElBQUksSUFBSSxHQUFHLGdCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFFdEMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0QixNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQztBQUVMLENBQUM7QUFuQlksK0JBQXVCLDBCQW1CbkMsQ0FBQTtBQUVEO0lBSUksWUFBWSxHQUFjO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQzFCLENBQUM7SUFFRCxRQUFRO1FBRUosSUFBSSxLQUFLLEdBQUcsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRWxELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNuRCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVuQyxJQUFJLEtBQUssR0FBRyxJQUFJLHVCQUF1QixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLEtBQUssQ0FBQyxXQUFXLENB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
