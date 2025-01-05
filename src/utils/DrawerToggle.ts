interface Props {
    drawerClass: string;
    triggerClasses: string[];
}

export default class DrawerToggler {
    drawer: HTMLElement | null;
    triggers: Element[];
    openClass: string = "menu-drawer-open";

    constructor({ drawerClass, triggerClasses }: Props) {
        // Get drawer
        this.drawer = document.querySelector(`.${drawerClass}`);
        // Get triggers, and filter not found elements
        this.triggers = triggerClasses
            .map((triggerClass) => document.querySelector(`.${triggerClass}`))
            .filter((triggerElement) => triggerElement !== null);

        if (this.triggers.length > 0) {
            this.setupListeners();
        } else {
            throw Error("Triggers not found");
        }
    }

    // Lister for trigger clicks
    setupListeners(): void {
        this.triggers.forEach((el) => {
            el.addEventListener("click", () => this.toggleDrawer());
        });
    }

    // Add or remove open drawer class
    toggleDrawer(): void {
        if (!this.drawer) return;

        if (this.drawer.classList.contains(this.openClass)) {
            // Is already open
            this.drawer.classList.remove(this.openClass);
        } else {
            // Is closed
            this.drawer.classList.add(this.openClass);
        }
    }
}
