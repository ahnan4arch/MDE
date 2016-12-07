
import {LineView} from "./viewLine"
import {IVirtualElement, Coordinate, HighlightingRange, HighlightingType} from "."
import {TextModel, LineModel, Position} from "../model"
import {IDisposable, DomHelper} from "../util"
import {PopAllQueue} from "../util/queue"
import {InputerView} from "./viewInputer"
import {CursorView} from "./viewCursor"

function clonePosition(pos: Position) : Position {
    return {
        line: pos.line,
        offset: pos.offset
    };
}

function equalPostion(pos1: Position, pos2: Position) {
    return pos1.line === pos2.line && pos1.offset === pos2.offset;
}

function setHeight(elm: HTMLElement, h: number) {
    elm.style.height = h + "px";
}

export class CursorMoveEvent extends Event {

    private _pos: Position;
    private _co: Coordinate;

    constructor(pos: Position, abs_co: Coordinate) {
        super("cursorMove");
        this._pos = pos;
        this._co = abs_co;
    }

    get position() {
        return this._pos;
    }

    get absoluteCoordinate() {
        return this._co;
    }

}

class NullElement extends DomHelper.ResizableElement {

}

class SelectionAtom extends DomHelper.AbsoluteElement {

    constructor() {
        super("div", "mde-document-selection-atom");
        this._dom.style.zIndex = "-1";
    }

}

class SelectionManager {

    public static readonly DefalutLineHeight = 18;

    private _begin_pos: Position;
    private _end_pos: Position;

    private _posGetter: (pos: Position) => Coordinate;
    private _father_dom: HTMLElement;

    private _top_atom: SelectionAtom = null;
    private _middle_atom: SelectionAtom = null;
    private _end_atom: SelectionAtom = null;

    constructor(_posGetter: (pos: Position) => Coordinate, begin: Position, end?: Position) {
        this._posGetter = _posGetter;
        this._begin_pos = begin;
        this._end_pos = end;
    }

    binding(_father_dom: HTMLElement) {
        this._father_dom = _father_dom;
        this.paint();
    }

    resetEnd(end: Position) {
        if (end !== this._end_pos) {
            this._end_pos = end;
            this.clearAll();
            this.paint();
        }
    }

    private clearAll() {
        if (this._top_atom) {
            this._top_atom.remove();
            this._top_atom = null;
        }
        if (this._middle_atom) {
            this._middle_atom.remove();
            this._middle_atom = null;
        }
        if (this._end_atom) {
            this._end_atom.remove();
            this._end_atom = null;
        }
    }

    private paint() {
        if (this._begin_pos && this._end_pos && 
            !equalPostion(this._begin_pos, this._end_pos)) {

            let beginCo = this._posGetter(this._begin_pos),
                endCo = this._posGetter(this._end_pos);

            if (beginCo.y === endCo.y) {
                
                this._top_atom = new SelectionAtom();
                this._top_atom.appendTo(this._father_dom);

                this._top_atom.width = endCo.x - beginCo.x;

                this._top_atom.marginLeft = beginCo.x;
                this._top_atom.top = beginCo.y;

            } else {

                let rect = this._father_dom.getBoundingClientRect();

                this._top_atom = new SelectionAtom();
                this._middle_atom = new SelectionAtom();
                this._end_atom = new SelectionAtom();

                this._top_atom.appendTo(this._father_dom);
                this._middle_atom.appendTo(this._father_dom);
                this._end_atom.appendTo(this._father_dom);

                this._top_atom.height = this._end_atom.height = SelectionManager.DefalutLineHeight;
                
                this._top_atom.marginLeft = beginCo.x - rect.left;
                this._top_atom.width = rect.right - beginCo.x;
                this._top_atom.top = beginCo.y;

                this._middle_atom.width = rect.right - rect.left;
                this._middle_atom.height = endCo.y - beginCo.y - this._top_atom.height;
                this._middle_atom.top = beginCo.y + this._top_atom.height;

                this._end_atom.top = endCo.y;
                this._end_atom.width = endCo.x - rect.left;
            }
        }
    }

    get beginPosition() {
        return this._begin_pos;
    }

    get endPosition() {
        return this._end_pos;
    }

    remove() {
        this.clearAll();
    }

}

/// Event:
///
/// CursorMove
///
export class DocumentView extends DomHelper.AbsoluteElement implements IDisposable {

    private _model: TextModel;
    private _container: HTMLDivElement;
    private _lines: LineView[];
    private _nullArea: NullElement;
    private _highlightingRanges: PopAllQueue<HighlightingRange>[];

    private _cursor: CursorView;
    private _inputer: InputerView;

    private _window_mousemove_handler: EventListener = null;
    private _window_mouseup_handler: EventListener = null;

    private _mouse_pressed: boolean = false;

    private _selections: SelectionManager[] = [];
    private _focus_selection: SelectionManager = null;

    private _position: Position = { 
        line: 1,
        offset: 0,
    }

