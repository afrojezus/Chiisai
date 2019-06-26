"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var simple_youtube_api_1 = __importDefault(require("simple-youtube-api"));
var node_notifier_1 = __importDefault(require("node-notifier"));
var path_1 = __importDefault(require("path"));
var supersecretkeys_1 = require("./supersecretkeys");
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
var Chiisai = /** @class */ (function () {
    // This is basically viewDidLoad()
    function Chiisai(state) {
        var _this = this;
        this.youtube = new simple_youtube_api_1.default(supersecretkeys_1.YT_API_KEY);
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
        this.currentlyPlayingTitle = (document.getElementById('currentlyPlayingTitle'));
        this.currentlyPlayingAuthor = (document.getElementById('currentlyPlayingAuthor'));
        this.activityIndicatorLabel = (document.getElementById('activityIndicatorLabel'));
        this.tableView = document.getElementById('tableView');
        this.searchField = document.getElementById('searchField');
        this.player = document.getElementById('player');
        this._handlePlayerError = function (e) {
            console.error(e);
        };
        this._isPlaying = function (e) {
            if (e)
                _this.state.isPlaying = true;
            else
                _this.state.isPlaying = false;
        };
        // TypeScript is such a fucking wonderful language innit?
        this._searchOnSubmit = function (e) {
            e.preventDefault();
            _this.state.query = e.target.searchFieldInput.value;
            var query = _this.state.query;
            if (query.startsWith('https://www.youtube.com/watch?v=')) {
                _this._directYTURL(query);
            }
            else if (query !== '') {
                _this._searchYT(query);
            }
            else {
                // DO ABSOLUTELY FUCKING NOTHING
            }
        };
        this._searchYT = function (query) { return __awaiter(_this, void 0, void 0, function () {
            var results, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this._loadingLabel('LOADING');
                        return [4 /*yield*/, this.youtube.searchVideos(query, 10, {})];
                    case 1:
                        results = _a.sent();
                        console.log(results);
                        results.map(function (r) {
                            var node = document.createElement('tr');
                            var imageCell = document.createElement('td');
                            var seperator = document.createElement('br');
                            var cell = document.createElement('td');
                            node.setAttribute('video-id', r.id);
                            node.setAttribute('video-info', JSON.stringify(r));
                            var titleNode = document.createTextNode(r.title);
                            var authorNode = document.createTextNode(r.channel.title);
                            var imageNode = document.createElement('img');
                            imageNode.src = r.thumbnails.default.url;
                            imageNode.className = 'tableViewCellThumbnail';
                            cell.appendChild(titleNode);
                            cell.appendChild(seperator);
                            //TODO: Fix this dogshit later.
                            //cell.appendChild(authorNode);
                            imageCell.appendChild(imageNode);
                            node.appendChild(imageCell);
                            node.appendChild(cell);
                            _this.tableView.appendChild(node);
                            /*this.tableView.addEventListener('click', (e: any) => {
                              let vid = e.target.getAttribute('video-id');
                              let info = e.target.getAttribute('video-info');
                              console.log(e, vid, info);
                              return this._streamYTAudio(vid, JSON.parse(info));
                            });*/
                        });
                        // I ain't gonna bother if this somehow didn't work.
                        /*for (let i = 0; results.length > 0, i++; ) {
                          let node = document.createElement('li');
                          node.setAttribute('video-id', results[i].id);
                          let titleNode = document.createTextNode(results[i].title);
                          let authorNode = document.createTextNode(results[i].channel.title);
                          let imageNode = document.createElement('img');
                          imageNode.src = results[i].thumbnails.default.url;
                          imageNode.className = 'tableViewCellThumbnail';
                  
                          node.appendChild(titleNode);
                          node.appendChild(authorNode);
                          node.appendChild(imageNode);
                  
                          this.tableView.appendChild(node);
                        }*/
                        this._loadingLabel('');
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this._loadingLabel('');
                        console.error(error_1);
                        this._handleError(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this._directYTURL = function (url) { return __awaiter(_this, void 0, void 0, function () {
            var video, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this._loadingLabel('LOADING');
                        return [4 /*yield*/, this.youtube.getVideo(url, {})];
                    case 1:
                        video = _a.sent();
                        console.log(video);
                        this.currentlyPlayingTitle.innerText = video.title;
                        this.currentlyPlayingAuthor.innerText = video.channel.title;
                        return [2 /*return*/, this._streamYTAudio(video.id, video)];
                    case 2:
                        error_2 = _a.sent();
                        this._loadingLabel('');
                        console.error(error_2);
                        this._handleError(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.parse_str = function (str) {
            return str.split('&').reduce(function (params, param) {
                var paramSplit = param.split('=').map(function (value) {
                    return decodeURIComponent(value.replace('+', ' '));
                });
                params[paramSplit[0]] = paramSplit[1];
                return params;
            }, {});
        };
        this._streamYTAudio = function (id, info) { return __awaiter(_this, void 0, void 0, function () {
            var audio_streams_1, response, d, data, streams, error_3, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        audio_streams_1 = [];
                        return [4 /*yield*/, fetch('https://' +
                                id +
                                '-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https%3A%2F%2Fwww.youtube.com%2Fget_video_info%3Fvideo_id%3D' +
                                id)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        d = _a.sent();
                        data = this.parse_str(d), streams = (data.url_encoded_fmt_stream_map +
                            ',' +
                            data.adaptive_fmts).split(',');
                        streams.forEach(function (s, n) {
                            var stream = _this.parse_str(s), itag = stream.itag * 1, quality = '';
                            console.log(stream);
                            switch (itag) {
                                case 139:
                                    quality = '48kbps';
                                    break;
                                case 140:
                                    quality = '128kbps';
                                    break;
                                case 141:
                                    quality = '256kbps';
                                    break;
                            }
                            if (quality)
                                audio_streams_1[quality] = stream.url;
                        });
                        this.player.src = audio_streams_1['128kbps'];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.player.play()];
                    case 4:
                        _a.sent();
                        this._notify(info);
                        this._handleRPC(info);
                        this.currentlyPlayingTitle.innerText = info.title;
                        this.currentlyPlayingAuthor.innerText = info.channel.title;
                        this._loadingLabel('');
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        throw Error(error_3);
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_4 = _a.sent();
                        this._loadingLabel('');
                        this._handleError(error_4);
                        return [2 /*return*/, Error(error_4)];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        this.stopPlayer = function () {
            _this.player.src = null;
        };
        this._notify = function (info) {
            node_notifier_1.default.notify({
                title: 'Chiisai',
                message: "Now playing " + info.title,
                icon: path_1.default.join(__dirname, '../assets/Rikka.png'),
                sound: false,
                wait: false
            });
        };
        this._handleRPC = function (info) {
            // DISCORD RPC CAN GO FUCK ITSELF
            /*rpc(DISCORD_API).UpdatePresence({
              details: `Listening to ${info.title}`,
              state: 'electron-chiisai',
              startTimestamp: Number(new Date()),
              largeImageKey: 'rikka3x',
              largeImageText: 'uwu',
              instance: false
            });*/
        };
        this._loadingLabel = function (label) {
            return (_this.activityIndicatorLabel.innerText = label);
        };
        this._handleError = function (err) {
            _this.currentlyPlayingTitle.innerText = "I couldn't play it! >_<";
            _this.currentlyPlayingAuthor.innerText = "" + err;
        };
        this.state = state;
        console.log('uwu');
        this.searchField.addEventListener('submit', this._searchOnSubmit);
        this.tableView.addEventListener('click', function (e) {
            var selected = _this.tableView.getElementsByClassName('.selected');
            if (selected[0])
                selected[0].className = '';
            e.target.parentNode.className = 'selected';
            var vid = e.target.parentNode.getAttribute('video-id');
            var info = e.target.parentNode.getAttribute('video-info');
            console.log(vid, JSON.parse(info));
            return _this._streamYTAudio(vid, JSON.parse(info));
        });
        // Player listeners
        var p = this.player;
        p.addEventListener('playing', this._isPlaying);
        p.addEventListener('error', this._handlePlayerError);
        p.volume = 0.5;
    }
    return Chiisai;
}());
new Chiisai(tempstate);
//# sourceMappingURL=renderer.js.map