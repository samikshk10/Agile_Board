"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnRouter = void 0;
// import { exceptionHandler } from "@src/middlewares";
const classes_1 = require("../classes");
const controllers_1 = require("../controllers");
class ColumnRouter extends classes_1.RouterClass {
    constructor() {
        super();
    }
    define() {
        this.router.get('/get-column', controllers_1.ColumnController.getColumns);
        this.router.post('/add-column', controllers_1.ColumnController.addColumn);
        this.router.put('/edit-column/:id', controllers_1.ColumnController.editColumn);
        this.router.delete('/delete-column/:id', controllers_1.ColumnController.deleteColumn);
    }
}
exports.ColumnRouter = ColumnRouter;
//# sourceMappingURL=columnRoutes.js.map