// Simple console wrapper that includes a timestamp
const log = (message: string, data?: any) => {
  const timestamp = new Date().toISOString().slice(11, 19);
  if (data) {
    console.log(`[${timestamp}][CookieStorage] ${message}`, data);
  } else {
    console.log(`[${timestamp}][CookieStorage] ${message}`);
  }
};

// Cookie storage implementation for Zustand
export const createCookieStorage = () => {
  const isBrowser = typeof window !== "undefined";

  return {
    getItem: (name: string): string => {
      if (!isBrowser) return "";

      try {
        const value = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${name}=`))
          ?.split("=")[1];

        return value ? decodeURIComponent(value) : "";
      } catch (error) {
        return "";
      }
    },

    setItem: (name: string, value: string): void => {
      if (!isBrowser) return;

      try {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        const cookieValue = encodeURIComponent(value);
        document.cookie = `${name}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
      } catch (error) {
        // Silent fail
      }
    },

    removeItem: (name: string): void => {
      if (!isBrowser) return;

      try {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`;
      } catch (error) {
        // Silent fail
      }
    },
  };
};
