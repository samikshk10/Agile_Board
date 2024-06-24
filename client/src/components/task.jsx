import axios from 'axios';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { baseUrl } from './baseUrl';

const Task = ({ task, index, deleteTask }) => {
    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-4 mb-2 rounded shadow"
                >
                    <div className="flex justify-between">
                        <div>{task.content}</div>
                        <button className="text-red-500" onClick={() => deleteTask(task._id, task.columnId)}>
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Task;
