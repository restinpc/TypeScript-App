/**
 * TypeScript Application - Secondary view factory function.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import App, { IAppState } from "../app";
import DOMContainer from "../components/container";
import DOMElement from "../components/element";

const DEBUG: boolean = process.env && process.env.DEBUG && process.env.DEBUG === "true" ? true : false;

const MainView = (app:App) => {
    try {
        if (DEBUG) {
            console.log("App.MainView()");
        }
        app.stdin = new DOMContainer(
            app,
            'div',
            null,
            'container',
            (state:IAppState) => {
                return {
                    frameId: state.frameId,
                    step: state.step,
                    loaded: state.loaded
                };
            },
            {},
        );
        app.stdin.addChild(new DOMElement(
            app,
            `h1`,
            app.stdin,
            "",
            null,
            {
                className: "title",
                innerHTML: "TypeScript Application"
            }
        ));
    } catch (e) {
        console.error(`App.MainView() -> ${ e.message }`);
    }
};

export default MainView;