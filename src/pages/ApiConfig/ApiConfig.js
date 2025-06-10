export const API_BASE_URL = 'http://127.0.0.1:8000/api';
export const getToken = () => localStorage.getItem('token');
export const getCompanyId = () => localStorage.getItem('companyId');
export const clearSession = () => localStorage.clear();
export const getRefreshToken = () => localStorage.getItem("refresh_token");
export const RoleId = () => localStorage.getItem('RoleId');
export const UserType = () => localStorage.getItem('UserType');



export const setToken = (token) => {
  localStorage.setItem("token", token);
};