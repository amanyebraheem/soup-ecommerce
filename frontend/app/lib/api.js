const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const API_BASE_URL = API_URL.replace("/api", "");

export const apiRequest = async (endpoint, options = {}) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};
