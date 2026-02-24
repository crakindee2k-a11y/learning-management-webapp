import { useState } from 'react'
import Button from '../common/Button'

const AddVideoForm = ({ onSubmit, loading }) => {
  const [files, setFiles] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(files)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
        Upload additional videos
        <input
          type="file"
          multiple
          className="text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-zinc-900 hover:file:bg-zinc-200 dark:text-zinc-200 dark:file:bg-zinc-800 dark:file:text-zinc-100 dark:hover:file:bg-zinc-700"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Add videos'}
      </Button>
    </form>
  )
}

export default AddVideoForm

