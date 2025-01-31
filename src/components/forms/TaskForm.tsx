import React, { useState } from 'react'
import { Save, X } from 'lucide-react'
import { Task } from '../../types/database'

interface TaskFormProps {
  task?: Task
  onSubmit: (task: Partial<Task>) => void
  onCancel: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  task, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    name: task?.name || '',
    description: task?.description || '',
    completed: task?.completed || false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 space-y-4"
    >
      <div>
        <label className="block text-white mb-2">Titre de la Tâche *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
        />
      </div>
      
      <div>
        <label className="block text-white mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white h-24"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          name="completed"
          checked={formData.completed}
          onChange={handleChange}
          className="mr-2 bg-white/10 border border-white/20 rounded"
        />
        <label className="text-white">Tâche terminée</label>
      </div>
      
      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <X className="mr-2" /> Annuler
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Save className="mr-2" /> Enregistrer
        </button>
      </div>
    </form>
  )
}

export default TaskForm
