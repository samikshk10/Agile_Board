import React, { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index, deleteTask, editTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState(task.content);
    const [showOptions, setShowOptions] = useState(false);

    const [enabled, setEnabled] = useState(false);

    const animation = requestAnimationFrame(() => setEnabled(true));
    useEffect(() => {

        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    if (!enabled) {
        return null;
    }

    const handleEdit = async () => {
        try {
            await editTask(task._id, newContent, task.columnId);
            setIsEditing(false);
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const handleCancelEdit = () => {
        setNewContent(task.content);
        setIsEditing(false);
    };

    const handleOptionClick = (action) => {
        setShowOptions(false);
        if (action === 'edit') {
            setIsEditing(true);
        } else if (action === 'delete') {
            deleteTask(task._id, task.columnId);
        }
    };

    return (
        <Draggable draggableId={task._id.toString()} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-4 mb-2 rounded shadow relative"
                >
                    {isEditing ? (
                        <div className="flex justify-between items-center">
                            <input
                                type="text"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                className="border-b-2 border-gray-200 w-full py-2"
                            />
                            <div>
                                <button
                                    onClick={handleEdit}
                                    className="text-gray-500 hover:text-gray-800 mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-red-500 hover:text-gray-800 "
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center gap-4">
                            <div>
                                <p>{task.content}</p>
                            </div>
                            <div className="relative ">
                                <button
                                    onClick={() => setShowOptions(!showOptions)}
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4zM2 10a2 2 0 114 0 2 2 0 01-4 0zm14 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <div >

                                    {showOptions && (
                                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-[999] ">
                                            <button
                                                onClick={() => handleOptionClick('edit')}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleOptionClick('delete')}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default Task;
