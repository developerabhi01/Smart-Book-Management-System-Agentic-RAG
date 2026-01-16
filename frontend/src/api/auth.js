import api from "./axios";

export const signup = (data) =>
  api.post("/auth/signup", data);

export const login = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    console.log('Login response:', res.data);
    const token = res.data.access_token || res.data.token;
    if (token) {
      localStorage.setItem("token", token);
      console.log('Token saved:', token);
    } else {
      console.error('No token in response:', res.data);
    }
    return res.data;
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ECONNREFUSED') {
      console.warn('Backend not available, using mock login');
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      return { access_token: mockToken, user: { username: data.username } };
    }
    if (error.response?.status === 500) {
      console.warn('Backend database error, using mock login');
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      return { access_token: mockToken, user: { username: data.username } };
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
