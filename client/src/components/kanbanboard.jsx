import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from 'axios';
import Column from './column';
import TaskForm from './taskform';
import { baseUrl } from './baseUrl';

const KanbanBoard = () => {
    const [columns, setColumns] = useState({
        'column-1': { id: 'column-1', title: 'To Do', taskIds: [] },
        'column-2': { id: 'column-2', title: 'In Progress', taskIds: [] },
        'column-3': { id: 'column-3', title: 'Done', taskIds: [] },
    });

    useEffect(() => {
        console.log('jere');
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/get-task`);
            const tasks = response.data;
            const newColumns = {
                'column-1': { ...columns['column-1'], taskIds: [] },
                'column-2': { ...columns['column-2'], taskIds: [] },
                'column-3': { ...columns['column-3'], taskIds: [] },
            };

            tasks.forEach((task) => {
                newColumns[task.columnId].taskIds.push(task._id);
            });

            setColumns(newColumns);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        )
            return;

        const sourceColumn = columns[source.droppableId];
        const destinationColumn = columns[destination.droppableId];

        const newSourceTaskIds = Array.from(sourceColumn.taskIds);
        newSourceTaskIds.splice(source.index, 1);

        const newDestinationTaskIds = Array.from(destinationColumn.taskIds);
        newDestinationTaskIds.splice(destination.index, 0, draggableId);

        const newColumns = {
            ...columns,
            [source.droppableId]: {
                ...sourceColumn,
                taskIds: newSourceTaskIds,
            },
            [destination.droppableId]: {
                ...destinationColumn,
                taskIds: newDestinationTaskIds,
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
            const newTaskId = response.data._id;
            const newColumns = {
                ...columns,
                [columnId]: {
                    ...columns[columnId],
                    taskIds: [...columns[columnId].taskIds, newTaskId],
                },
            };
            setColumns(newColumns);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex justify-center p-8">
                {Object.values(columns).map((column) => (
                    <Column key={column.id} column={column} />
                ))}
            </div>
            <TaskForm addTask={addTask} />
        </DragDropContext>
    );
};

export default KanbanBoard;
