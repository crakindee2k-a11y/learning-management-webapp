import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'

const AddResourceForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [mediaType, setMediaType] = useState('document_link')
  const [files, setFiles] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedUrl = url.trim()
    const resources =
      trimmedTitle && trimmedUrl
        ? [
            {
              title: trimmedTitle,
              url: trimmedUrl,
              mediaType,
            },
          ]
        : []
    onSubmit({ resources, files })
    setTitle('')
    setUrl('')
    setMediaType('document_link')
    setFiles([])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input label="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
        Type
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="w-full rounded-md bg-zinc-50 px-3 py-2 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-black/10 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:ring-amber-300/20"
        >
          <option value="document_link">Document link</option>
          <option value="image">Image</option>
          <option value="text">Text</option>
          <option value="mcq">MCQ</option>
          <option value="audio">Audio</option>
          <option value="file">File link</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
        Upload study material file(s) (PDF, DOCX, PPT, images, audio)
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.csv,.zip,.rar,.7z,image/*,audio/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv"
          className="text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-zinc-900 hover:file:bg-zinc-200 dark:text-zinc-200 dark:file:bg-zinc-800 dark:file:text-zinc-100 dark:hover:file:bg-zinc-700"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add resource'}
      </Button>
    </form>
  )
}

export default AddResourceForm
