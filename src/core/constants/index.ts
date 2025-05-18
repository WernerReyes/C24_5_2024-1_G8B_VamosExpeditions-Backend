import { EnvsConst } from "./env.const";

if (EnvsConst.NODE_ENV === "production") {
    import("module-alias/register")
}
export * from "./env.const";
export * from "./regex.const";
export * from "./errorCode.const";
export * from "./cache.const";
export * from "./month.const";
