import {parseTextToLines} from "../util/text"
import {Position, Range, isPosition, isRange} from "."

export enum TextEditType {
    InsertText, DeleteText, ReplaceText
}

export class TextEdit {

    private _type : TextEditType
    private _range : Range
    private _position : Position;
    private _text: string;
    private _lines: string[]

    constructor(_type: TextEditType, _rp: Range | Position, _text?: string) {
        this._type = _type;
        if (_text === undefined)
            this._text = null;
        else
        {
            this._text = _text;
            this._lines = parseTextToLines(_text);
        }

        if (_type == TextEditType.InsertText && isPosition(_rp)) {
            this._position = _rp;
        }
        else if (_type == TextEditType.ReplaceText && isRange(_rp)) {
            this._range = _rp;
        }
        else if (_type == TextEditType.DeleteText && isRange(_rp)) {
            this._range = _rp;
        } else
            throw new Error("Error data input");
    }

    get type() {
        return this._type;
    }

    get range() {
        return this._range;
    }

    get position() {
        return this._position
    }

    get text() {
        return this._text;
    }

    get lines() {
        return this._lines;
    }

}