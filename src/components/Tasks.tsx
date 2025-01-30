import React, { useState, useEffect } from 'react'
    import { Plus, Check, X, Trash2 } from 'lucide-react'
    import TaskModal from './TaskModal'
    import TaskDescriptionModal from './TaskDescriptionModal'

    interface Task {
      id: string
      name: string
      description: string
      completed: boolean
    }

    const Tasks: React.FC = () => {
      const [tasks, setTasks] = useState<Task[]>([])
      const [isModalOpen, setIsModalOpen] = useState(false)
      const [isDescriptionModalOpen, setIsDescriptionModalOpen] =
        useState(false)
      const [selectedTask, setSelectedTask] = useState<Task | null>(null)
      const [selectedTaskForDescription, setSelectedTaskForDescription] =
        useState<Task | null>(null)
      const [selectedTasksToDelete, setSelectedTasksToDelete] = useState<
        string[]
      >([])

      useEffect(() => {
        // Load tasks from local storage
        const storedTasks = localStorage.getItem('tasks')
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks))
        }
      }, [])

      useEffect(() => {
        // Save tasks to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks))
      }, [tasks])

      const handleAddTask = () => {
        setSelectedTask(null)
        setIsModalOpen(true)
      }

      const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedTask(null)
      }

      const handleSaveTask = (task: Task) => {
        if (selectedTask) {
          setTasks(tasks.map((t) => (t.id === selectedTask.id ? task : t)))
        } else {
          setTasks([...tasks, task])
        }
        setIsModalOpen(false)
      }

      const handleDeleteTask = (id: string) => {
        const confirmDelete = window.confirm(
          'Êtes-vous sûr de vouloir supprimer cette tâche ?',
        )
        if (confirmDelete) {
          setTasks(tasks.filter((task) => task.id !== id))
        }
      }

      const handleToggleComplete = (id: string) => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          ),
        )
      }

      const handleOpenDescriptionModal = (task: Task) => {
        setSelectedTaskForDescription(task)
        setIsDescriptionModalOpen(true)
      }

      const handleCloseDescriptionModal = () => {
        setIsDescriptionModalOpen(false)
        setSelectedTaskForDescription(null)
      }

      const handleToggleSelectTaskToDelete = (id: string) => {
        if (selectedTasksToDelete.includes(id)) {
          setSelectedTasksToDelete(
            selectedTasksToDelete.filter((taskId) => taskId !== id),
          )
        } else {
          setSelectedTasksToDelete([...selectedTasksToDelete, id])
        }
      }

      const handleDeleteSelectedTasks = () => {
        const confirmDelete = window.confirm(
          'Êtes-vous sûr de vouloir supprimer les tâches sélectionnées ?',
        )
        if (confirmDelete) {
          setTasks(
            tasks.filter((task) => !selectedTasksToDelete.includes(task.id)),
          )
          setSelectedTasksToDelete([])
        }
      }

      return (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Tâches</h2>
            <div className="flex items-center space-x-2">
              {selectedTasksToDelete.length > 0 && (
                <button
                  onClick={handleDeleteSelectedTasks}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                >
                  <Trash2 className="mr-2" />
                  Supprimer
                </button>
              )}
              <button
                onClick={handleAddTask}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              >
                <Plus className="mr-2" />
                Nouvelle tâche
              </button>
            </div>
          </div>
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-white shadow rounded p-3 flex items-center justify-between hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedTasksToDelete.includes(task.id)}
                    onChange={() => handleToggleSelectTaskToDelete(task.id)}
                  />
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className={`mr-2 p-1 rounded-full focus:outline-none ${
                      task.completed
                        ? 'bg-green-500 text-white'
                        : 'border border-gray-400'
                    }`}
                  >
                    {task.completed && <Check />}
                  </button>
                  <button
                    onClick={() => handleOpenDescriptionModal(task)}
                    className={`${
                      task.completed ? 'line-through text-gray-500' : ''
                    } text-left`}
                  >
                    {task.name}
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {isModalOpen && (
            <TaskModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={handleSaveTask}
              task={selectedTask}
            />
          )}
          {isDescriptionModalOpen && (
            <TaskDescriptionModal
              isOpen={isDescriptionModalOpen}
              onClose={handleCloseDescriptionModal}
              task={selectedTaskForDescription}
            />
          )}
        </div>
      )
    }

    export default Tasks
