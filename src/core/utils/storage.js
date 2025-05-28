const projectKey = import.meta.env.VITE_LOCALSTORE;

export const getItem = (name) => {
  const data = window.localStorage.getItem(projectKey + name);
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
};

export const setItem = (name, value) => {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }

  window.localStorage.setItem(projectKey + name, value);
};

export const removeItem = (name) => {
  window.localStorage.removeItem(projectKey + name);
};
