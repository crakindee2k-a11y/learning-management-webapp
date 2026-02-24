import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/layout/protectedRoute'
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import AllCoursesPage from '../pages/common/AllCoursesPage'
import CoursesByCategoryPage from '../pages/common/CoursesByCategoryPage'
import ExploreCoursesPage from '../pages/common/ExploreCoursesPage'
import MostEnrolledPage from '../pages/common/MostEnrolledPage'
import SearchCoursesPage from '../pages/common/SearchCoursesPage'
import CourseDetailsPublic from '../pages/common/CourseDetailsPublic'
import CreateBankAccountPage from '../pages/bank/CreateBankAccountPage'
import LearnerDashboard from '../pages/learner/LearnerDashboard'
import MyEnrolledCoursesPage from '../pages/learner/MyEnrolledCoursesPage'
import WatchCoursePage from '../pages/learner/WatchCoursePage'
import BuyableCoursesPage from '../pages/learner/BuyableCoursesPage'
import MyCertificatesPage from '../pages/learner/MyCertificatesPage'
import CertificateViewPage from '../pages/learner/CertificateViewPage'
import InstructorDashboard from '../pages/instructor/InstructorDashboard'
import MyCoursesPage from '../pages/instructor/MyCoursesPage'
import CreateCoursePage from '../pages/instructor/CreateCoursePage'
import EditCoursePage from '../pages/instructor/EditCoursePage'
import ManageResourcesPage from '../pages/instructor/ManageResourcesPage'
import ApproveStudentsPage from '../pages/instructor/ApproveStudentsPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import TransactionsPage from '../pages/admin/TransactionsPage'
import AdminCoursesPage from '../pages/admin/AdminCoursesPage'

const Page = ({ children }) => <div className="animate-fade-in">{children}</div>

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Page><AllCoursesPage /></Page>} />
    <Route path="/course/:courseId" element={<Page><CourseDetailsPublic /></Page>} />
    <Route path="/categories" element={<Page><CoursesByCategoryPage /></Page>} />
    <Route path="/explore" element={<Page><ExploreCoursesPage /></Page>} />
    <Route path="/most-enrolled" element={<Page><MostEnrolledPage /></Page>} />
    <Route path="/search" element={<Page><SearchCoursesPage /></Page>} />
    <Route path="/bank" element={<Page><CreateBankAccountPage /></Page>} />
    <Route path="/login" element={<Page><LoginPage /></Page>} />
    <Route path="/signup" element={<Page><SignupPage /></Page>} />

    <Route element={<ProtectedRoute roles={['Learner']} />}>
      <Route path="/learner/dashboard" element={<Page><LearnerDashboard /></Page>} />
      <Route path="/learner/my-courses" element={<Page><MyEnrolledCoursesPage /></Page>} />
      <Route path="/learner/certificates" element={<Page><MyCertificatesPage /></Page>} />
      <Route path="/learner/certificate/:courseId" element={<Page><CertificateViewPage /></Page>} />
      <Route path="/learner/watch/:courseId" element={<Page><WatchCoursePage /></Page>} />
      <Route path="/learner/buy" element={<Page><BuyableCoursesPage /></Page>} />
    </Route>

    <Route element={<ProtectedRoute roles={['Instructor']} />}>
      <Route path="/instructor/dashboard" element={<Page><InstructorDashboard /></Page>} />
      <Route path="/instructor/my-courses" element={<Page><MyCoursesPage /></Page>} />
      <Route path="/instructor/create" element={<Page><CreateCoursePage /></Page>} />
      <Route path="/instructor/course/:courseId" element={<Page><EditCoursePage /></Page>} />
      <Route path="/instructor/course/:courseId/resources" element={<Page><ManageResourcesPage /></Page>} />
      <Route path="/instructor/course/:courseId/approve" element={<Page><ApproveStudentsPage /></Page>} />
    </Route>

    <Route element={<ProtectedRoute roles={['Admin']} />}>
      <Route path="/admin/dashboard" element={<Page><AdminDashboard /></Page>} />
      <Route path="/admin/transactions" element={<Page><TransactionsPage /></Page>} />
      <Route path="/admin/courses" element={<Page><AdminCoursesPage /></Page>} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRouter

