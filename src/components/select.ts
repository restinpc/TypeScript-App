/**
 * TypeScript Application - Virtual DOM <select> wrapper component.
 *
 * 1.0.1 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import DOMElement from "./element";
import { IDOMSelect, IOption } from "../interfaces";
// @ts-ignore
const DEBUG: boolean = process.env && process.env.DEBUG && process.env.DEBUG == "true";

/**
 * @param app Application object.
 * @param tag Component </>
 * @param parent Virtual DOM parent node.
 * @param name Component name.
 * @param mapStateToProps Function to map object properties from application state container.
 * @param defaultProps Object with a object initial properties.
 */
class DOMSelect extends DOMElement implements IDOMSelect {
    element: HTMLSelectElement;
    loaded: boolean;
    
    /**
     * @override
     */
    parseProps() {
        let flag = false;
        if (this.element.options && this.element.options.length) {
            for (let i = 0; i < this.element.options.length; i++) {
                this.element.remove(i)
                flag = true;
            }
        }
        const options: IOption[] = this.props.options ? this.props.options : [];
        if (!this.props.selected && this.props.placeholder) {
            const opt: HTMLOptionElement = document.createElement("option");
            opt.text = this.props.placeholder;
            opt.selected = true;
            opt.disabled = true;
            this.element.add(opt, null);
        }
        Object.keys(options).forEach((option: string) => {
            const opt: HTMLOptionElement = document.createElement("option");
            // @ts-ignore
            opt.text = options[option];
            opt.value = option;
            this.element.add(opt, null);
        });
        if (flag) {
            this.element.remove(0);
        }
        if (this.element.options && this.element.options.length) {
            for (let i = 0; i < this.element.options.length; i++) {
                if (this.element.options[i].value === this.props.selected) {
                    this.element.selectedIndex = i;
                }
            }
        }
        Object.keys(this.props).forEach((key: string) => {
            if (key === "innerHTML") {
                this.element.innerHTML = this.props[key];
            } else if (key === "className") {
                this.element.className = this.props[key];
            } else if (this.props[key] && key !== "options" && key !== 'onChange') {
                this.element.setAttribute(key, this.props[key]);
            }
        });
    }
    
    /**
     * @override
     * @param stdout
     */
    render(stdout: HTMLElement) {
        try {
            if (DEBUG && this.name) {
                this.app.handler.log(`DOMSelect(<${ this.tag } name="${this.name}"/>).render(${ this.renderId })`);
            }
            this.renderId++;
            if (!this.loaded) {
                this.element.setAttribute("name", this.name);
                this.element.addEventListener('change', this.props.onChange);
                this.loaded = true;
            }
            const arr: string[] = [];
            if (this.element.options && this.element.options.length) {
                for (let i = 1; i < this.element.options.length; i++) {
                    arr.push(this.element.options[i].value);
                }
            }
            if (JSON.stringify(Object.values(this.props.options)) !== JSON.stringify(arr)) {
                this.parseProps();
                this.renderNodes();
                this.output(this.element);
            }
        } catch (e) {
            this.app.handler.error(`DOMSelect(<${ this.tag } name="${this.name}"/>).render(${ this.renderId }) -> ${ e.message }`);
        }
    };
}

export { DOMSelect as default };