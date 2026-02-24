import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import { useInstructorCourses } from '../../hooks/useInstructorCourses'

const ApproveStudentsPage = () => {
  const { courseId } = useParams()
  const { approvedStudents, loadApprovedStudents, status } = useInstructorCourses()

  useEffect(() => {
    loadApprovedStudents(courseId)
  }, [courseId, loadApprovedStudents])

  if (status === 'loading') return <Loader />

  const list = approvedStudents[courseId] || []

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Approved students</h2>
      <div className="space-y-2 text-sm">
        {list.map((tx) => (
          <div key={tx._id} className="rounded-xl bg-white/95 p-3 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.22)] dark:bg-zinc-900/70 dark:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.75)]">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{tx.from_user.fullName}</p>
            <p className="text-slate-600 dark:text-slate-300">Amount: {tx.amount}</p>
            <p className="text-slate-500 text-xs dark:text-slate-400">Transaction: {tx.transaction_id}</p>
          </div>
        ))}
        {!list.length && <p className="text-slate-500 dark:text-slate-400">No approved students yet.</p>}
      </div>
    </div>
  )
}

export default ApproveStudentsPage

