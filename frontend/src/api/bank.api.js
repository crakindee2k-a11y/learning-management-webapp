import api from './axiosInstance'

export const createBankAccount = () =>
  api.post('/bank/create-account').then((res) => res.data)

export const getBalance = () =>
  api.get('/bank/current-balance').then((res) => res.data)
//create account,get balance 