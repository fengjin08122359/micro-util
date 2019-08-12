import EventBus from "./EventBus";

export default new EventBus()

export const websocketFrame = new EventBus('websocketFrame')

export const httpFrame = new EventBus('httpFrame')