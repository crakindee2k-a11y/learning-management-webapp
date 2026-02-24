import api from './axiosInstance'

export const getAdminStats = () =>
  api.get('/admin/stats').then((res) => res.data.data)

export const getTransactions = (page = 1) =>
  api
    .get('/admin/transactions', { params: { page } })
    .then((res) => res.data.data)

export const deleteCourse = (courseId) =>
  api.delete(`/admin/courses/${courseId}`).then((res) => res.data.data)
