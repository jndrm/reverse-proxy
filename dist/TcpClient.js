"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var net = __importStar(require("net"));
var Log_1 = __importDefault(require("./Log"));
var TcpClient = /** @class */ (function () {
    function TcpClient(socket, host) {
        var _this = this;
        this.start = function () {
            var options = {
                family: 4,
                host: _this.host,
                port: _this.remoteSocket.localPort,
            };
            _this.localSocket.connect(options, _this.onConnect);
        };
        this.onTimeout = function () {
            Log_1.default.info("timeout");
            _this.stop();
        };
        this.onError = function (err) {
            Log_1.default.info(err);
            _this.stop();
        };
        this.onClose = function () {
            _this.stop();
        };
        this.stop = function () {
            if (_this.remoteSocket) {
                _this.remoteSocket.end();
                _this.remoteSocket.destroy();
                _this.remoteSocket = undefined;
            }
            if (_this.localSocket) {
                _this.localSocket.end();
                _this.localSocket.destroy();
                _this.localSocket = undefined;
            }
        };
        this.onConnect = function () {
            _this.remoteSocket.resume();
        };
        this.remoteSocket = socket;
        this.remoteSocket.pause();
        this.host = host;
        this.localSocket = new net.Socket();
        this.remoteSocket.pipe(this.localSocket);
        this.localSocket.pipe(this.remoteSocket);
        this.remoteSocket.on("error", this.onError);
        this.remoteSocket.on("close", this.onClose);
        this.localSocket.on("timeout", this.onTimeout);
        this.localSocket.on("error", this.onError);
        this.localSocket.on("close", this.onClose);
    }
    return TcpClient;
}());
exports.default = TcpClient;
