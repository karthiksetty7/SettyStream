import { handleAuthError } from "./auth";

const BASE_URL = "https://settystream-production.up.railway.app/api"; // backend

export const apiRequest = async ({
  endpoint,
  method = "GET",
  body = null,
  navigate,
}) => {
  // Backend uses Cookies, but localStorage works too
  const token = Cookies.get('token') || localStorage.getItem("token");

  if (!token) {
    handleAuthError(navigate);
    return null;
  }

  try {
    const isFormData = body instanceof FormData;

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      body: isFormData
        ? body
        : body
        ? JSON.stringify(body)
        : null,
    });

    if (res.status === 401) {
      handleAuthError(navigate);
      return null;
    }

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok || data.success === false) {
      console.log("❌ API ERROR RESPONSE:", data);
      alert(
        data.message ||
        data.error ||
        "Something went wrong. Please try again."
      );
      return null;
    }

    return data;

  } catch (error) {
    console.error("❌ Network Error:", error);
    alert("Server not reachable. Check internet or backend.");
    return null;
  }
};