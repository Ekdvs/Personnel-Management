import { useState } from 'react';
import toast from 'react-hot-toast';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiCall, options = {}) => {
    const {
      onSuccess,
      onError,
      successMessage,
      errorMessage = "Operation failed"
    } = options;

    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || errorMessage;
      setError(errorMsg);
      toast.error(errorMsg);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};