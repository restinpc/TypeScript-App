/**
 * TypeScript Application - Virtual DOM smart container.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import DOMElement from "./element";
import { IDOMContainer } from "../interfaces";
import Step2View from "../views/step2";
import Step1View from "../views/step1";

const DEBUG: boolean = process.env && process.env.DEBUG && process.env.DEBUG === "true" ? true : false;

/**
 * @property application Application object
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
    step1: DOMElement;
    step2: DOMElement;
    /**
     * @override
     */
    getNodes(): DOMElement[] {
        const arr: DOMElement[] = [];
        this.nodes.forEach((node: DOMElement) => {
            if (node.name.indexOf('step') < 0 || node.name === `step${this.props.step}`) {
                arr.push(node);
            }
        });
        return arr;
    }

    /**
     * @override
     * @param stdout
     */
    render(stdout: HTMLElement) {
        try {
            if (DEBUG && this.name) {
                console.log(`DOMContainer(<${this.tag} name="${this.name}"/>).render(${this.renderId})`);
            }
            this.renderId++;
            this.updateProps();
            if (this.props.step === 1 && !this.step1) {
                this.step1 = Step1View(this.application);
            } else if (this.props.step === 2 && !this.step2) {
                this.step2 = Step2View(this.application);
            }
            if (this.props.loaded) {
                super.render(stdout);
            } else {
                this.element.innerHTML = '<div id="loading">Loading..</div>';
                this.output(stdout);
            }
        } catch (e) {
            console.error(`DOMContainer(<${ this.tag } name="${this.name}"/>).render(${ this.renderId }) -> ${ e.message }`);
        }
    }
}

export default DOMContainer;