import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { baseUrl } from './baseUrl';

const Task = ({ task, index }) => {
    const deleteTask = async () => {
        try {
            await axios.delete(`${baseUrl}/api/tasks/${task._id}`);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="bg-white p-4 mb-2 rounded shadow"
                >
                    <div className="flex justify-between">
                        <div>{task}</div>
                        <button
                            className="text-red-500"
                            onClick={deleteTask}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Task;
