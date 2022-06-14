/**
 * TypeScript Application - Secondary view factory function.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import DOMElement from "../components/element";
import App, { IAppState } from "../app";
import DOMSelect from "../components/select";

const DEBUG: boolean = process.env && process.env.DEBUG && process.env.DEBUG === "true" ? true : false;

const Step2View = (app:App):DOMElement => {
    try {
        if (DEBUG) {
            console.log("App.Step2View()");
        }
        const fout = new DOMElement(
            app,
            `div`,
            app.stdin,
            "step2",
            null,
            {}
        );
        app.stdin.addChild(fout);
        fout.addChild(new DOMElement(
            app,
            `label`,
            fout,
            '',
            null,
            {
                innerHTML: "Data type",
            }
        ));
        fout.addChild(new DOMElement(app, `br`, fout));
        fout.addChild(new DOMSelect(
            app,
            'select',
            fout,
            "datatype",
            (state: IAppState) => {
                return {
                    options: state.data.dataType.options,
                    selected: state.data.dataType.selected,
                };
            },
            {
                required: "true",
                placeholder: "Select data type",
                onChange: (event: Event) => {
                    app.setState({
                        ...app.state,
                        data: {
                            ...app.state.data,
                            dataType: {
                                ...app.state.data.dataType,
                                //@ts-ignore
                                selected: event.target.value
                            }
                        }
                    })
                }
            },
        ));
        fout.addChild(new DOMElement(app, `br`, fout));
        fout.addChild(
            new DOMElement(
                app,
                `input`,
                fout,
                '',
                null,
                {
                    type: 'button',
                    value: "Back",
                    onClick: () => {
                        app.setState({
                            ...app.state,
                            step: 1
                        })
                    }
                }
            )
        );
        fout.addChild(
            new DOMElement(
                app,
                `input`,
                fout,
                "submit",
                (state: IAppState) => ({
                    data: state.data
                }),
                {
                    value: "Next",
                    type: "submit",
                    onClick: (e:Event) => {
                        // @ts-ignore
                        console.error(e.target.ref.props.data);
                    }
                }
            )
        );
        return fout;
    } catch (e) {
        console.error(`App.Step2View() -> ${ e.message }`);
    }
};

export default Step2View;