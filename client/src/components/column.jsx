import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';

const Column = ({ column }) => {
    return (
        <div className="flex-none w-72 bg-gray-100 rounded-lg p-4 mr-4">
            <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-24"
                    >
                        {column.taskIds.map((taskId, index) => (
                            <Task key={taskId} taskId={taskId} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;
