import React, { useState, useEffect } from 'react'
    import { X } from 'lucide-react'

    interface Task {
      id: string
      name: string
      description: string
      completed: boolean
    }

    interface TaskModalProps {
      isOpen: boolean
      onClose: () => void
      onSave: (task: Task) => void
      task: Task | null
    }

    const TaskModal: React.FC<TaskModalProps> = ({
      isOpen,
      onClose,
      onSave,
      task,
    }) => {
      const [name, setName] = useState('')
      const [description, setDescription] = useState('')

      useEffect(() => {
        if (task) {
          setName(task.name)
          setDescription(task.description)
        } else {
          setName('')
          setDescription('')
        }
      }, [task])

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newTask: Task = {
          id: task?.id || String(Date.now()),
          name,
          description,
          completed: false,
        }
        onSave(newTask)
      }

      if (!isOpen) return null

      return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Nouvelle tâche
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Nom de la tâche
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    export default TaskModal
