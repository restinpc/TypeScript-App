/**
 * TypeScript Application - Error handler
 *
 * 1.0.1 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */
 
import { IApp } from "./interfaces";
// @ts-ignore
const DEBUG: boolean = process.env && process.env.DEBUG && process.env.DEBUG == "true";
 
class ErrorHandler {
    app: IApp;
    errorState:boolean;
    traceStack:string[];
        
    constructor(app:IApp) {
        this.app = app;
        this.errorState = false;
        this.traceStack = [];
    }
    
    log(text):void {
        // @ts-ignore
        text = `${process.env.PREFIX}.${typeof(text) === "string" ? text : JSON.stringify(text)}`;
        this.traceStack.push(`${new Date().toLocaleString()} log ${text}`);
        if (DEBUG){
            console.log(text);
        }
    }
    
    info(text):void {
        // @ts-ignore
        text = `${process.env.PREFIX}.${typeof(text) === "string" ? text : JSON.stringify(text)}`;
        this.traceStack.push(`${new Date().toLocaleString()} info ${text}`);
        if (DEBUG){
            console.info(text);
        }
    }
    
    warn(text):void {
        // @ts-ignore
        text = `${process.env.PREFIX}.${typeof(text) === "string" ? text : JSON.stringify(text)}`;
        this.traceStack.push(`${new Date().toLocaleString()} warn ${text}`);
        if (DEBUG){
            console.warn(text);
        }
    }
    
    debug(text):void {
        // @ts-ignore
        text = `${process.env.PREFIX}.${typeof(text) === "string" ? text : JSON.stringify(text)}`;
        this.traceStack.push(`${new Date().toLocaleString()} debug ${text}`);
        if (DEBUG){
            console.debug(text);
        }
    }
    
    error(text):void {
        // @ts-ignore
        text = `${process.env.PREFIX}.${typeof(text) === "string" ? text : JSON.stringify(text)}`;
        this.traceStack.push(`${new Date().toLocaleString()} error ${text}`);
        if (DEBUG){
            console.error(text);
        }
    }
    
    throw(text):void {
        // @ts-ignore
        text = `${process.env.PREFIX}.${typeof(text) === "string" ? text : JSON.stringify(text)}`;
        this.traceStack.push(`${new Date().toLocaleString()} throw ${text}`);
        if (DEBUG){
            console.error(text);
        }
        this.bsod();
        this.submit();
    }
    
    bsod():void {
        const target = this.app.stdout;
        target.style.position = "fixed";
        target.style.top = "0px";
        target.style.left = "0px";
        target.style.right = "0px";
        target.style.bottom = "0px";
        target.style.display = "block";
        target.style.opacity = "1";
        // @ts-ignore
        target.innerHTML = `Расширение ${process.env.PREFIX} было остановленно из-за непредвиденного исключения`;
        target.style.backgroundPosition = "center center";
        target.style.backgroundSize = "cover";
    }
    
    submit():Promise<boolean> {
        return new Promise((callback) => {
            if (!this.errorState) {
                this.errorState = true;
                let fout = "";
                if (this.traceStack.length <= 200) {
                    this.traceStack.forEach((item) => {
                        fout += item.toString().substring(0, 1000) + "<br/>"; 
                    });
                } else {
                    for (let i = 0; i < 100; i++) {
                        fout += this.traceStack[i].toString().substring(0, 1000) + "<br/>";
                    }
                    fout += `Пропущено ${this.traceStack.length - 200} строк<br/><hr/><br/>`;
                    for (let i = this.traceStack.length - 100; i < this.traceStack.length - 1; i++) {
                        fout += this.traceStack[i].toString().substring(0, 1000) + "<br/>";
                    }
                }
                this.app.dataSource.submitTraceStack(fout).then((res) => {
                    callback(res);
                });
            }
        });
    }
}

export default ErrorHandler;