    constructor(_model) {
        super("div", "mde-document");
        this._lines = [];
        this._model = _model;
        this._highlightingRanges = [];

        let thk = () => {
            return this.scrollTop;
        }

        this._cursor = new CursorView(thk);
        this._inputer = new InputerView(thk);

        this._cursor.appendTo(this._dom);
        this._inputer.appendTo(this._dom);

        this._inputer.on("focus", this.handleInputerFocused.bind(this));
        this._inputer.on("blur", this.handleInputerBlur.bind(this));

        this._container = <HTMLDivElement>DomHelper.elem("div", "mde-document-container");
        this._dom.appendChild(this._container);

        this._nullArea = new NullElement("div", "mde-document-null");
        this._nullArea.appendTo(this._dom);
        setTimeout(() => {
            this._nullArea.height = this._dom.clientHeight / 2;

            this.updateCursor(this._position);
        }, 5);

        this.on("click", this.handleClick.bind(this));
        this.on("mousedown", this.handleDocMouseDown.bind(this));

        this._window_mousemove_handler = (evt: MouseEvent) => { this.handleWindowMouseMove(evt); }
        this._window_mouseup_handler = (evt: MouseEvent) => { this.handleWindowMouseUp(evt); }

        this.bindingEvent();
        this.stylish();
    }

    private stylish() {
        this._dom.style.overflowY = "scroll";
        this._dom.style.overflowX = "auto";

        this._dom.style.wordBreak = "normal";
        this._dom.style.wordWrap = "break-word";
        this._dom.style.whiteSpace = "pre-wrap";
    }

    private bindingEvent() {
        window.addEventListener("mousemove", this._window_mousemove_handler, true);
        window.addEventListener("mouseup", this._window_mouseup_handler, true);
    }

    private handleDocMouseDown(evt: MouseEvent) {
        this._mouse_pressed = true;

        this._selections.forEach((s: SelectionManager) => {
            s.remove();
        });

        if (this._focus_selection) {
            this._focus_selection.remove();
        }
        let begin_pos = this.getPositionFromCoordinate({
            x: evt.clientX,
            y: evt.clientY,
        });
        let posGetter = (pos: Position) => {
            return this.getCoordinate(pos);
        }
        this._focus_selection = new SelectionManager(posGetter, begin_pos);
        this._focus_selection.binding(this._dom);
    }

    private handleWindowMouseMove(evt: MouseEvent) {
        if (this._mouse_pressed) {
            evt.preventDefault();

            let pos = this.getPositionFromCoordinate({
                x: evt.clientX,
                y: evt.clientY,
            });

            this._focus_selection.resetEnd(pos);
        }
    }

    private handleWindowMouseUp(evt: MouseEvent) {
        this._mouse_pressed = false;
    }

    private getPositionFromCoordinate(co: Coordinate): Position {

        let _range = document.caretRangeFromPoint(co.x, co.y);

        let line_number: number,
            absolute_offset: number,
            linesCount = this.linesCount;

        for (let i = 1; i <= linesCount; i++) {
            let lineView = this.lines[i];
            // let rect = lineView.element().firstElementChild.getBoundingClientRect();
            let rect = lineView.element().getBoundingClientRect();

            if (co.y >= rect.top && co.y <= rect.top + rect.height) {
                line_number = i;
                break;
            }
        }

        if (line_number === undefined)
            throw new Error("Not in range.");

        let lineView = this.lines[line_number];
        let lineElm = lineView.element();

        absolute_offset = 0;
        for (let i = 0; i < lineView.words.length; i++) {
            if (lineView.words[i].element() === _range.startContainer.parentElement) {
                absolute_offset += _range.startOffset;
                break;
            }
            absolute_offset = lineView.words[i].length;
        }

        return {
            line: line_number,
            offset: absolute_offset,
        }
    }

    private handleClick(evt: MouseEvent) {

        this._position = this.getPositionFromCoordinate({
            x: evt.clientX,
            y: evt.clientY,
        });

        let docRect = this._dom.getBoundingClientRect();

        let coordinate = this._lines[this._position.line].getCoordinate(this._position.offset);
        coordinate.y -= docRect.top;

        this.updateCoursorByAbsoluteCoordinate(coordinate, clonePosition(this._position));

        this._inputer.element().focus();
    }

    reload(_model: TextModel) {
        this.dispose();

        this._lines = [] 
        this._model = _model;
        this._highlightingRanges = [];

        this._dom.removeChild(this._container);
        this._container = <HTMLDivElement>DomHelper.elem("div", "mde-document-container");
        this._dom.insertBefore(this._container, this._nullArea.element());

        this._position = {
            line: 1,
            offset: 0,
        }

        setTimeout(() => {
            this.updateCursor(this._position);
        }, 10);

        this.bindingEvent();
    }

