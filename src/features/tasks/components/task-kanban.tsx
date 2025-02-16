"use client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  // type DropResult,
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
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
}
const TaskKanban = ({ data }: TaskKanbanProps) => {
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

  
  return (
    <DragDropContext onDragEnd={() => {}}>
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
