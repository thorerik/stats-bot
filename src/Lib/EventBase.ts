import { Application } from "../Lib/Application";

export class EventBase {
    public subscribe = "message";

    protected app: Application;

    constructor() {
        this.app = Application.getInstance();
    }
}
