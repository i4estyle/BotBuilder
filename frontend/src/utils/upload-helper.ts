import { apiClient, API_BASE_URL } from '@/services/api-client';

export async function uploadImageFile(fileOrDataUrl: File | Blob | string): Promise<string> {
  if (typeof fileOrDataUrl === 'string' && !fileOrDataUrl.startsWith('data:')) {
    return fileOrDataUrl;
  }

  const formData = new FormData();

  if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
    const response = await fetch(fileOrDataUrl);
    const blob = await response.blob();
    const extension = blob.type.split('/')[1] || 'png';
    formData.append('file', blob, `cropped-${Date.now()}.${extension}`);
  } else if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
    formData.append('file', fileOrDataUrl);
  } else {
    return fileOrDataUrl;
  }

  const { data } = await apiClient.post<{ url: string }>('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return `${API_BASE_URL}${data.url}`;
}
