// Utiliser la variable d'env `VITE_API_BASE_URL` si fournie (vite), sinon
// tomber en backoff sur l'hôte courant avec le port 4000 (dév local).
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:4000/api`
    : 'http://localhost:4000/api');

// Récupérer le token d'accès depuis localStorage
const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

// Configuration des headers avec authentification
const getAuthHeaders = () => {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Gestion des erreurs API
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Erreur API');
  }
  return response.json();
};

// API Products
export const productsApi = {
  // Créer un produit avec upload d'images
  createProduct: async (formData: FormData) => {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
    return handleApiError(response);
  },

  // Mettre à jour un produit
  updateProduct: async (id: string, formData: FormData) => {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
    return handleApiError(response);
  },

  // Supprimer un produit
  deleteProduct: async (id: string) => {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleApiError(response);
  },

  // Récupérer tous les produits
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    return handleApiError(response);
  },

  // Récupérer un produit par ID
  getProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleApiError(response);
  },
};

// API Auth
export const authApi = {
  // Login
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleApiError(response);
  },

  // Register
  register: async (name: string, email: string, password: string, role: string = 'buyer') => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    return handleApiError(response);
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    return handleApiError(response);
  },

  // Logout
  logout: async (refreshToken: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    return handleApiError(response);
  },
};
