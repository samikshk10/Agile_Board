"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyRouter = void 0;
const express_1 = require("express");
const taskRoutes_1 = require("./taskRoutes");
const columnRoutes_1 = require("./columnRoutes");
class ProxyRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes = [
            {
                segment: "/tasks",
                provider: taskRoutes_1.TaskRouter,
            },
            {
                segment: "/columns",
                provider: columnRoutes_1.ColumnRouter
            }
        ];
    }
    static get() {
        if (!ProxyRouter.instance)
            ProxyRouter.instance = new ProxyRouter();
        return ProxyRouter.instance;
    }
    map() {
        this.routes.forEach((route) => {
            const instance = new route.provider();
            this.router.use(route.segment, instance.router);
        });
        return this.router;
    }
}
const proxyRouter = ProxyRouter.get();
exports.ProxyRouter = proxyRouter;
//# sourceMappingURL=index.js.map