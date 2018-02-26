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
var _ = __importStar(require("lodash"));
var net = __importStar(require("net"));
var Log_1 = __importDefault(require("./Log"));
var Mapping_1 = __importDefault(require("./Mapping"));
var TcpClient_1 = __importDefault(require("./TcpClient"));
var ReproxyServer = /** @class */ (function () {
    function ReproxyServer() {
        var _this = this;
        this.mappingList = [];
        this.add = function (from, to) {
            Log_1.default.info("mapping from " + from + " to " + to + " added");
            _this.mappingList.push(new Mapping_1.default(from, to));
        };
        this.startHttp = function () {
            var httpServer = new net.Server(_this.onConnect);
            httpServer.on("error", _this.onError);
            httpServer.listen(80);
            Log_1.default.info("http server started");
        };
        this.startHttps = function () {
            var httpsServer = new net.Server(_this.onConnect);
            httpsServer.on("error", _this.onError);
            httpsServer.listen(443);
            Log_1.default.info("https server started");
        };
        this.startAll = function () {
            _this.startHttp();
            _this.startHttps();
        };
        this.onConnect = function (socket) {
            var item = _.find(_this.mappingList, { from: socket.localAddress });
            if (!item) {
                Log_1.default.info("no host found for address " + socket.localAddress);
                socket.end();
                return;
            }
            new TcpClient_1.default(socket, item.to).start();
        };
        this.onError = function (err) {
            Log_1.default.info(err);
        };
        // add config
    }
    return ReproxyServer;
}());
exports.default = ReproxyServer;
