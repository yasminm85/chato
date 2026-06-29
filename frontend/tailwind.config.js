/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF8",
        ink: "#0D0C0C",
        blue: "#1933CC",
        bluePale: "#D6DCFF",
        yellow: "#FFE04B",
        yellowDim: "#FFF9D4",
        gray: "#E8E4DC",
        grayMid: "#B8B2AA",
        green: "#00C27C",
        white: "#FFFFFF"
      },
      fontFamily: {
        sg: ['"Space Grotesk"', 'sans-serif'],
        dm: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      boxShadow: {
        'nb': '4px 4px 0 #0D0C0C',
        'nb-sm': '2px 2px 0 #0D0C0C',
        'nb-btn': '3px 3px 0 #0D0C0C',
        'nb-btn-hover': '1.5px 1.5px 0 #0D0C0C',
        'nb-hover': '10px 10px 0 #0D0C0C',
      },
      borderWidth: {
        '2': '2px',
        '3': '3px',
      }
    },
  },
  plugins: [],
}