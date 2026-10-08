const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

console.log("API URL:", API_URL);

export const API_BASE_URL =
  API_URL.replace(/\/api\/?$/, "");

export const apiRequest = async (
  endpoint,
  options = {}
) => {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    const headers = {};

    /*
     * Add JSON Content-Type
     * unless the body is FormData.
     */
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] =
        "application/json";
    }

    /*
     * Add JWT token.
     */
    if (token) {
      headers["Authorization"] =
        "Bearer " + token;
    }

    /*
     * Allow custom headers.
     */
    Object.assign(
      headers,
      options.headers || {}
    );

    /*
     * Get HTTP method.
     * If no method is provided,
     * fetch uses GET.
     */
    const method = (
      options.method || "GET"
    ).toUpperCase();

    /*
     * IMPORTANT:
     *
     * GET /orders
     * is admin-only.
     *
     * GET /orders/me
     * is for the logged-in user.
     *
     * Therefore, ONLY GET requests
     * to /orders are redirected.
     *
     * POST /orders MUST remain /orders
     * because it creates a new order.
     */
    let finalEndpoint = endpoint;

    if (
      method === "GET" &&
      (
        endpoint === "/orders" ||
        endpoint === "/orders/"
      )
    ) {
      finalEndpoint = "/orders/me";

      console.log(
        "GET orders redirected to:",
        finalEndpoint
      );
    }

    console.log(
      "API REQUEST:",
      method,
      API_URL + finalEndpoint
    );

    const response = await fetch(
      API_URL + finalEndpoint,
      {
        ...options,
        headers,
      }
    );

    /*
     * Read response.
     */
    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    let data;

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    /*
     * Handle errors.
     */
    if (!response.ok) {
      throw new Error(
        typeof data === "object" &&
          data?.message
          ? data.message
          : data ||
            "Something went wrong"
      );
    }

    return data;

  } catch (error) {
    console.error(
      "API Request Error:",
      error
    );

    throw error;
  }
};