/**
 * TypeScript Application - Application interfaces.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

interface IDOMSelect {
    props: {
        options: IOption[];
        selected: string;
        onChange: () => void;
    }
}

interface IDOMContainer {
    props: {
        step: number;
    }
}

interface IOption {
    name: string,
    value: string
}

interface ISelect {
    options: IOption[];
    selected: string;
}

export {
    ISelect,
    IDOMSelect,
    IOption,
    IDOMContainer
};