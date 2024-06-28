import React, { useEffect, useState } from 'react';

const TaskForm = ({ addTask, editTask, columns, disabledAddTask }) => {
    const [content, setContent] = useState('');
    const [selectedColumn, setSelectedColumn] = useState();

    useEffect(() => {

        columns.length > 0 && setSelectedColumn(columns[0]._id);
    }, [columns]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!content.trim()) {
            alert('Please enter a task.');
            return;
        }
        if (!selectedColumn) {
            alert('Please select a column.');
            return;
        }

        if (editTask) {
            editTask(content, selectedColumn);
        } else {
            addTask(content, selectedColumn);
        }
        setContent('');
    };

    return (
        <div className="top-0 left-0 right-0 flex justify-center p-4">
            <form onSubmit={handleSubmit} className="flex items-center justify-center">
                <input
                    type="text"
                    className="rounded-l-lg p-2 m-2 border-t mr-0 border text-gray-800 border-gray-200 bg-white"
                    placeholder="Add new task"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <select
                    className="rounded-r-lg p-2 border text-gray-800 border-gray-200 bg-white ml-2"
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value)}
                >
                    {columns.map((column) => (
                        <option key={column._id} value={column._id}>
                            {column.title}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    className={`${!disabledAddTask ? `bg-blue-500 hover:bg-blue-700 text-white` : `bg-gray-500 text-white`}  font-bold py-1 px-4 rounded ms-4`}

                    disabled={disabledAddTask}
                >
                    {editTask ? 'Save' : 'Add'}
                </button>
            </form>
        </div>
    );
};

export default TaskForm;
