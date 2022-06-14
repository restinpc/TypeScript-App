/**
 * TypeScript Application - Application primary object class.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import dataSource from "./dataSource";
import DOMElement from "./components/element";
import Template from "./views/template";
import { ISelect } from "./interfaces";
import MainView from "./views/main";
import DataSource from "./dataSource";

const DEBUG: boolean = process.env && process.env.DEBUG && process.env.DEBUG === "true" ? true : false;

interface IAppState {
    data: {
        image: ISelect,
        dataType: ISelect,
    },
    step: number,
    loaded: boolean;
    frameId?: number;
}

interface IApp {
    stdout: HTMLElement;
    stdin: DOMElement;
    DOMObjects: DOMElement[];
    state: IAppState;
    renderId: number;
    count: number
}

interface IAppPublicState {
    getState: () => IAppState | null,
    setState: (state: IAppState) => void
}

/**
 * @param stdout HTML root element.
 * @param stdin Virtual DOM root component.
 * @param DOMObjects Virtual DOM objects iterable array.
 * @param state Application primary state container.
 * @param renderId
 * @param count
 */
class App implements IApp {
    stdout: HTMLElement;
    stdin: DOMElement;
    dataSource: dataSource;
    DOMObjects: DOMElement[];
    state: IAppState;
    renderId: number;
    count: number;
    constructor() {
        try {
            if (DEBUG) {
                console.log("App.constructor()");
            }
            this.renderId = 0;
            this.count = 1;
            this.DOMObjects = [];
            this.stdout = document.getElementById("app");
            this.stdout.innerHTML = Template;
            this.stdout = this.stdout.getElementsByClassName("root")[0] as HTMLElement;
            this.dataSource = new DataSource();
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
            MainView(this);
            this.render();
            setTimeout(() => {
                this.dataSource.init().then((res) => {
                    const data = {};
                    Object.keys(this.state.data).forEach((key) => {
                        // @ts-ignore
                        data[key] = res[key] ? res[key] : this.state.data[key]
                    })
                    this.setState({
                        ...this.state,
                        step: 1,
                        loaded: true,
                        // @ts-ignore
                        data: {
                            ...data
                        }
                    })
                });
            }, 300);
        } catch (e) {
            console.error(`App.constructor() -> ${ e.message }`);
        }
    }

    /**
     * Method to update application state container
     * @param state Container
     */
    setState = (state: IAppState): void => {
        if (DEBUG) {
            console.debug("Before dispatch >> ");
            console.debug(this.state);
            console.debug("Will dispatch >>");
            console.debug(state);
        }
        this.state = {
            ...this.state,
            ...state
        }
        if (DEBUG) {
            console.debug("After dispatch >> ");
            console.debug(this.state);
        }
        const tree = (arr:DOMElement[]):DOMElement[] => {
            let flag = false;
            arr.forEach((el:DOMElement) => {
                const nodes = el.getNodes();
                nodes.forEach(node => {
                    if (arr.indexOf(node) < 0) {
                        flag = true;
                        arr.push(node);
                    }
                })
            });
            if (flag) {
                return tree(arr);
            } else {
                return arr;
            }
        }
        this.DOMObjects.forEach((obj:DOMElement) => {
            let before = JSON.stringify(obj.props);
            let after = JSON.stringify(obj.updateProps());
            if (before !== after) {
                if (tree(this.stdin.getNodes()).indexOf(obj) >= 0 || obj === this.stdin) {
                    obj.render(obj.parent ? obj.parent.element : this.stdout);
                }
            }
        });
    };

    /**
     * Method to rebuild while Virtual DOM
     */
    render = (): void => {
        try {
            if (DEBUG) {
                console.log(`App.render(${ this.renderId })`);
            }
            this.renderId++;
            this.stdin.render(this.stdout);
        } catch (e) {
            console.error(`App.render(${ this.renderId }) -> ${ e.message }`);
        }
    };

    /**
     * Application state container public interface.
     */
    document: IAppPublicState = {
        getState: (): IAppState => {
            return this.state;
        },
        setState: (state:IAppState): void => {
            if (DEBUG) {
                this.setState(state);
            } else {
                console.error("This function is disabled due security reasons");
            }
        }
    };
}

export {
    App as default,
    IApp,
    IAppPublicState,
    IAppState
};
