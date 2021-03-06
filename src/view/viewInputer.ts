import {DomHelper, IDisposable} from "../util"
import {Coordinate, IHidable} from "."

export class InputerView extends 
DomHelper.Generic.AbsoluteElement<HTMLTextAreaElement> implements IDisposable, IHidable {

    private _focused: boolean = false;
    private _isCompositing: boolean = false;

    private _isComposintThunkTimers : NodeJS.Timer[] = [];

    constructor() {
        super("textarea", "mde-inputer");

        this._dom.addEventListener("focus", (evt: FocusEvent) => {
            this._focused = true;
        })

        this._dom.addEventListener("blur", (evt: FocusEvent) => {
            this._focused = false;
        })

        this._dom.addEventListener("compositionstart", (evt: Event) => {
            this._isCompositing = true;
        });

        this._dom.addEventListener("compositionend", (evt: Event) => {
            this._isComposintThunkTimers.push(setTimeout(() => {
                this._isCompositing = false;
            }, 5));
        })

    }

    clearContent() {
        this._dom.value = "";
    }

    setAbsoluteCoordinate(coordinate: Coordinate) {
        this.left = coordinate.x;
        this.top = coordinate.y;
    }

    isFosused() {
        return this._focused;
    }

    isCompositioning() {
        return this._isCompositing;
    }

    dispose() {
        this._isComposintThunkTimers.forEach((t: NodeJS.Timer) => {
            clearTimeout(t);
        });
    }

    hide() {
        this._dom.style.display = "none";
    }

    show() {
        this._dom.style.display = "block";
    }

    isHidden() {
        return this._dom.style.display == "none";
    }

    get value() {
        return this._dom.value;
    }

    set value(content: string) {
        this._dom.value = content;
    }

}
