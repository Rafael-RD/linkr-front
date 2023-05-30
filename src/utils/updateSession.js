export default function updateSession(setAuth, data) {
  const dataStringify = JSON.stringify(data);

  localStorage.setItem("auth", dataStringify);
  setAuth(data);

  return;
}
