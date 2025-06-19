import { API_BASE_URL, getToken, setToken } from "./ApiConfig";

// const showLoader = () => document.body.classList.add('loading');
// const hideLoader = () => document.body.classList.remove('loading');

const refreshAccessToken = async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    setToken(data.access_token);
    return data.access_token;
  } catch (error) {
    console.error('Refresh token error:', error);
    return null;
  }
};

export const CustomFetch = async (endpoint, options = {}, retry = true) => {
  let token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  };

  // showLoader(); // 

  try {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      // credentials: 'include', 
    });

    if (response.status === 401 && retry) {
      const newToken = await refreshAccessToken();

      if (newToken) {
        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        };

        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: retryHeaders,
          // credentials: 'include',
        });

        return response;
      } else {
        console.log('Token refresh failed. Redirecting to login...');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
    }

    return response;
  } catch (err) {
     console.log('Token refresh failed. Redirecting to login...');
    console.error('Fetch error:', err);
    //  localStorage.removeItem('token');
    //     window.location.href = '/login';
    throw err;
  }
   finally {
    // hideLoader(); // hide loader after request or error
  }
};
