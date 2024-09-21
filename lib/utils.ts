import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}


export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}


export function formatEchoCount(count: number): string {
  if (count === 0) {
    return "No Echo";
  } else {
    const echoCount = count.toString().padStart(2, "0");
    const echoWord = count === 1 ? "Echo" : "Echoes";
    return `${echoCount} ${echoWord}`;
  }
}

export function formatDateWithMeasure(dateString: string): string {
  const currentDate = new Date();
  const inputDate = new Date(dateString);

  const elapsedMilliseconds = currentDate.getTime() - inputDate.getTime();
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedDays = Math.floor(elapsedHours / 24);
  const elapsedWeeks = Math.floor(elapsedDays / 7);
  const elapsedMonths = Math.floor(elapsedDays / 30); // Approximation
  const elapsedYears = Math.floor(elapsedDays / 365); // Approximation

  if (elapsedSeconds < 60) {
    return `${elapsedSeconds} seconds ago`;
  } else if (elapsedMinutes < 60) {
    return `${elapsedMinutes} minutes ago`;
  } else if (elapsedHours < 24) {
    return `${elapsedHours} hours ago`;
  } else if (elapsedDays < 7) {
    return `${elapsedDays} days ago`;
  } else if (elapsedWeeks < 4) {
    return `${elapsedWeeks} weeks ago`;
  } else if (elapsedMonths < 12) {
    return `${elapsedMonths} months ago`;
  } else {
    return `${elapsedYears} years ago`;
  }
}


export function truncateString(str: string, k: number): string {
  if (k >= str.length) {
    return str;
  } else {
    let truncated = str.substring(0, k);

    // If the substring ends within a word, find the last space character
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    if (lastSpaceIndex !== -1) {
      truncated = truncated.substring(0, lastSpaceIndex);
    }

    return truncated + "...";
  }
}
