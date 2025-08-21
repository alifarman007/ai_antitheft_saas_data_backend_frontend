const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  package_id?: number;
  package?: Package;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface Package {
  id: number;
  name: string;
  price: number;
  period: string;
  description?: string;
  features?: string[];
  camera_limit?: number;
  max_registered_faces?: number;
}

export interface Camera {
  id: number;
  camera_name: string;
  camera_brand?: string;
  camera_type: string;
  ip_address?: string;
  port?: number;
  username?: string;
  status: string;
  last_seen?: string;
  created_at: string;
  updated_at: string;
}

export interface RegisteredFace {
  id: number;
  face_name: string;
  face_image_path?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DetectionLog {
  id: number;
  camera_id: number;
  registered_face_id?: number;
  detection_confidence: number;
  detection_image_path?: string;
  detected_at: string;
  created_at: string;
  camera?: Camera;
  registered_face?: RegisteredFace;
}

// Auth utilities
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API functions
export const api = {
  // Auth
  async register(data: {
    email: string;
    full_name: string;
    phone_number?: string;
    password: string;
    confirm_password: string;
    selected_package: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async login(data: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.access_token) {
      setAuthToken(result.access_token);
    }
    return result;
  },

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return response.json();
  },

  // Packages
  async getPackages(): Promise<Package[]> {
    const response = await fetch(`${API_BASE_URL}/packages`);
    return response.json();
  },

  // Cameras
  async getCameras(): Promise<Camera[]> {
    const response = await fetch(`${API_BASE_URL}/cameras`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return response.json();
  },

  async createCamera(data: {
    camera_name: string;
    camera_brand: string;
    camera_type: string;
    ip_address?: string;
    port?: number;
    username?: string;
    password?: string;
  }): Promise<Camera> {
    const response = await fetch(`${API_BASE_URL}/cameras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateCamera(id: number, data: any): Promise<Camera> {
    const response = await fetch(`${API_BASE_URL}/cameras/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteCamera(id: number) {
    const response = await fetch(`${API_BASE_URL}/cameras/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });
    return response.json();
  },

  async testCamera(id: number) {
    const response = await fetch(`${API_BASE_URL}/cameras/${id}/test`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
    });
    return response.json();
  },

  // Faces
  async getFaces(): Promise<RegisteredFace[]> {
    const response = await fetch(`${API_BASE_URL}/faces`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return response.json();
  },

  async createFace(faceName: string, file: File): Promise<RegisteredFace> {
    const formData = new FormData();
    formData.append('face_name', faceName);
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/faces`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });
    return response.json();
  },

  async deleteFace(id: number) {
    const response = await fetch(`${API_BASE_URL}/faces/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });
    return response.json();
  },

  // Detection logs
  async getDetections(limit = 50, offset = 0): Promise<DetectionLog[]> {
    const response = await fetch(
      `${API_BASE_URL}/detections?limit=${limit}&offset=${offset}`,
      {
        headers: {
          ...getAuthHeaders(),
        },
      }
    );
    return response.json();
  },

  async getDetectionLogs(limit = 50, offset = 0): Promise<DetectionLog[]> {
    const response = await fetch(
      `${API_BASE_URL}/detections?limit=${limit}&offset=${offset}`,
      {
        headers: {
          ...getAuthHeaders(),
        },
      }
    );
    return response.json();
  },

  // Dashboard stats
  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return response.json();
  },
};