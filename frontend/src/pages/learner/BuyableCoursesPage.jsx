import { useEffect } from 'react'
import CourseCard from '../../components/cards/CourseCard'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { useEnroll } from '../../hooks/useEnroll'
import { useBank } from '../../hooks/useBank'

const BuyableCoursesPage = () => {
  const { buyable, loadBuyable, enroll, status } = useEnroll()
  const bank = useBank()

  useEffect(() => {
    loadBuyable()
    bank.loadBalance()
  }, [loadBuyable, bank.loadBalance])

  const handleEnroll = async (course) => {
    if (!bank.balance) return alert('Please create a bank account first')
    try {
      const res = await enroll({
        courseId: course._id,
        bankAccountNumber: bank.balance.account_number,
        secretKey: bank.account?.bank_secret || bank.balance?.bank_secret,
      })
      if (!res?.ok) throw new Error(res?.error)
      alert('Enrollment successful!')
      loadBuyable()
    } catch (err) {
      alert(err?.message || err || 'Enrollment failed')
    }
  }

  if (status === 'loading') return <Loader />

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Buyable courses</h2>
      {buyable?.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {buyable.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              actionLabel="Enroll"
              onAction={() => handleEnroll(course)}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="Nothing to buy" />
      )}
    </div>
  )
}

export default BuyableCoursesPage

