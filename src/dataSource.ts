/**
 * TypeScript Application - Primary data factory.
 *
 * 1.0.1 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */
 
 import { IApp } from "./interfaces";

export default class DataSource {
    url: string;
    data: any;
    request: string;
    errorState: number;
    requeries: number;
    timeout: number;
    domain: string;
    app: IApp;
    constructor(app) {
        this.app = app;
        this.app.handler.log("DataSource.constructor()");
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
    submitRequest(
        url: string,
        method: string,
        body: any,
        func: (func: any) => void,
        strict: boolean = true,
        requery: boolean = true
    ): Promise<string | void> {
        return new Promise((callback) => {
            this.app.handler.log(`DataSource.submitRequest(${url}, ${method})`);
            try {
                let xhr = new XMLHttpRequest();
                if (url.indexOf('http') < 0) {
                    xhr.open(method, this.url + url, true);
                } else {
                    xhr.open(method, url, true);
                }
                xhr.timeout = this.timeout;
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                xhr.send(body);
                let flag = false;
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== 4) {
                        return false;
                    }
                    if (!flag) {
                        flag = true;
                        if (xhr.status !== 200 && xhr.status !== 400 && xhr.status !== 402) {
                            this.app.handler.error(
                                "DataSource.submitRequest(url=" + url + ")" +
                                ".xhr(status=" + xhr.status + ") -> " + xhr.statusText
                            );
                            if (strict) {
                                this.app.handler.error(xhr.responseText);
                                throw(xhr.responseText);
                            } else if (requery && ++this.errorState < this.requeries) {
                                this.submitRequest(url, method, body, func, strict, requery).then(() => callback(null));
                            } else {
                                callback(false);
                            }
                        } else {
                            this.errorState = 0;
                            callback(xhr.responseText);
                        }
                    }
                };
            } catch (e) {
                if (strict) {
                    this.app.handler.error("DataSource.submitRequest(url=" + url + ") -> " + e.message);
                    throw(e.message);
                } else if (++this.errorState < this.requeries) {
                    this.submitRequest(url, method, body, func).then(() => callback(null));
                } else {
                    callback(false);
                }
            }
        }).then(xhr => func(xhr));
    }

    /**
     * Init method.
     */
    init(): Promise<{}> {
        return new Promise((callback) => {
            this.app.handler.log("DataSource.init()");
            try {
                setTimeout(() => {
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
                    })
                }, 300);
            } catch (e) {
                this.app.handler.error("DataSource.ping() -> " + e.message);
            }
        });
    }

    /**
     * Ping method.
     */
    ping(): Promise<string | boolean> {
        return new Promise((callback) => {
            this.app.handler.log("DataSource.ping()");
            try {
                this.submitRequest("ping", "GET", null, (response) => {
                    const data = JSON.parse(response);
                    if (data && data.payLoad) {
                        callback(data.payLoad);
                    } else {
                        callback(false);
                    }
                });
            } catch (e) {
                this.app.handler.error("DataSource.ping() -> " + e.message);
            }
        });
    }

    /**
     * POST Method.
     * @param id
     */
    post(id:number): Promise<string | boolean> {
        return new Promise((callback) => {
            this.app.handler.log(`DataSource.post(${id})`);
            try {
                const data = { id };
                this.submitRequest("share", "POST", JSON.stringify(data), (response) => {
                    const data = JSON.parse(response);
                    if (data && data.payLoad) {
                        callback(data.payLoad);
                    } else {
                        callback(false);
                    }
                });
            } catch (e) {
                this.app.handler.error("DataSource.post() -> " + e.message);
            }
        });
    }
    
    submitTraceStack(text:string): Promise<boolean> {
        return new Promise((callback) => {
            this.app.handler.log(`DataSource.submitTraceStack()`);
            try {
                const appData = import("../package.json");
                // @ts-ignore
                this.submitRequest(process.env.ERROR_HANDLER, "POST", JSON.stringify({
                    agent: navigator.userAgent,
                    // @ts-ignore
                    app: process.env.NAME,
                    // @ts-ignore
                    version: appData.version,
                    url: window.location.toString(),
                    text: text
                }), (response) => {
                    const data = JSON.parse(response);
                    return data ? true : false;
                });
            } catch (e) {
                this.app.handler.error("DataSource.submitTraceStack() -> " + e.message);
            }
        });
    }
}