    render(): HTMLElement {

        this._lines[0] = null;
        this._model.forEach((line: LineModel) => {
            var vl = new LineView();

            this._lines[line.number] = vl;
            this._highlightingRanges[line.number] = new PopAllQueue<HighlightingRange>();

            vl.render(line.text);
            vl.renderLineNumber(line.number);
            this._container.appendChild(vl.element());
        })

        return this._dom;
    }

    private updateCursor(pos: Position) {
        let cursorCo = this.getCoordinate(pos);

        this.updateCoursorByAbsoluteCoordinate(cursorCo, pos);
    }

    private updateCoursorByAbsoluteCoordinate(co: Coordinate, pos?: Position) {
        let rect = this._dom.getBoundingClientRect();

        // co.x -= this._view.leftPanelView.width;
        co.x -= rect.left;
        //co.x -= this.marginLeft;

        this._cursor.setPostition(co);
        this._inputer.setPostition(co);

        this._cursor.excite();

        let evt = new CursorMoveEvent(pos, co);
        this._dom.dispatchEvent(evt);
    }

    private handleInputerFocused(evt : FocusEvent) {
        this._cursor.excite();
    }

    private handleInputerBlur(evt : FocusEvent) {
        this._cursor.setOff();
    }

    getCoordinate(pos: Position) : Coordinate {
        if (pos.line <= 0 || pos.line > this.linesCount)
            throw new Error("Index out of range.");

        let domRect = this._dom.getBoundingClientRect();
        let co = this._lines[pos.line].getCoordinate(pos.offset);
        co.y -= domRect.top;
        return co;
    }

    renderLine(line: number) {
        if (line <= 0 || line > this.linesCount)
            throw new Error("<index out of range> line:" + line + " LinesCount:" + this.linesCount);
        this._lines[line].render(this._model.lineAt(line).text, this._highlightingRanges[line].popAll());
        this._lines[line].renderLineNumber(line);
    }

    // move lines from after [index] 
    moveLinesBackward(index: number, count: number) {
        if (index > this.linesCount) {
            this.appendLines(count);
            return;
        }
        let _lines_prefix = this._lines.slice(0, index);
        let _lines_postfix = this._lines.slice(index);

        let _new_lines_arr = [];
        _new_lines_arr.length = count;
        this._lines = _lines_prefix.concat(_new_lines_arr).concat(_lines_postfix);

        let _queues_prefix = this._highlightingRanges.slice(0, index);
        let _queues_postfix = this._highlightingRanges.slice(index);

        let _new_queues_arr = [];
        _new_queues_arr.length = count;
        this._highlightingRanges = _queues_prefix.concat(_new_queues_arr).concat(_queues_postfix);

        for (let i = index + count - 1; i >= index; i--) {
            this._lines[i] = new LineView();
            this._container.insertBefore(this._lines[i].element(), 
                this._lines[i + 1].element());
        }
    }

    appendLines(num: number) {
        let _new_lines_arr: LineView[] = [];
        let _new_queues_arr: PopAllQueue<HighlightingRange>[] = [];

        _new_lines_arr.length = num;
        _new_queues_arr.length = num;
        for (let i = 0; i < num; i++) {
            _new_lines_arr[i] = new LineView();
            _new_queues_arr[i] = new PopAllQueue<HighlightingRange>();
            this._container.appendChild(_new_lines_arr[i].element());
        }

        this._lines = this._lines.concat(_new_lines_arr);
        this._highlightingRanges = this._highlightingRanges.concat(_new_queues_arr);
    }

    // delete line from [begin] to [end - 1]
    // set line[begin .. begin + count - 1] to undefined
    deleteLines(begin: number, end?: number) {
        if (begin <= 0)
            throw new Error("Index out of range.");
        end = end? end : begin + 1;

        let _lines_prefix = this._lines.slice(0, begin),
            _lines_middle = this._lines.slice(begin, end),
            _lines_postfix = this._lines.slice(end);

        let _queues_prefix = this._highlightingRanges.slice(0, begin),
            _queues_postfix = this._highlightingRanges.slice(end);

        this._lines = _lines_prefix.concat(_lines_postfix);
        this._highlightingRanges = _queues_prefix.concat(_queues_postfix)

        _lines_middle.forEach((e: LineView) => {
            e.dispose();
            e.remove();
        });
    }

    dispose() {
        this._lines.forEach((e: LineView) => {
            if (e) {
                e.dispose();
            }
        })
        this._inputer.dispose();
        this._cursor.dispose();

        window.removeEventListener("mousemove", this._window_mousemove_handler, true);
        window.removeEventListener("mouseup", this._window_mouseup_handler, true);
    }

    get scrollTop() {
        return this._dom.scrollTop;
    }

    set scrollTop(h : number) {
        this._dom.scrollTop = h;
    }

    get lines() {
        return this._lines;
    }

    get linesCount() {
        return this._lines.length - 1;
    }

    get model() {
        return this._model;
    }

    set model(_model: TextModel) {
        this._model = _model;
    }

    set height(h : number) {
        super.height = h;
        this._nullArea.height = h / 2;
    }

    get height() {
        return super.height;
    }

}
