const BACKEND = "http://127.0.0.1:8000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Token ${token}` } : {};
}

export async function listProfilePhotos() {
  const res = await fetch(`${BACKEND}/api/users/profile/photos/`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function uploadProfilePhotos(files) {
  const fd = new FormData();
  for (const f of files) fd.append("images", f);

  const res = await fetch(`${BACKEND}/api/users/profile/photos/upload/`, {
    method: "POST",
    body: fd,
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function deleteProfilePhoto(id) {
  const res = await fetch(`${BACKEND}/api/users/profile/photos/${id}/`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}
