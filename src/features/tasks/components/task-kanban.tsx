"use client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";
import { Task, TaskStatus } from "../types";
import KanbanColumn from "./kanban-column";
import KanbanCard from "./kanban-card";

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];
type TaskState = {
  [TaskStatus.BACKLOG]: Task[];
  [TaskStatus.TODO]: Task[];
  [TaskStatus.IN_PROGRESS]: Task[];
  [TaskStatus.IN_REVIEW]: Task[];
  [TaskStatus.DONE]: Task[];
};
interface TaskKanbanProps {
  data: Task[];
  onChange: (
    // eslint-disable-next-line no-unused-vars
    value: {
      $id: string;
      status: TaskStatus;
      position: number;
    }[]
  ) => void;
}
const TaskKanban = ({ data, onChange }: TaskKanbanProps) => {
  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };
    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });
    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => a.position - b.position
      );
    });
    return initialTasks;
  });
  useEffect(() => {
    const initialTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };
    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });
    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => a.position - b.position
      );
    });
    setTasks(initialTasks);
  }, [data]);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      const sourceStatus = result.source.droppableId as TaskStatus;
      const destinationStatus = result.destination?.droppableId as TaskStatus;

      if (!destination) return;

      const updatesPayload: {
        $id: string;
        status: TaskStatus;
        position: number;
      }[] = [];

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        const tasksSource = prevTasks[sourceStatus];
        const tasksDestination = prevTasks[destinationStatus];
        const [movedTask] = tasksSource.splice(source.index, 1);
        if (!movedTask) {
          console.error("No task found at the source index");
          return prevTasks;
        }

        newTasks[sourceStatus] = tasksSource;

        const updatedMovedTask =
          source.droppableId !== destination.droppableId
            ? { ...movedTask, status: destinationStatus }
            : movedTask;

        tasksDestination.splice(destination.index, 0, updatedMovedTask);
        newTasks[destinationStatus] = tasksDestination;
        updatesPayload.push({
          $id: updatedMovedTask.$id,
          status: destinationStatus,
          position: Math.min((destination.index + 1) * 1000, 1_000_000),
        });

        newTasks[destinationStatus].forEach((task, index) => {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000);
          if (task.position !== newPosition) {
            updatesPayload.push({
              $id: task.$id,
              status: task.status,
              position: newPosition,
            });
          }
        });

        if (destinationStatus !== sourceStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: task.status,
                position: newPosition,
              });
            }
          });
        }

        return newTasks;
      });
      onChange(updatesPayload);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onchange]
  );
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => (
          <div
            key={board}
            className="flex-1 bg-muted rounded-md min-w-[200px] p-1.5 mx-2"
          >
            <KanbanColumn board={board} taskCount={tasks[board].length} />
            <Droppable droppableId={board}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px] py-1.5"
                >
                  {tasks[board].map((task, index) => (
                    <Draggable
                      key={task.$id}
                      draggableId={task.$id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <KanbanCard data={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskKanban;
