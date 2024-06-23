/**
 * TypeScript Application - Secondary view factory function.
 *
 * 1.0.1 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import DOMElement from "../components/element";
import App from "../app";
import { IAppState } from "../interfaces";
import DOMAutoComplete from "../components/autocomplete";
// @ts-ignore
const DEBUG: boolean = process.env && process.env.DEBUG && process.env.DEBUG == "true";

const Step1View = (app:App, parent:DOMElement) => {
    try {
        if (DEBUG) {
            app.handler.log("App.Step1View()");
        }
        const fout = new DOMElement(
            app,
            `div`,
            parent,
            "Step1View",
            null,
            {}
        );
        parent.addChild(fout);
        fout.addChild(new DOMElement(
            app,
            `label`,
            fout,
            '',
            null,
            {
                innerHTML: "Image"
            }
        ));
        fout.addChild(new DOMElement(app, `br`, fout));
        fout.addChild(new DOMAutoComplete(
            app,
            'input',
            fout,
            "image",
            (state: IAppState) => {
                return {
                    options: state.data.image.options,
                    selected: state.data.image.selected,
                };
            },
            {
                type: "text",
                list: "datalist_images",
                placeholder: "Select image",
                onChange: (event: Event) => {
                    app.setState({
                        ...app.state,
                        data: {
                            ...app.state.data,
                            image: {
                                ...app.state.data.image,
                                //@ts-ignore
                                selected: event.target.value
                            }
                        }
                    })
                }
            },
        ));
        fout.addChild(new DOMElement(app, `br`, fout));
        fout.addChild(new DOMElement(
            app,
            `input`,
            fout,
            '',
            null,
            {
                type: 'button',
                value: "Next",
                onClick: () => {
                    let flag = true;
                    if (!app.state.data.image.selected) {
                        flag = false;
                    }
                    if (flag) {
                        app.setState({
                            ...app.state,
                            step: 2
                        })
                    } else {
                        window.alert('Value required');
                    }
                }
            }
        ));
        return fout;
    } catch (e) {
        app.handler.error(`App.Step1View() -> ${ e.message }`);
    }
};

export default Step1View;
