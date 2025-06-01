import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function apiLogin(email: string, password: string) {
  const { data } = await axios.put(`${API_URL}/auth/sign_in`, {
    user: { email, password },
  });
  return data;
}

export async function apiRegister(name: string, email: string, password: string) {
  const { data } = await axios.post(`${API_URL}/auth/sign_up`, {
    user: { name, email, password },
  });
  return data;
}

export async function apiGetUserInfo(token: string) {
  const { data } = await axios.get(`${API_URL}/users/infos`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return data;
}
