"use strict";
exports.__esModule = true;
var Chiisai = /** @class */ (function () {
    function Chiisai(state) {
        var _this = this;
        this.state = {
            currentSource: '',
            isPlaying: false,
            isLoading: true,
            currentAuthor: '',
            currentSongTitle: '',
            prefferedSource: 'yt',
            searchList: [],
            query: ''
        };
        this._searchOnSubmit = function (e) {
            e.preventDefault();
            _this.state.query = e.target.value;
            console.log(_this.state.query);
        };
        this.state = state;
        console.log('uwu');
        this.searchField = document.getElementById('searchField');
        this.searchField.addEventListener('submit', this._searchOnSubmit);
    }
    return Chiisai;
}());
exports["default"] = Chiisai;
//# sourceMappingURL=chiisai.js.map