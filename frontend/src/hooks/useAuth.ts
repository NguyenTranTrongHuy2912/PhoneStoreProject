import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { authService } from '@/services/authService';
import { User } from '@/types';

/**
 * ✅ useAuth Hook
 * Quản lý login, register, logout
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { user, token, setUser, setToken, setLoading, setError, logout } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login({ email, password });
      
      setToken(response.token);
      setUser(response.data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      addNotification({
        type: 'success',
        message: 'Đăng nhập thành công',
      });
      
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      setError(message);
      addNotification({
        type: 'error',
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    fullname: string,
    email: string,
    password: string,
    phone: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register({ fullname, email, password, phone });
      
      setToken(response.token);
      setUser(response.data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      addNotification({
        type: 'success',
        message: 'Đăng ký thành công',
      });
      
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      setError(message);
      addNotification({
        type: 'error',
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    addNotification({
      type: 'success',
      message: 'Đã đăng xuất',
    });
    navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout: handleLogout,
  };
};

/**
 * ✅ useCheckAuth Hook
 * Kiểm tra authentication khi app load
 */
export const useCheckAuth = () => {
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      setToken(token);
      setUser(JSON.parse(user));
    }
  }, [setUser, setToken]);
};
