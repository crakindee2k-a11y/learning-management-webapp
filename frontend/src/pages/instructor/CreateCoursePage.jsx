import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateCourseForm from '../../components/forms/CreateCourseForm'
import { useInstructorCourses } from '../../hooks/useInstructorCourses'
import { useToast } from '../../ui/Toast'
import { PageHeader } from '../../ui/PageHeader'

const CreateCoursePage = () => {
  const { createCourse, status, error } = useInstructorCourses()
  const [formKey, setFormKey] = useState(0)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    const result = await createCourse(formData)
    if (result?.ok) {
      const newId = result?.data?.data?._id || result?.data?.data?.courseId || null
      toast.success('Course created successfully!')
      setFormKey((k) => k + 1)
      if (newId) {
        setTimeout(() => navigate(`/instructor/course/${newId}/resources`), 1500)
      }
      return
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Create Course"
        description="Add a new course to your teaching portfolio"
      />
      {error && (
        <div className="rounded-xl bg-red-50/92 p-4 text-sm text-red-700 shadow-[0_8px_32px_-12px_rgba(239,68,68,0.18)] dark:bg-red-500/20 dark:text-red-200 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.70)]">
          {error}
        </div>
      )}
      <CreateCourseForm key={formKey} onSubmit={handleSubmit} loading={status === 'loading'} />
    </div>
  )
}

export default CreateCoursePage

