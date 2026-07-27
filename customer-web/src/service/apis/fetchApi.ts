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
  const { body, headers = {}, method = "GET", params } = options;
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
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Something went wrong");
  }
  return response.json();
};

export default fetchApi;
