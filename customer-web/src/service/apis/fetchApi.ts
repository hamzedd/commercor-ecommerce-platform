export interface IFetchOptions {
  method?: RequestInit["method"];
  headers?: Record<string, string>;
  body?: never;
  next?: RequestInit["next"];
  params?: Record<string, string | number | boolean | undefined | null>;
}

const fetchApi = async <T>(
  endpoint: string,
  options: IFetchOptions = {},
): Promise<T> => {
  const { body, headers = {}, method = "GET", next, params } = options;
  const url = new URL(
    `${
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_SSR_API_BASE_URL
        : process.env.NEXT_PUBLIC_API_BASE_URL
    }${endpoint}`,
  );
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  const config: RequestInit = {
    method,
    next,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };
  if (body) {
    config.body = JSON.stringify(body);
  }
  const response = await fetch(url.toString(), config);
  if (!response.ok) {
    const responseBody = await response.text();
    let error: { message?: string | string[] } = {};

    try {
      error = JSON.parse(responseBody);
    } catch {
      // Non-JSON error responses are still included in the server log below.
    }

    if (typeof window === "undefined") {
      const sensitiveKey = /token|authorization|password|secret|cookie/i;
      const loggedUrl = new URL(url);
      loggedUrl.searchParams.forEach((_, key) => {
        if (sensitiveKey.test(key))
          loggedUrl.searchParams.set(key, "[REDACTED]");
      });
      const safeResponseBody = responseBody
        .replace(/(bearer\s+)[^\s"']+/gi, "$1[REDACTED]")
        .replace(
          /("(?:token|authorization|password|secret|cookie)[^"]*"\s*:\s*)"[^"]*"/gi,
          '$1"[REDACTED]"',
        )
        .slice(0, 2_000);

      console.error("fetchApi request failed", {
        url: loggedUrl.toString(),
        method,
        status: response.status,
        statusText: response.statusText,
        responseBody: safeResponseBody,
      });
    }

    const message = Array.isArray(error.message)
      ? error.message.join(" ")
      : error.message;
    throw new Error(message || "Something went wrong");
  }
  return response.json();
};

export default fetchApi;
