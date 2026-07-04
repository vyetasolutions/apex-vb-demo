/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // APEX brand tokens — derived from the Varun Beverages portfolio,
        // not a generic dark-mode default.
        apex: {
          void: "#05070D",        // base background, near-black blue
          panel: "#0D1220",       // card/panel surface
          panelLight: "#141B2E",
          cobalt: "#0057FF",      // Pepsi blue
          cobaltDeep: "#002E9E",
          crimson: "#E4002B",     // Pepsi/Mirinda red
          citrus: "#F2C400",      // Mountain Dew / Mirinda gold-orange
          lime: "#7ED321",        // 7UP green
          sting: "#FFC200",       // Sting energy yellow
          aqua: "#3FD5FF",        // Aquafina cyan
          platinum: "#E7ECF7"
        }
      },
      fontFamily: {
        display: ["'Clash Display'", "'Poppins'", "sans-serif"],
        body: ["'Inter'", "sans-serif"]
      },
      boxShadow: {
        neon: "0 0 20px rgba(0,87,255,0.45), 0 0 60px rgba(0,87,255,0.15)",
        neonRed: "0 0 20px rgba(228,0,43,0.45), 0 0 60px rgba(228,0,43,0.15)",
        glass: "0 8px 32px rgba(0,0,0,0.45)"
      },
      backgroundImage: {
        "apex-radial":
          "radial-gradient(circle at 20% 20%, rgba(0,87,255,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(228,0,43,0.2), transparent 45%), radial-gradient(circle at 50% 100%, rgba(126,211,33,0.15), transparent 40%)"
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        floaty: "floaty 3.5s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite"
      }
    }
  },
  plugins: []
};
