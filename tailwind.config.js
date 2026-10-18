/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink: "#010204", navy: "#070c1c", panel: "#111936", brand: "#2B4C7E", brand2: "#1B365D" },
    screens: { "3xl": "1920px" },
    fontFamily: { sans: ["Inter", "system-ui", "sans-serif"], script: ["Caveat", "cursive"] },
    keyframes: {
      float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      rise: { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "none" } },
      marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      fadehero: { from: { opacity: "0" }, to: { opacity: ".5" } },
      modalin: { from: { opacity: "0", transform: "translateY(26px) scale(.96)" }, to: { opacity: "1", transform: "none" } },
      modalout: { from: { opacity: "1", transform: "none" }, to: { opacity: "0", transform: "translateY(12px) scale(.98)" } },
      fadein: { from: { opacity: "0" }, to: { opacity: "1" } },
      fadeout: { from: { opacity: "1" }, to: { opacity: "0" } },
    },
    animation: {
      loadThenFloat : "rise 1s ease-out forwards, float 3s ease-in-out infinite 1s",
      float: "float 5s ease-in-out infinite", rise: "rise .9s ease-out both", marquee: "marquee 15s linear infinite",
      fadehero: "fadehero 1.4s ease-out both",
      // curvas suaves (nada de expo-out): con una curva agresiva el fundido llega al 80% en 60ms y se ve como un corte
      modalin: "modalin 520ms cubic-bezier(.22,.61,.36,1) both",
      modalout: "modalout 260ms cubic-bezier(.4,0,1,1) both",
      fadein: "fadein 460ms cubic-bezier(.22,.61,.36,1) both",
      fadeout: "fadeout 240ms cubic-bezier(.4,0,1,1) both",
    },
  } },
  plugins: [],
};
