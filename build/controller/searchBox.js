"use strict";
class SearchBox {
    constructor() {
        this._elem = document.getElementById("searchbox");
        this._closeBtn = this._elem.getElementsByClassName("searchbox-titlebar-btn")[0];
        this._searchInput = this._elem.getElementsByTagName("input")[0];
        this._replaceInput = this._elem.getElementsByTagName("input")[1];
        this._replaceButton = this._elem.getElementsByTagName("button")[0];
        this._replaceAllButton = this._elem.getElementsByTagName("button")[1];
        this._closeBtn.addEventListener("click", (e) => this.handleClose(e));
        this._searchInput.addEventListener("input", (e) => this.handleSearchInputChanged(e));
        this._replaceInput.addEventListener("input", (e) => this.handleReplaceInputChanged(e));
        this._replaceButton.addEventListener("click", (e) => this.handleReplaceButtonClicked(e));
        this._replaceAllButton.addEventListener("click", (e) => this.handleReplaceAllButtonClicked(e));
        this.display = true;
    }
    static GetOne() {
        if (SearchBox._onlyOne === null) {
            SearchBox._onlyOne = new SearchBox();
        }
        return SearchBox._onlyOne;
    }
    handleClose(e) {
        this.display = false;
    }
    handleSearchInputChanged(e) {
        this._searchInputContent = this._searchInput.value;
    }
    handleReplaceInputChanged(e) {
        this._replaceInputContent = this._replaceInput.value;
    }
    handleReplaceButtonClicked(e) {
    }
    handleReplaceAllButtonClicked(e) {
    }
    set width(w) {
        if (w !== this._width) {
            this._width = w;
            this._elem.style.width = w + "px";
        }
    }
    get width() {
        return this._width;
    }
    set display(b) {
        if (b !== this._display) {
            this._display = b;
            if (b) {
                this._elem.classList.add("active");
            }
            else {
                this._elem.classList.remove("active");
            }
        }
    }
    get display() {
        return this._display;
    }
    get searchInputContent() {
        return this._searchInputContent;
    }
    get replaceInputContent() {
        return this._replaceInputContent;
    }
    get searchInput() {
        return this._searchInput;
    }
    get replaceInput() {
        return this._replaceInput;
    }
    get closeButton() {
        return this._closeBtn;
    }
}
SearchBox._onlyOne = null;
exports.SearchBox = SearchBox;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb250cm9sbGVyL3NlYXJjaEJveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7SUF3Qkk7UUFDSSxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFbEQsSUFBSSxDQUFDLFNBQVMsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdGLElBQUksQ0FBQyxZQUFZLEdBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEYsSUFBSSxDQUFDLGFBQWEsR0FBcUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVuRixJQUFJLENBQUMsY0FBYyxHQUFzQixJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RGLElBQUksQ0FBQyxpQkFBaUIsR0FBc0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6RixJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQWEsS0FBSyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakYsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFRLEtBQUssSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFRLEtBQUssSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMs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