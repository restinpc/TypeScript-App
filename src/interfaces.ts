/**
 * TypeScript Application - Application interfaces.
 *
 * 1.0.1 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import DOMElement from "./components/element";
import DataSource from "./dataSource";
import ErrorHandler from "./errorHandler";

interface IAppState {
    data: {
        image: ISelect,
        dataType: ISelect,
    },
    step: number,
    loaded: boolean;
    frameId?: number;
}

interface IAction {
    data?: {
        image: ISelect,
        dataType: ISelect,
    },
    step?: number,
    loaded?: boolean;
    frameId?: number;
}

interface IApp {
    stdout: HTMLElement;
    stdin: DOMElement;
    dataSource: DataSource;
    handler: ErrorHandler;
    DOMObjects: DOMElement[];
    state: IAppState;
    renderId: number;
    preloaded: boolean;
}

interface IAppPublicState {
    getState: () => IAppState | null,
    setState: (state: IAppState) => void
}

interface IDOMSelect {
    props: {
        options: IOption[];
        selected: string;
        onChange: () => void;
    }
}

interface IView {
    name: string;
    condition: () => boolean;
    content: (app:IApp, parent:DOMElement) => DOMElement;
}

interface IDOMContainer {
    props: {
        views: IView[];
    }
}

interface IOption {
    name: string,
    value: string
}

interface ISelect {
    options: IOption[];
    selected: string;
}

export {
    IAppState,
    IAction,
    IApp,
    IAppPublicState,
    IView,
    ISelect,
    IDOMSelect,
    IOption,
    IDOMContainer
};