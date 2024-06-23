/**
 * TypeScript Application - Virtual DOM element primary component.
 *
 * 1.0.1 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import App from "../app";
import { IAppState } from "../interfaces";
// @ts-ignore
const DEBUG: boolean = process.env && process.env.DEBUG && process.env.DEBUG == "true";

/**
 * @property app Application object
 * @property name Component name.
 * @property parent Virtual DOM parent node.
 * @property nodes Array with a child nodes.
 * @property element
 * @property tag Component </>
 * @property renderId Render method executions counter (debug tool)
 * @property mapStateToProps Function to map object properties from application state container.
 */
class DOMElement {
    app: App;
    name: string;
    parent: DOMElement;
    nodes: DOMElement[];
    element: HTMLElement;
    tag: string;
    renderId: number;
    mapStateToProps: (state:IAppState) => any;
    props: any;
    defaultProps: any;
    /**
     * @constructor
     * @param app Application object.
     * @param tag Component </>
     * @param parent Virtual DOM parent node.
     * @param name Component name.
     * @param mapStateToProps Function to map object properties from application state container.
     * @param defaultProps Object with a object initial properties.
     */
    constructor(
        application: App,
        tag: string,
        parent: DOMElement = null,
        name?: string,
        mapStateToProps?: (state:IAppState) => {} | null,
        defaultProps?: {},
    ) {
        if (DEBUG && name) {
            application.handler.log(`DOMElement.constructor(<${ tag } name="${ name }"/>)`);
        }
        this.renderId = 0;
        this.name = name ? name : "";
        this.tag = tag;
        this.element = document.createElement(tag);
        // @ts-ignore
        this.element.ref = this;
        this.app = application;
        this.parent = parent;
        this.props = {};
        this.defaultProps = defaultProps;
        this.mapStateToProps = mapStateToProps;
        this.nodes = [];
        this.app.DOMObjects.push(this);
        this.updateProps();
    }

    /**
     * Method to return child node list.
     */
    getNodes() {
        return this.nodes;
    }

    /**
     * Method to update component props.
     */
    updateProps() {
        if (this.defaultProps) {
            if (this.mapStateToProps && typeof this.mapStateToProps === "function") {
                this.props = {
                    ...this.defaultProps,
                    ...this.mapStateToProps(this.app.state)
                };
            } else {
                this.props = this.defaultProps;
            }
        } else if (this.mapStateToProps && typeof this.mapStateToProps === "function") {
            this.props = {
                ...this.mapStateToProps(this.app.state)
            };
        }
        return this.props;
    }

    /**
     * Method to update child nodes while capturing.
     */
    renderNodes() {
        this.nodes.forEach((node: DOMElement, index: number) => {
            if (this.getNodes().indexOf(node) >= 0) {
                this.updateProps();
                node.render(this.element);
                if (this.element.childNodes[index]) {
                    this.element.childNodes[index].replaceWith(node.element);
                }
            } else {
                if (node.element.parentNode) {
                    node.element.parentNode.removeChild(node.element);
                }
            }
        });
    }

    /**
     * Method to output element into DOM.
     * @param stdout Parent Node.
     */
    output(stdout: HTMLElement) {
        let flag = false;
        if (stdout) {
            stdout.childNodes.forEach((node, index) => {
                // @ts-ignore
                if (node.ref === this) {
                    flag = true;
                    stdout.childNodes[index].replaceWith(this.element);
                }
            });
            if (!flag && !this.element.parentNode) {
                stdout.appendChild(this.element);
            }
        }
    }
    
    parseProps() {
        const fout: HTMLElement = this.element;
        Object.keys(this.props).forEach((key: string) => {
            if (key === "innerHTML") {
                fout.innerHTML = this.props[key];
            } else if (key === "className") {
                fout.className = this.props[key];
            } else if (key === "onClick") {
                fout.onclick = this.props[key];
            } else if (this.props[key]) {
                fout.setAttribute(key, this.props[key]);
            }
        });
        if (this.name) {
            fout.setAttribute("name", this.name);
        }
    }

    /**
     * Method to output html content to parent node.
     * @param stdout HTML Element to output.
     */
    render (stdout: HTMLElement): void {
        try {
            if (DEBUG && this.name) {
                this.app.handler.log(`DOMElement(<${ this.tag } name="${this.name}"/>).render(${ this.renderId })`);
            }
            this.renderId++;
            this.parseProps();
            this.renderNodes();
            this.output(stdout);
        } catch (e) {
            this.app.handler.error(`DOMElement(<${ this.tag } name="${this.name}"/>).render(${ this.renderId }) -> ${ e.message }`);
        }
    };

    /**
     * Method to add new node.
     * @param child Target element.
     */
    addChild (child:DOMElement): void {
        if (DEBUG && this.name && child.name) {
            this.app.handler.log(`DOMElement(${ this.name }).addChild(${ child.name })`);
        }
        this.nodes.push(child);
        if (this.getNodes().indexOf(child) >= 0) {
            this.element.appendChild(child.element);
        }
    };

    /**
     * Method to remove a child node.
     * @param child Target element.
     */
    removeChild (child:DOMElement): void {
        if (DEBUG && this.name) {
            this.app.handler.log(`DOMElement(${ this.name }).removeChild(${ child.name })`);
        }
        const arr: DOMElement[] = [];
        this.nodes.forEach((node:DOMElement) => {
            if (node !== child) {
                arr.push(node);
            }
        });
        this.nodes = arr;
        this.element.removeChild(child.element);
    };
}

export default DOMElement;