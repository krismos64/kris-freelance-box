import React, { useState, useEffect } from "react";
import { Plus, CheckSquare, Circle, Trash2 } from "lucide-react";
import { TaskService } from "../services/api";
import { Task } from "../types/database";
import TaskForm from "../components/forms/TaskForm";

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await TaskService.fetchAll();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches", error);
      }
    };
    fetchTasks();
  }, []);

  const toggleTaskCompletion = async (taskId: number) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      const updatedTask = await TaskService.update(taskId, {
        completed: !task?.completed,
      });
      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? { ...task, completed: updatedTask.completed }
            : task
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche", error);
    }
  };

  const handleAddTask = async (newTask: Partial<Task>) => {
    try {
      const createdTask = await TaskService.create(newTask);
      setTasks([...tasks, createdTask]);
      setIsAddingTask(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await TaskService.delete(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche", error);
    }
  };

  return (
    <div className="p-6 bg-white/5 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Mes Tâches</h1>
        <button
          onClick={() => setIsAddingTask(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="mr-2" /> Nouvelle Tâche
        </button>
      </div>

      {isAddingTask && (
        <div className="mb-6">
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setIsAddingTask(false)}
          />
        </div>
      )}

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-4 rounded-lg transition-all 
            ${
              task.completed
                ? "bg-green-900/30 text-gray-400"
                : "bg-white/10 text-white"
            }`}
          >
            <div className="flex items-center space-x-4">
              <button onClick={() => toggleTaskCompletion(task.id)}>
                {task.completed ? (
                  <CheckSquare className="text-green-500" />
                ) : (
                  <Circle className="text-blue-500" />
                )}
              </button>
              <div>
                <span className={task.completed ? "line-through" : ""}>
                  {task.name}
                </span>
                {task.description && (
                  <p className="text-sm text-gray-400 mt-1">
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
