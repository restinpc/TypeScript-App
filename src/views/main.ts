/**
 * TypeScript Application - Secondary view factory function.
 *
 * 1.0.1 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import App from "../app";
import { IAppState } from "../interfaces";
import DOMContainer from "../components/container";
import DOMElement from "../components/element";
import Step1 from "./step1";
import Step2 from "./step2";
// @ts-ignore
const DEBUG: boolean = process.env && process.env.DEBUG && process.env.DEBUG == "true";

const MainView = (app:App) => {
    try {
        if (DEBUG) {
            app.handler.log("App.MainView()");
        }
        app.stdin = new DOMElement(
            app,
            "div",
            null,
            "",
            (state:IAppState) => ({
                loaded: state.loaded
            })
        );
        app.stdin.addChild(
            new DOMElement(
                app,
                `h1`,
                app.stdin,
                "",
                null,
                {
                    className: "title",
                    innerHTML: "TypeScript Application"
                }
            )
        );
        app.stdin.addChild(
            new DOMContainer(
                app,
                'div',
                app.stdin,
                'container',
                (state:IAppState) => {
                    return {
                        views: [
                            { name: "Step1View", condition: () => (state.step === 1), content: Step1 },
                            { name: "Step2View", condition: () => (state.step === 2), content: Step2 },
                        ],
                        step: state.step
                    };
                },
                {},
            )
        );
    } catch (e) {
        app.handler.error(`App.MainView() -> ${ e.message }`);
    }
};

export default MainView;