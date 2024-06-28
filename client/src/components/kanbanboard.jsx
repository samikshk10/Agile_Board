import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import TaskForm from './taskform'; // Adjusted import path
import { baseUrl } from './baseUrl';
import Task from './task'; // Adjusted import path
import { StrictModeDroppable } from './strictModeDropable';

const KanbanBoard = () => {
    const [columns, setColumns] = useState([]);
    const [enabled, setEnabled] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [showAddColumnInput, setShowAddColumnInput] = useState(false);
    const [editingColumnId, setEditingColumnId] = useState(null);
    const [originalColumnTitle, setOriginalColumnTitle] = useState(''); // New state variable
    const [showColumnOptions, setShowColumnOptions] = useState(null);
    const [disabledAddTask, setDisabledAddTask] = useState(false);

    const fetchColumns = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/columns/get-column`);
            const fetchedColumns = response.data.map(column => ({
                ...column,
                taskData: column.taskData || [] // Ensure taskData is initialized as an array
            }));
            setColumns(fetchedColumns);
            setEnabled(true);
        } catch (error) {
            console.error('Error fetching columns:', error);
        }
    };

    useEffect(() => {
        setDisabledAddTask(columns.length === 0);
    }, [columns]);

    useEffect(() => {
        fetchColumns();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/tasks/get-task`);
            const tasks = response.data;
            // Map tasks to their respective columns
            setColumns(prevColumns =>
                prevColumns.map(column => ({
                    ...column,
                    taskData: tasks.filter(task => task.columnId === column._id)
                }))
            );
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addColumn = async () => {
        try {
            const response = await axios.post(`${baseUrl}/api/columns/add-column`, { title: newColumnTitle });
            const newColumn = response.data;
            setColumns(prevColumns => [...prevColumns, { ...newColumn, taskData: [] }]);
            setNewColumnTitle('');
            setShowAddColumnInput(false);
        } catch (error) {
            console.error('Error adding column:', error);
        }
    };

    const addTask = async (content, columnId) => {
        try {
            const response = await axios.post(`${baseUrl}/api/tasks/add-task`, { content, columnId });
            const newTask = response.data;
            await fetchTasks(); // Fetch tasks again to update the state
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const editTask = async (taskId, content, columnId) => {
        try {
            await axios.put(`${baseUrl}/api/tasks/edit-task/${taskId}`, { content });
            await fetchTasks(); // Fetch tasks again to update the state
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const deleteTask = async (taskId, columnId) => {
        try {
            await axios.delete(`${baseUrl}/api/tasks/delete-task/${taskId}`);
            await fetchTasks(); // Fetch tasks again to update the state
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const editColumn = async (columnId, newTitle) => {
        try {
            await axios.put(`${baseUrl}/api/columns/edit-column/${columnId}`, { title: newTitle });
            setEditingColumnId(null); // Close edit mode
            setShowColumnOptions(null); // Close options menu
            await fetchColumns(); // Fetch columns again to update the state
            await fetchTasks();
        } catch (error) {
            console.error('Error editing column:', error);
        }
    };

    const deleteColumn = async (columnId) => {
        try {
            await axios.delete(`${baseUrl}/api/columns/delete-column/${columnId}`);
            await fetchColumns(); // Fetch columns again to update the state
            await fetchTasks();
        } catch (error) {
            console.error('Error deleting column:', error);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const sourceColumn = columns.find((column) => column._id === source.droppableId);
        const destinationColumn = columns.find((column) => column._id === destination.droppableId);

        const newSourceTaskData = Array.from(sourceColumn.taskData);
        const [removed] = newSourceTaskData.splice(source.index, 1);

        const newDestinationTaskData = Array.from(destinationColumn.taskData);
        newDestinationTaskData.splice(destination.index, 0, removed);

        setColumns((prevColumns) => {
            const updatedColumns = prevColumns.map((column) => {
                if (column._id === source.droppableId) {
                    return { ...column, taskData: newSourceTaskData };
                }
                if (column._id === destination.droppableId) {
                    return { ...column, taskData: newDestinationTaskData };
                }
                return column;
            });

            return updatedColumns;
        });

        try {
            await axios.put(`${baseUrl}/api/tasks/update-task/${draggableId}`, {
                columnId: destination.droppableId,
            });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            addColumn();
        }
    };

    const handleEditColumn = (columnId, newTitle) => {
        editColumn(columnId, newTitle);
    };

    const handleDeleteColumn = (columnId) => {
        deleteColumn(columnId);
    };

    const toggleColumnOptions = (columnId) => {
        setShowColumnOptions(showColumnOptions === columnId ? null : columnId);
    };

    const toggleEditColumnMode = (columnId, title) => {
        setEditingColumnId(columnId);
        setOriginalColumnTitle(title); // Store the original title
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex items-center">
                <div className="w-72 rounded-lg p-4 mr-4">
                    <TaskForm addTask={addTask} columns={columns} disabledAddTask={disabledAddTask} />
                </div>
            </div>

            {enabled && (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className='overflow-x-auto w-full  container'>


                        <div className="flex space-x-4 p-8 ">
                            {columns.map((column, columnIndex) => (
                                <StrictModeDroppable key={column._id} droppableId={column._id}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="flex-none w-72 bg-gray-100 rounded-lg p-4 mr-4"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center w-full justify-between">
                                                    {editingColumnId === column._id ? (
                                                        <input
                                                            type="text"
                                                            className="rounded-l-lg p-2 border-t mr-0 border text-gray-800 border-gray-200 bg-white"
                                                            placeholder="Enter column title"
                                                            value={column.title}
                                                            onChange={(e) =>
                                                                setColumns((prevColumns) =>
                                                                    prevColumns.map((col) =>
                                                                        col._id === column._id ? { ...col, title: e.target.value } : col
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <h2 className="text-lg font-semibold">{column.title}</h2>
                                                    )}

                                                    <div className="relative">
                                                        {editingColumnId === column._id ? (
                                                            <div className="flex">
                                                                <button
                                                                    className="text-gray-500 hover:text-gray-800 mr-2"
                                                                    onClick={() => handleEditColumn(column._id, column.title)}
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    className="text-gray-500 hover:text-gray-800"
                                                                    onClick={() => {
                                                                        setColumns((prevColumns) =>
                                                                            prevColumns.map((col) =>
                                                                                col._id === column._id ? { ...col, title: originalColumnTitle } : col
                                                                            )
                                                                        ); // Reset to original title
                                                                        setEditingColumnId(null);
                                                                        setShowColumnOptions(null);
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => toggleColumnOptions(column._id)}
                                                                className="text-gray-500 ms-5 items-center flex hover:text-gray-800"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4zM2 10a2 2 0 114 0 2 2 0 01-4 0zm14 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        )}

                                                        {showColumnOptions === column._id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border overflow-hidden z-10">
                                                                {editingColumnId !== column._id ? (
                                                                    <>
                                                                        <button
                                                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                                            onClick={() => {
                                                                                toggleEditColumnMode(column._id, column.title);
                                                                                setShowColumnOptions(null);
                                                                            }}
                                                                        >
                                                                            Edit Column
                                                                        </button>
                                                                        <button
                                                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                                            onClick={() => {
                                                                                handleDeleteColumn(column._id);
                                                                                setShowColumnOptions(null);
                                                                            }}
                                                                        >
                                                                            Delete Column
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <div className="flex justify-end px-4 py-2">
                                                                        <button
                                                                            className="text-gray-500 hover:text-gray-800 mr-2"
                                                                            onClick={() => handleEditColumn(column._id, column.title)}
                                                                        >
                                                                            Save
                                                                        </button>
                                                                        <button
                                                                            className="text-gray-500 hover:text-gray-800"
                                                                            onClick={() => {
                                                                                setColumns((prevColumns) =>
                                                                                    prevColumns.map((col) =>
                                                                                        col._id === column._id ? { ...col, title: originalColumnTitle } : col
                                                                                    )
                                                                                ); // Reset to original title
                                                                                setEditingColumnId(null);
                                                                                setShowColumnOptions(null);

                                                                            }}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="max-h-[65vh] overflow-y-auto pb-20">
                                                {column.taskData.map((task, index) => (
                                                    <Task
                                                        key={task._id}
                                                        task={task}
                                                        index={index}
                                                        deleteTask={deleteTask}
                                                        editTask={editTask}
                                                    />
                                                ))}
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </StrictModeDroppable>
                            ))}
                            {showAddColumnInput ? (
                                <div className="w-72 bg-gray-100 rounded-lg p-4 mb-4">
                                    <input
                                        type="text"
                                        className="rounded-l-lg p-2 border-t mr-0 border text-gray-800 border-gray-200 bg-white"
                                        placeholder="Enter column title"
                                        value={newColumnTitle}
                                        onChange={(e) => setNewColumnTitle(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button onClick={() => setShowAddColumnInput(false)}> Cancel</button>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-l-none rounded-r-lg"
                                        onClick={addColumn}
                                    >
                                        Add Column
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="ms-2  w-72 max-h-10 bg-gray-100 rounded-lg p-4 mb-4 flex justify-center items-center cursor-pointer"
                                    onClick={() => setShowAddColumnInput(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                </DragDropContext>
            )}
        </div>
    );
};

export default KanbanBoard;
