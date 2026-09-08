async function apiPost(action, payload) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, payload }),
  });
  return response.json();
}

async function signupRequest(user) {
  return apiPost("signup", user);
}

async function loginRequest(credentials) {
  return apiPost("login", credentials);
}
