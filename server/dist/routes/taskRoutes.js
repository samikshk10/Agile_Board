"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRouter = void 0;
// import { exceptionHandler } from "@src/middlewares";
const classes_1 = require("../classes");
const controllers_1 = require("../controllers");
class TaskRouter extends classes_1.RouterClass {
    constructor() {
        super();
    }
    define() {
        this.router.get('/get-task', controllers_1.TaskController.getTasks);
        this.router.post('/add-task', controllers_1.TaskController.addTask);
        this.router.put('/update-task/:id', controllers_1.TaskController.updateTask);
        this.router.delete('/delete-task/:id', controllers_1.TaskController.deleteTask);
        this.router.put('/edit-task/:id', controllers_1.TaskController.editTask);
    }
}
exports.TaskRouter = TaskRouter;
//# sourceMappingURL=taskRoutes.js.map