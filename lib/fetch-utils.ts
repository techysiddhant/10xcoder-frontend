export async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

export async function postData<T>(url: string, data: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}
export async function postForm<T>(url: string, data: unknown): Promise<T> {
  const isFormData = data instanceof FormData;
  console.log("isFormData", isFormData);
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: isFormData ? data : JSON.stringify(data),
    headers: isFormData
      ? undefined // ✅ Let browser handle Content-Type for FormData
      : {
          "Content-Type": "application/json",
        },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! Status: ${response.status}, ${errorText}`);
  }

  return response.json();
}
