"use strict";
/**
 * TypeScript Application - Application primary object class.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
var template_1 = require("./views/template");
var main_1 = require("./views/main");
var dataSource_1 = require("./dataSource");
// @ts-ignore
var DEBUG = process.env && process.env.DEBUG && process.env.DEBUG == "true";
/**
 * @param stdout HTML root element.
 * @param stdin Virtual DOM root component.
 * @param DOMObjects Virtual DOM objects iterable array.
 * @param state Application primary state container.
 * @param renderId
 * @param count
 */
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        /**
         * Method to update application state container
         * @param state Container
         */
        this.setState = function (state) {
            if (DEBUG) {
                console.debug("Before dispatch >> ");
                console.debug(_this.state);
                console.debug("Will dispatch >>");
                console.debug(state);
            }
            _this.state = __assign(__assign({}, _this.state), state);
            if (DEBUG) {
                console.debug("After dispatch >> ");
                console.debug(_this.state);
            }
            var tree = function (arr) {
                var flag = false;
                arr.forEach(function (el) {
                    var nodes = el.getNodes();
                    nodes.forEach(function (node) {
                        if (arr.indexOf(node) < 0) {
                            flag = true;
                            arr.push(node);
                        }
                    });
                });
                if (flag) {
                    return tree(arr);
                }
                else {
                    return arr;
                }
            };
            _this.DOMObjects.forEach(function (obj) {
                var before = JSON.stringify(obj.props);
                var after = JSON.stringify(obj.updateProps());
                if (before !== after) {
                    if (tree(_this.stdin.getNodes()).indexOf(obj) >= 0 || obj === _this.stdin) {
                        obj.render(obj.parent ? obj.parent.element : _this.stdout);
                    }
                }
            });
        };
        /**
         * Method to rebuild while Virtual DOM
         */
        this.render = function () {
            try {
                if (DEBUG) {
                    console.log("App.render(".concat(_this.renderId, ")"));
                }
                _this.renderId++;
                _this.stdin.render(_this.stdout);
            }
            catch (e) {
                console.error("App.render(".concat(_this.renderId, ") -> ").concat(e.message));
            }
        };
        /**
         * Application state container public interface.
         */
        this.document = {
            getState: function () {
                return _this.state;
            },
            setState: function (state) {
                if (DEBUG) {
                    _this.setState(state);
                }
                else {
                    console.error("This function is disabled due security reasons");
                }
            }
        };
        try {
            if (DEBUG) {
                console.log("App.constructor()");
            }
            this.renderId = 0;
            this.count = 1;
            this.DOMObjects = [];
            this.stdout = document.getElementById("app");
            this.stdout.innerHTML = template_1.default;
            this.stdout = this.stdout.getElementsByClassName("root")[0];
            this.dataSource = new dataSource_1.default();
            this.state = {
                data: {
                    image: {
                        selected: "",
                        //@ts-ignore
                        options: []
                    },
                    dataType: {
                        selected: "",
                        //@ts-ignore
                        options: []
                    }
                },
                step: 1,
                loaded: false,
                frameId: 0,
            };
            (0, main_1.default)(this);
            this.render();
            setTimeout(function () {
                _this.dataSource.init().then(function (res) {
                    var data = {};
                    Object.keys(_this.state.data).forEach(function (key) {
                        // @ts-ignore
                        data[key] = res[key] ? res[key] : _this.state.data[key];
                    });
                    _this.setState(__assign(__assign({}, _this.state), { step: 1, loaded: true, 
                        // @ts-ignore
                        data: __assign({}, data) }));
                });
            }, 300);
        }
        catch (e) {
            console.error("App.constructor() -> ".concat(e.message));
        }
    }
    return App;
}());
exports.default = App;
