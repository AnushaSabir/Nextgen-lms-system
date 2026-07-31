import axios from 'axios'

const restApiUrl = process.env.NEXT_PUBLIC_REST_API_URL
  ?? process.env.NEXT_PUBLIC_API_URL?.replace(/\/graphql\/?$/, '/api')
  ?? (process.env.NEXT_PUBLIC_API_URL?.endsWith('/api') ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : 'http://localhost:8000/api');

const api = axios.create({
  baseURL: restApiUrl,
  // IMPORTANT: do NOT force JSON content-type globally.
  // For FormData uploads axios should automatically use multipart/form-data boundary.
  headers: {},
})

function serializeToFormData(data: FormData | any) {
  const form = data instanceof FormData ? data : new FormData();

  if (!(data instanceof FormData)) {
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        value.forEach((item) => form.append(`${key}[]`, item instanceof Blob ? item : String(item)));
      } else if (value instanceof Blob) {
        form.append(key, value);
      } else if (typeof value === 'object') {
        form.append(key, JSON.stringify(value));
      } else {
        form.append(key, String(value));
      }
    });
  }

  return form;
}

// attach token if present
api.interceptors.request.use((config) => {
  try {
    const token = (typeof window !== 'undefined' && localStorage.getItem('nextgen-lms_lms_token')) || null;
    if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`;
  } catch (e) {
    // ignore
  }
  return config;
})

export async function registerTrainer(data: FormData | any) {
  const payload = data instanceof FormData ? data : serializeToFormData(data);
  const res = await api.post('/trainer/register', payload);
  return res.data;
}

export async function login(credentials: { email: string; password: string }) {
  const res = await api.post('/login', credentials)
  return res.data
}

export async function getProfile() {
  const res = await api.get('/trainer/profile')
  return res.data
}

export async function updateProfile(data: FormData | any) {
  const isFormData = data instanceof FormData;
  const payload = isFormData ? data : serializeToFormData(data);
  
  if (isFormData) {
    payload.append('_method', 'PATCH');
    const res = await api.post('/trainer/profile', payload);
    return res.data;
  } else {
    const res = await api.patch('/trainer/profile', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  }
}


export async function getCourses() {
  const res = await api.get('/trainer/courses')
  return res.data
}

export async function createCourse(data: FormData | any) {
  const payload = data instanceof FormData ? data : serializeToFormData(data);
  const res = await api.post('/trainer/courses', payload);
  return res.data;
}

export async function getCourse(courseId: number | string) {
  const res = await api.get(`/trainer/courses/${courseId}`)
  return res.data
}

export async function updateCourse(courseId: number | string, data: any) {
  const payload = data instanceof FormData ? data : data;
  const res = await api.patch(`/trainer/courses/${courseId}`, payload)
  return res.data
}

export async function deleteCourse(courseId: number | string) {
  const res = await api.delete(`/trainer/courses/${courseId}`)
  return res.data
}

export async function uploadVideo(courseId: number | string, data: FormData | any) {
  const payload = data instanceof FormData ? data : serializeToFormData(data);
  const res = await api.post(`/trainer/courses/${courseId}/videos`, payload);
  return res.data;
}

export async function getVideos(courseId: number | string) {
  const res = await api.get(`/trainer/courses/${courseId}/videos`)
  return res.data
}

export async function addMcq(videoId: number | string, data: any) {
  const res = await api.post(`/trainer/videos/${videoId}/mcqs`, data)
  return res.data
}

export async function addQuiz(videoId: number | string, data: any) {
  const res = await api.post(`/trainer/videos/${videoId}/quiz`, data)
  return res.data
}

export async function addSummaryTask(videoId: number | string, data: any) {
  const res = await api.post(`/trainer/videos/${videoId}/summary-task`, data)
  return res.data
}

export async function getMcqs(videoId: number | string) {
  const res = await api.get(`/trainer/videos/${videoId}/mcqs`)
  return res.data
}

export async function getQuizzes(videoId: number | string) {
  const res = await api.get(`/trainer/videos/${videoId}/quiz`)
  return res.data
}

export async function getSummaryTasks(videoId: number | string) {
  const res = await api.get(`/trainer/videos/${videoId}/summary-task`)
  return res.data
}

export default api
