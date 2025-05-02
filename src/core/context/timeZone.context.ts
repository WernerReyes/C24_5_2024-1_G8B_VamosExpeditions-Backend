
import { AsyncLocalStorage } from "async_hooks";

type ContextStore = {
  timeZone?: string;
};

export class TimeZoneContext {
  private static instance: TimeZoneContext;
  private storage = new AsyncLocalStorage<ContextStore>();

  private constructor() {}

  static getInstance(): TimeZoneContext {
    if (!TimeZoneContext.instance) {
      TimeZoneContext.instance = new TimeZoneContext();
    }
    return TimeZoneContext.instance;
  }

  run<T>(store: ContextStore, callback: () => T) {
    return this.storage.run(store, callback);
  }

  get getTimeZone(): string {
    return this.storage.getStore()?.timeZone || "UTC";
  }

  set setTimeZone(timeZone: string) {
    const store = this.storage.getStore();
    if (store) {
      store.timeZone = timeZone;
    }
  }
}
