import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  adminRegister,
  approveUser,
  logout as logoutApi,
  login as loginApi,
  register as registerApi,
} from "./../api/auth";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginResponse } from "../types/auth";
export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const {
    mutate: login,
    error,
    isPending: isLoading,
    reset,
  } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data: LoginResponse) => {
      toast.success(`Welcome back, ${data?.name}!`);
      const redirectPath = `/${data?.role}/dashboard`;
      setUser(data);
      navigate(redirectPath);
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });

  return { login, error, isLoading, reset };
};

export const useRegister = () => {
  const navigate = useNavigate();
  const {
    mutate: register,
    isPending: isLoading,
    error,
    reset,
  } = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      toast.success("Account created successfully! Awaiting approval.");
      navigate("/register-success");
    },

    onError: (error: Error) => {
      toast.error(`Registration failed: ${error.message}`);
    },
  });
  return { register, isLoading, error, reset };
};

export const useAdminRegister = () => {
  const queryClient = useQueryClient();
  const {
    mutate: registerAdmin,
    isPending: isLoading,
    error,
    reset,
  } = useMutation({
    mutationFn: adminRegister,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Admin account created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Admin registration failed: ${error.message}`);
    },
  });
  return { registerAdmin, isLoading, error, reset };
};

export const useLogout = () => {
  const {
    mutate: logout,
    isPending: isLoading,
    error,
    reset,
  } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      toast.success("Logged out successfully");
    },
    onError: (error: Error) => {
      toast.error(`Logout failed: ${error.message}`);
    },
  });
  return { logout, isLoading, error, reset };
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();
  const {
    mutate: approve,
    isPending: isLoading,
    error,
    reset,
  } = useMutation({
    mutationFn: approveUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`User ${variables} successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Operation failed: ${error.message}`);
    },
  });
  return { approve, isLoading, error, reset };
};
