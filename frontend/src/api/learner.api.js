import api from './axiosInstance'

export const enrollCourse = (payload) =>
  api.post('/learner/enroll', payload).then((res) => res.data)

export const getMyCourses = () =>
  api.get('/learner/my-courses').then((res) => res.data)

export const getCourseContent = (courseId) =>
  api.get(`/learner/course/${courseId}`).then((res) => res.data)

export const updateProgress = (payload) =>
  api.post('/learner/course/progress', payload).then((res) => res.data)

export const getBuyableCourses = () =>
  api.get('/learner/buyable-course').then((res) => res.data)

