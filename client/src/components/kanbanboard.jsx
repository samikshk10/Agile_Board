import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from 'axios';
import Column from './column';
import TaskForm from './taskform';
import { baseUrl } from './baseUrl';

const KanbanBoard = () => {
    const [columns, setColumns] = useState({
        'column-1': { id: 'column-1', title: 'To Do', taskData: [] },
        'column-2': { id: 'column-2', title: 'In Progress', taskData: [] },
        'column-3': { id: 'column-3', title: 'Done', taskData: [] },
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/get-task`);
            const tasks = response.data;

            const newColumns = {
                'column-1': { ...columns['column-1'], taskData: [] },
                'column-2': { ...columns['column-2'], taskData: [] },
                'column-3': { ...columns['column-3'], taskData: [] },
            };

            tasks.forEach((task) => {
                if (newColumns[task.columnId]) {
                    newColumns[task.columnId].taskData.push(task);
                }
            });

            setColumns(newColumns);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const sourceColumn = columns[source.droppableId];
        const destinationColumn = columns[destination.droppableId];

        const newSourceTaskData = Array.from(sourceColumn.taskData);
        const [removed] = newSourceTaskData.splice(source.index, 1);

        const newDestinationTaskData = Array.from(destinationColumn.taskData);
        newDestinationTaskData.splice(destination.index, 0, removed);

        const newColumns = {
            ...columns,
            [source.droppableId]: {
                ...sourceColumn,
                taskData: newSourceTaskData,
            },
            [destination.droppableId]: {
                ...destinationColumn,
                taskData: newDestinationTaskData,
            },
        };

        setColumns(newColumns);

        try {
            await axios.put(`${baseUrl}/api/tasks/${draggableId}`, {
                columnId: destination.droppableId,
            });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const addTask = async (content, columnId) => {
        try {
            const response = await axios.post(`${baseUrl}/api/addtask`, { content, columnId });
            const newTask = response.data;

            setColumns(prevColumns => ({
                ...prevColumns,
                [columnId]: {
                    ...prevColumns[columnId],
                    taskData: [...prevColumns[columnId].taskData, newTask],
                },
            }));
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const deleteTask = async (taskId, columnId) => {
        try {
            await axios.delete(`${baseUrl}/api/delete-task/${taskId}`);

            setColumns(prevColumns => {
                const newTaskData = prevColumns[columnId]?.taskData.filter(task => task._id !== taskId);
                return {
                    ...prevColumns,
                    [columnId]: {
                        ...prevColumns[columnId],
                        taskData: newTaskData,
                    },
                };
            });
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex justify-center p-8">
                {Object.values(columns).map((column) => (
                    <Column key={column.id} column={column} deleteTask={deleteTask} />
                ))}
            </div>
            <TaskForm addTask={addTask} />
        </DragDropContext>
    );
};

export default KanbanBoard;
