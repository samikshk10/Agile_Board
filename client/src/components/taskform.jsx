import React, { useState } from 'react';

const TaskForm = ({ addTask, columns }) => {
    const [content, setContent] = useState('');
    const [selectedColumn, setSelectedColumn] = useState(columns[0]?.id || ''); // Default to the first column ID

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        addTask(content, selectedColumn);
        setContent('');
    };

    return (
        <div className=" top-0 left-0 right-0 flex justify-center p-4">
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
                    {columns.map(column => (
                        <option key={column.id} value={column.id}>{column.title}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded ms-4"
                >
                    Add
                </button>
            </form>
        </div>
    );
};

export default TaskForm;
