/**
 * TypeScript Application - Virtual DOM smart container.
 *
 * 1.0.1 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import App from "../app";
import DOMElement from "./element";
import {
    IAppState,
    IDOMContainer,
    IView
} from "../interfaces";
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
 * @property step Current form step (1/2)
 */
class DOMContainer extends DOMElement implements IDOMContainer {
    element: HTMLDivElement;
    loaded: boolean;
    childNodes: { [key: string]: DOMElement }
    /**
     * @constructor
     * @overrider
     */
     constructor(
        application: App,
        tag: string,
        parent: DOMElement = null,
        name?: string,
        mapStateToProps?: (state:IAppState) => {} | null,
        defaultProps?: {},
    ) {
        // @ts-ignore
        super(...arguments);
        this.childNodes = {};
        this.loaded = false;
    }
    
    /**
     * @override
     */
    getNodes(): DOMElement[] {
        const nodes: DOMElement[] = [];
        this.props.views.forEach((view:IView) => {
            if (view.condition) {
                this.nodes.forEach((node:DOMElement) => {
                    if (node.name === view.name) {
                        nodes.push(node);
                    }
                });
            }
        });
        return nodes;
    }
    
    parseProps() {
        super.parseProps();
        if (this.props.views && this.props.views.length) {
            let arr:IView[] = [];
            this.props.views.forEach((view:IView) => {
                if (view.condition()) {
                    arr.push(view);
                }
            });
            let flag;
            do {
                flag = false;
                for (let i = this.nodes.length - 1; i >= 0; i--) {
                    let flag = false;
                    arr.forEach((el:IView) => {
                        if (this.nodes[i] && el.name === this.nodes[i].name) {
                            flag = true;
                        }
                    });
                    if (!flag) {
                        this.removeChild(this.nodes[i]);
                        flag = true;
                        break;
                    }
                }
            } while(flag);
            arr.forEach((view:IView) => {
                if (!this.childNodes || !this.childNodes[view.name]) {
                    this.childNodes[view.name] = view.content(this.app, this);
                } else {
                    this.addChild(this.childNodes[view.name]);
                }
            });
        }
    }
    
    render(stdout:HTMLElement) {
        try {
            if (DEBUG && this.name) {
                this.app.handler.log(`DOMElement(<${ this.tag } name="${this.name}"/>).render(${ this.renderId })`);
            }
            super.render(stdout);
        } catch (e) {
            this.app.handler.throw(`DOMContainer(<${this.tag} name="${this.name}"/>).render(${this.renderId}) -> ${e.message}`)
        }
    }
}

export default DOMContainer;