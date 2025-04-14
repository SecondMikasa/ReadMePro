import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toggleDarkMode = (
  currentState: { theme: string; img: string },
  setState: React.Dispatch<React.SetStateAction<{ theme: string; img: string }>>
) => {
  if (currentState.theme === "vs-dark") {
      setState({
          theme: "light", 
          img: "toggle_moon.svg" 
      });
    localStorage.setItem("editor-color-theme", "light")
    // Persist choice
  }
  else {
      setState({
          theme: "vs-dark",
          img: "toggle_sun.svg" 
      });
    localStorage.setItem("editor-color-theme", "vs-dark")
    // Persist choice
  }
}