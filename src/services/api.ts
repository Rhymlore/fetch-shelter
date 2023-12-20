import { SearchDogsParams } from '../utils/types';
const BASE_URL = 'https://frontend-take-home-service.fetch.com';

// Handle response from API
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType?.includes('application/json')) {
    return response.json();
  } else {
    return response.text();
  }
}

// Login
async function login(name: string, email: string) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, email }),
  });
  return handleResponse(response);
}

// Logout
async function logout() {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleResponse(response);
}

// Get Dog Breeds
async function getDogBreeds() {
  const response = await fetch(`${BASE_URL}/dogs/breeds`, {
    credentials: 'include',
  });
  return handleResponse(response);
}

// Search Dogs
async function searchDogs(params: SearchDogsParams) {
  const queryParams = new URLSearchParams();

  if (params.breeds) {
    params.breeds.forEach(breed => queryParams.append('breeds', breed));
  }
  if (params.zipCodes) {
    params.zipCodes.forEach(zipCode => queryParams.append('zipCodes', zipCode));
  }
  if (params.ageMin !== undefined) {
    queryParams.append('ageMin', params.ageMin.toString());
  }
  if (params.ageMax !== undefined) {
    queryParams.append('ageMax', params.ageMax.toString());
  }
  if (params.size !== undefined) {
    queryParams.append('size', params.size.toString());
  }
  if (params.from !== undefined) {
    queryParams.append('from', params.from.toString());
  }
  if (params.sort) {
    queryParams.append('sort', params.sort);
  }

  const response = await fetch(`${BASE_URL}/dogs/search?${queryParams}`, {
    credentials: 'include',
  });
  return handleResponse(response);
}

// Fetch Dog Details
async function fetchDogDetails(dogIds: string[]) {
  const response = await fetch(`${BASE_URL}/dogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(dogIds),
  });
  return handleResponse(response);
}


// Export all functions
export {
  login,
  logout,
  getDogBreeds,
  searchDogs,
  fetchDogDetails,
};
