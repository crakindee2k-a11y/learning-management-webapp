import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import { Card, CardBody } from '../../ui/Card'

const CreateCourseForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [files, setFiles] = useState([])
  const [studyMaterials, setStudyMaterials] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    if (thumbnail) formData.append('thumbnail', thumbnail)
    Array.from(files).forEach((file) => formData.append('files', file))
    Array.from(studyMaterials).forEach((file) => formData.append('resourceFiles', file))
    if (studyMaterials.length) {
      formData.append('resourceTitles', JSON.stringify(Array.from(studyMaterials).map((file) => file.name)))
    }
    onSubmit(formData)
  }

  return (
    <Card>
      <CardBody>
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        label="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
        <span className="text-slate-900 dark:text-slate-100">Upload thumbnail (image)</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          className="w-full transform-gpu rounded-md bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.10)] file:mr-4 file:rounded file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 dark:file:bg-amber-500/20 dark:file:text-amber-100"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
        <span className="text-slate-900 dark:text-slate-100">Upload videos</span>
        <input 
          type="file" 
          multiple 
          accept="video/*"
          onChange={(e) => setFiles(e.target.files)} 
          className="w-full transform-gpu rounded-md bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.10)] file:mr-4 file:rounded file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 dark:file:bg-amber-500/20 dark:file:text-amber-100"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
        <span className="text-slate-900 dark:text-slate-100">Upload study materials (PDF, DOCX, PPT, etc.)</span>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.csv,.zip,.rar,.7z,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv"
          onChange={(e) => setStudyMaterials(Array.from(e.target.files || []))}
          className="w-full transform-gpu rounded-md bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.10)] file:mr-4 file:rounded file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 dark:file:bg-amber-500/20 dark:file:text-amber-100"
        />
      </label>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create course'}
      </Button>
    </form>
      </CardBody>
    </Card>
  )
}

export default CreateCourseForm
