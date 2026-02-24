import api from './axiosInstance'

export const getAllCourses = () =>
  api.get('/course/get-courses').then((res) => res.data)

export const getCoursesByCategory = () =>
  api.get('/course/by-category').then((res) => res.data)

export const getMostEnrolledCourses = () =>
  api.get('/course/most-enrolled').then((res) => res.data)

export const searchCourses = async (query) => {
  const res = await api.get('/learner/search-courses', { params: { q: query } })
  return {
    success: res.data.success,
    results: res.data.courses || []
  }
}

export const searchByInstructor = async (query) => {
  const res = await api.get('/learner/instructor-courses', { params: { q: query } })
  return {
    success: res.data.success,
    results: res.data.data || []
  }
}


export const getCoursePublicDetails = (courseId) =>
  api.get(`/course/${courseId}`).then((res) => res.data)
//get all courses,get course details,get All Courses by Catagory,get top view courses