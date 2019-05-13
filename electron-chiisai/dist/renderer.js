"use strict";
exports.__esModule = true;
var chiisai_1 = require("./chiisai");
var main = function () {
    var tempstate = {
        currentSource: '',
        isPlaying: false,
        isLoading: true,
        currentAuthor: '',
        currentSongTitle: '',
        prefferedSource: 'yt',
        searchList: [],
        query: ''
    };
    return new chiisai_1["default"](tempstate);
};
//# sourceMappingURL=renderer.js.map