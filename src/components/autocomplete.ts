/**
 * TypeScript Application - Virtual DOM <input><datalist></input> wrapper component.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import DOMElement from "./element";
import { IDOMSelect } from "../interfaces";

const DEBUG: boolean = process.env && process.env.DEBUG && process.env.DEBUG === "true" ? true : false;

/**
 * @param application Application object
 * @param name Component name.
 * @param parent Virtual DOM parent node.
 * @param nodes Array with a child nodes.
 * @param element
 * @param tag Component </>
 * @param renderId Render method executions counter (debug tool)
 * @param mapStateToProps Function to map object properties from application state container.
 */
class DOMAutoComplete extends DOMElement implements IDOMSelect {
    element: HTMLSelectElement
    /**
     * @override
     * @param stdout
     */
    render (stdout: HTMLElement) {
        try {
            if (DEBUG && this.name) {
                console.log(`DOMAutoComplete(<${ this.tag } name="${ this.name }"/>).render(${ this.renderId })`);
            }
            this.renderId++;
            this.updateProps();
            const fout: HTMLElement = this.element;
            const arr: string[] = [];
            if (this.element.options && this.element.options.length) {
                for (let i = 0; i < this.element.options.length; i++) {
                    arr.push(this.element.options[i].value);
                }
            }
            if (JSON.stringify(this.props.options) !== JSON.stringify(arr) || !this.element.options) {
                if (this.element.childNodes.length) {
                    this.element.childNodes.forEach((node) => {
                        node.parentNode.removeChild(node);
                    })
                }
                const list = document.createElement("datalist");
                list.id = "datalist_images";
                Object.keys(this.props.options).forEach((option: string) => {
                    const opt: HTMLOptionElement = document.createElement("option");
                    opt.text = this.props.options[option];
                    list.appendChild(opt);
                });
                this.element.appendChild(list);
                for (let i = 0; i < list.childNodes.length; i++) {
                    // @ts-ignore
                    if (list.childNodes[i].value === this.props.selected) {
                        this.element.selectedIndex = i;
                    }
                }
                Object.keys(this.props).forEach((key: string) => {
                    if (key === "innerHTML") {
                        fout.innerHTML = this.props[key];
                    } else if (key === "className") {
                        fout.className = this.props[key];
                    } else if (this.props[key] && key !== "options" && key !== 'onChange') {
                        fout.setAttribute(key, this.props[key]);
                    }
                });
                this.element.addEventListener('change', (e) => {
                    e.preventDefault();
                    // @ts-ignore
                    e.target.blur();
                    this.props.onChange(e);
                });
                if (this.name) {
                    fout.setAttribute("name", this.name);
                }
                this.fallback(fout);
                this.output(stdout);
            }
        } catch (e) {
            console.error(`DOMAutoComplete(<${ this.tag } name="${ this.name }"/>).render(${ this.renderId }) -> ${ e.message }`);
        }
    };
}

export default DOMAutoComplete;