/**
 * Environment Configuration Service
 * Manages application configuration from environment variables
 */

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',
  apiUrl: 'http://localhost:8080/api',
  endpoints: {
    auth: '/auth',
    students: '/students',
    marks: '/marks',
    subjects: '/subjects',
    teachers: '/teachers',
    classes: '/classes',
    rechecks: '/rechecks',
    admin: '/admin'
  }
};

// For production builds
export const environmentProd = {
  production: true,
  apiBaseUrl: process.env['API_BASE_URL'] || 'http://localhost:8080',
  apiUrl: process.env['BACKEND_URL'] || 'http://localhost:8080/api',
  endpoints: {
    auth: '/auth',
    students: '/students',
    marks: '/marks',
    subjects: '/subjects',
    teachers: '/teachers',
    classes: '/classes',
    rechecks: '/rechecks',
    admin: '/admin'
  }
};
