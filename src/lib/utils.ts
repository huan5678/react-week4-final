import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import { FetchProps } from "@/type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(num: number): string {
  return (
    "$ " +
    num.toLocaleString("zh-TW", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  );
}

async function useFetch({ path, method, headers, data }: FetchProps) {
  const baseUrl = "https://todolist-api.hexschool.io";
  const url = baseUrl + path;
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      sessionStorage.removeItem("apiChecked");
    }
    const json = await response.json();
    return {
      statusCode: response.status,
      ...json,
    };
  } catch (e: unknown) {
    const err = e as Error;
    console.error(err.message);
  }
}

const token = getCookie("token");

export function GET(path: string) {
  return useFetch({
    path,
    method: "GET",
    headers: {
      authorization: token,
    },
  });
}

export function POST({ path, data }: { path: string; data?: unknown }) {
  return useFetch({
    path,
    method: "POST",
    headers: {
      authorization: token,
    },
    data,
  });
}

export function PUT({ path, data }: { path: string; data: unknown }) {
  return useFetch({
    path,
    method: "PUT",
    headers: {
      authorization: token,
    },
    data,
  });
}

export function PATCH(path: string) {
  return useFetch({
    path,
    method: "PATCH",
    headers: {
      authorization: token,
    },
  });
}

export function DELETE(path: string) {
  return useFetch({
    path,
    method: "DELETE",
    headers: {
      authorization: token,
    },
  });
}

export async function handleOnCheckout() {
  try {
    const res = await GET("/users/checkout");
    if (!res.status) {
      return false;
    }
    if (res.status) {
      setCookie({
        name: "apiChecked",
        content: "true",
        expiryDays: 3,
      });
      return res;
    }
  } catch (err) {
    console.error(err);
  }
}

export function formateDate(timestamp: number) {
  if (timestamp === undefined) return;
  let time;
  time = timestamp;
  if (timestamp.toString().length <= 10) time = timestamp * 1000;
  return new Date(time).toLocaleDateString();
}

export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

export function setCookie({
  name,
  content,
  expiryDays,
}: {
  name: string;
  content: string;
  expiryDays: number;
}): void {
  Cookies.set(name, content, { expires: expiryDays });
}

export function rmCookie(name: string) {
  Cookies.remove(name);
}
