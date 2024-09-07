
export class ScriptUtil {
    static dispatchEventOf(events: string[]): string {
        return events.map(name => `dispatchEvent(new Event("${name}"));`).join("\n");
    }

    static addEventListenerOf(eventType: "DOMContentLoaded" | "load", source: string): string {
        const dispatchEvents = eventType == "DOMContentLoaded"
            ? ["DOMContentLoaded"]
            : ["DOMContentLoaded", "load"];

        // Represents the event names to be dispatched as a string.
        const dispatchEventStr = dispatchEvents.map(e => `'${e}'`).join(", ");

        return `{
            let __LISTENER__;
            addEventListener("${eventType}", __LISTENER__ = function() {
                ${source}

                // Remove previous registered existing callback function.
                removeEventListener("${eventType}", __LISTENER__);

                // Since ${dispatchEventStr} has already been called, any related callback functions registered
                // afterwards may not be properly executed according to the existing document flow.
                //
                // Therefore, the event needs to be artificially triggered again.
                ${this.dispatchEventOf(dispatchEvents)}
            });
        }`;
    }
}