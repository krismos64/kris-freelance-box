import React from 'react'
    import { X } from 'lucide-react'

    interface Task {
      id: string
      name: string
      description: string
      completed: boolean
    }

    interface TaskDescriptionModalProps {
      isOpen: boolean
      onClose: () => void
      task: Task | null
    }

    const TaskDescriptionModal: React.FC<TaskDescriptionModalProps> = ({
      isOpen,
      onClose,
      task,
    }) => {
      if (!isOpen || !task) return null

      return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4">{task.name}</h2>
            <p className="text-gray-700">{task.description}</p>
          </div>
        </div>
      )
    }

    export default TaskDescriptionModal
