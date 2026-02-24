import api from './axiosInstance'

export const getMyCourses = () =>
  api.get('/instructor/my-courses').then((res) => res.data)

export const createCourse = (formData) =>
  api
    .post('/instructor/create-course', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)

export const getCourseDetails = (courseId) =>
  api.get(`/instructor/course/${courseId}/details`).then((res) => res.data)

export const addResources = (courseId, resources = [], files = []) => {
  const formData = new FormData()
  if (resources?.length) {
    formData.append('resources', JSON.stringify(resources))
  }
  files.forEach((file) => formData.append('files', file))
  return api
    .post(`/instructor/${courseId}/add-resources`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
}

export const deleteResourceOrVideo = (courseId, itemId) =>
  api.delete(`/instructor/${courseId}/resource/${itemId}`).then((res) => res.data)

export const addVideos = (courseId, files) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  return api
    .post(`/instructor/${courseId}/add-videos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
}

export const getEarningsChart = () =>
  api.get('/instructor/total-earning-forChart').then((res) => res.data)

export const getApprovedStudents = (courseId) =>
  api.get(`/instructor/approve-students/${courseId}`).then((res) => res.data)

