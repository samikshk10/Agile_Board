import React, { useEffect, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';

const Column = ({ column, deleteTask }) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);
    if (!enabled) {
        return null;
    }
    return (
        <div className="flex-none w-72 bg-gray-100 rounded-lg p-4 mr-4">
            <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
            <Droppable droppableId={column.id} type='group'>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-24"
                    >
                        {column.taskData.map((item, index) => (
                            <Task key={item._id} task={item} index={index} deleteTask={deleteTask} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;
