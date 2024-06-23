"use strict";
/**
 * TypeScript Application - Primary data factory.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */
Object.defineProperty(exports, "__esModule", { value: true });
var DataSource = /** @class */ (function () {
    function DataSource() {
        console.log("DataSource.constructor()");
        // @ts-ignore
        this.url = process.env.API_URL;
        this.data = {};
        this.request = "";
        this.errorState = 0;
        this.domain = "";
        this.requeries = 3;
        // @ts-ignore
        this.timeout = parseInt(process.env.REQUEST_TIMEOUT) * 1000;
        // @ts-ignore
        document["dataSource"] = this;
    }
    /**
     * Primary XHR method wrapper.
     * @param url
     * @param method
     * @param body
     * @param func
     * @param strict
     * @param requery
     */
    DataSource.prototype.submitRequest = function (url, method, body, func, strict, requery) {
        var _this = this;
        if (strict === void 0) { strict = true; }
        if (requery === void 0) { requery = true; }
        return new Promise(function (callback) {
            console.log("DataSource.submitRequest(".concat(url, ", ").concat(method, ")"));
            try {
                var xhr_1 = new XMLHttpRequest();
                if (url.indexOf('http') < 0) {
                    xhr_1.open(method, _this.url + url, true);
                }
                else {
                    xhr_1.open(method, url, true);
                }
                xhr_1.timeout = _this.timeout;
                xhr_1.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                xhr_1.send(body);
                var flag_1 = false;
                xhr_1.onreadystatechange = function () {
                    if (xhr_1.readyState !== 4) {
                        return false;
                    }
                    if (!flag_1) {
                        flag_1 = true;
                        if (xhr_1.status !== 200 && xhr_1.status !== 400 && xhr_1.status !== 402) {
                            console.error("DataSource.submitRequest(url=" + url + ")" +
                                ".xhr(status=" + xhr_1.status + ") -> " + xhr_1.statusText);
                            if (strict) {
                                console.error(xhr_1.responseText);
                                throw (xhr_1.responseText);
                            }
                            else if (requery && ++_this.errorState < _this.requeries) {
                                _this.submitRequest(url, method, body, func, strict, requery).then(function () { return callback(null); });
                            }
                            else {
                                callback(false);
                            }
                        }
                        else {
                            _this.errorState = 0;
                            callback(xhr_1.responseText);
                        }
                    }
                };
            }
            catch (e) {
                if (strict) {
                    console.error("DataSource.submitRequest(url=" + url + ") -> " + e.message);
                    throw (e.message);
                }
                else if (++_this.errorState < _this.requeries) {
                    _this.submitRequest(url, method, body, func).then(function () { return callback(null); });
                }
                else {
                    callback(false);
                }
            }
        }).then(function (xhr) { return func(xhr); });
    };
    /**
     * Init method.
     */
    DataSource.prototype.init = function () {
        return new Promise(function (callback) {
            console.log("DataSource.init()");
            try {
                setTimeout(function () {
                    callback({
                        image: {
                            selected: "",
                            //@ts-ignore
                            options: ["Image 1", "Image 2"]
                        },
                        dataType: {
                            selected: "",
                            //@ts-ignore
                            options: {
                                1: "Option 1",
                                2: "Option 2"
                            }
                        },
                    });
                }, 300);
            }
            catch (e) {
                console.error("DataSource.ping() -> " + e.message);
            }
        });
    };
    /**
     * Ping method.
     */
    DataSource.prototype.ping = function () {
        var _this = this;
        return new Promise(function (callback) {
            console.log("DataSource.ping()");
            try {
                _this.submitRequest("ping", "GET", null, function (response) {
                    var data = JSON.parse(response);
                    if (data && data.payLoad) {
                        callback(data.payLoad);
                    }
                    else {
                        callback(false);
                    }
                });
            }
            catch (e) {
                console.error("DataSource.ping() -> " + e.message);
            }
        });
    };
    /**
     * POST Method.
     * @param id
     */
    DataSource.prototype.post = function (id) {
        var _this = this;
        return new Promise(function (callback) {
            console.log("DataSource.post(".concat(id, ")"));
            try {
                var data = { id: id };
                _this.submitRequest("share", "POST", JSON.stringify(data), function (response) {
                    var data = JSON.parse(response);
                    if (data && data.payLoad) {
                        callback(data.payLoad);
                    }
                    else {
                        callback(false);
                    }
                });
            }
            catch (e) {
                console.error("DataSource.post() -> " + e.message);
            }
        });
    };
    DataSource.prototype.submitTraceStack = function (text) {
        var _this = this;
        return new Promise(function (callback) {
            console.log("DataSource.submitTraceStack()");
            try {
                var appData = Promise.resolve().then(function () { return require("../package.json"); });
                // @ts-ignore
                _this.submitRequest(process.env.ERROR_HANDLER, "POST", JSON.stringify({
                    agent: navigator.userAgent,
                    // @ts-ignore
                    app: process.env.NAME,
                    // @ts-ignore
                    version: appData.version,
                    url: window.location.toString(),
                    text: text
                }), function (response) {
                    var data = JSON.parse(response);
                    return data ? true : false;
                });
            }
            catch (e) {
                console.error("DataSource.submitTraceStack() -> " + e.message);
            }
        });
    };
    return DataSource;
}());
exports.default = DataSource;
