import React, { useState } from 'react';

const TaskForm = ({ addTask }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        addTask(content, 'column-1'); // Default to 'To Do' column
        setContent('');
    };

    return (
        <div className="fixed bottom-4 right-4">
            <form onSubmit={handleSubmit} className="flex">
                <input
                    type="text"
                    className="rounded-l-lg p-2 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
                    placeholder="Add new task"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-8 rounded-r-lg bg-gray-200  text-sm text-gray-700 font-bold uppercase border-t border-b border-r"
                >
                    Add
                </button>
            </form>
        </div>
    );
};

export default TaskForm;
