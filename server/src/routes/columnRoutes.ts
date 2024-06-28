// import { exceptionHandler } from "@src/middlewares";
import { RouterClass } from "../classes";
import { ColumnController } from "../controllers";
export class ColumnRouter extends RouterClass {
    constructor() {
        super();
    }

    define(): void {

        this.router.get('/get-column', ColumnController.getColumns);

        this.router.post('/add-column', ColumnController.addColumn);

        this.router.put('/edit-column/:id', ColumnController.editColumn);

        this.router.delete('/delete-column/:id', ColumnController.deleteColumn);
    }
}
