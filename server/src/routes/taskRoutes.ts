// import { exceptionHandler } from "@src/middlewares";
import { RouterClass } from "../classes";
import { TaskController } from "../controllers";
export class TaskRouter extends RouterClass {
    constructor() {
        super();
    }

    define(): void {

        this.router.get('/get-task', TaskController.getTasks);
        this.router.post('/add-task', TaskController.addTask);
        this.router.put('/update-task/:id', TaskController.updateTask);
        this.router.delete('/delete-task/:id', TaskController.deleteTask);
        this.router.put('/edit-task/:id', TaskController.editTask);
    }
}
