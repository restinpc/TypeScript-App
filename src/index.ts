/**
 * TypeScript Application - Application index.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import App, { IApp } from "./app";

window.addEventListener("load", () => {
    console.log("Application is loading...");
    const app: IApp = new App();
    // @ts-ignore
    document["application"] = app.document;
    console.log("Application is started!");
});