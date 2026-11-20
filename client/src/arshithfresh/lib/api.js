const TOKEN_KEY = 'afims_token';
export const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };
export const setToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch {} };

export class ApiError extends Error { constructor(msg, status, data) { super(msg); this.status = status; this.data = data; } }

const RAW_URL = import.meta.env.VITE_API_URL || '';
const AF_PREFIX = RAW_URL ? `${RAW_URL.replace(/\/$/, '')}/api/af` : '/api/af';

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const t = getToken();
  if (t) headers.Authorization = `Bearer ${t}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${AF_PREFIX}${path}`, { method, headers, body: form || (body !== undefined ? JSON.stringify(body) : undefined) });
  const data = res.headers.get('content-type')?.includes('json') ? await res.json() : null;
  if (res.status === 401 && path !== '/auth/login') { setToken(null); }
  if (!res.ok) throw new ApiError(data?.error || `Request failed (${res.status})`, res.status, data);
  return data;
}

export async function download(path, fallbackName) {
  const res = await fetch(`${AF_PREFIX}${path}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!res.ok) throw new ApiError('Download failed', res.status);
  const name = /filename="([^"]+)"/.exec(res.headers.get('content-disposition') || '')?.[1] || fallbackName;
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export const qs = (o) => { const p = new URLSearchParams(); Object.entries(o).forEach(([k, v]) => v !== '' && v != null && p.set(k, v)); const s = p.toString(); return s ? `?${s}` : ''; };
