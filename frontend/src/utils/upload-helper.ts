import axios from 'axios';

export async function uploadImageFile(fileOrDataUrl: File | Blob | string): Promise<string> {
  if (typeof fileOrDataUrl === 'string' && !fileOrDataUrl.startsWith('data:')) {
    return fileOrDataUrl;
  }

  const backendUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';
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

  const { data } = await axios.post<{ url: string }>(`${backendUrl}/api/uploads`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return `${backendUrl}${data.url}`;
}
