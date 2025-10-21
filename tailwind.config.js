let daisyuiPlugin;
try {
  daisyuiPlugin = require("daisyui");
} catch (error) {
  console.warn(
    "DaisyUI not found. Please install it with: npm install -D daisyui"
  );
  daisyuiPlugin = null;
}

module.exports = {
  content: ["./*.html", "./js/**/*.js", "./css/**/*.css"],
  theme: {
    extend: {
      animation: {
        "slide-in": "slideIn 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "fade-in": "fadeIn 0.5s ease-in",
        "fade-out": "fadeOut 0.5s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
        "shield-pulse": "shield-pulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "bounce-slow": "bounce 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "bounce-soft": "bounce 1s ease-in-out infinite",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        slideIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideInLeft: {
          "0%": {
            opacity: "0",
            transform: "translateX(-30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        slideInRight: {
          "0%": {
            opacity: "0",
            transform: "translateX(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(59, 130, 246, 0.5)",
          },
          "50%": {
            boxShadow:
              "0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)",
          },
        },
        "shield-pulse": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.1)",
            opacity: "0.8",
          },
        },
      },
      colors: {
        "bank-primary": "#1e40af",
        "bank-secondary": "#3b82f6",
        "bank-accent": "#10b981",
        "bank-success": "#10b981",
        "bank-warning": "#f59e0b",
        "bank-error": "#ef4444",
        "bank-info": "#06b6d4",
        "bank-dark": "#1e293b",
        "bank-light": "#f8fafc",
      },
      fontFamily: {
        bank: ["Inter", "system-ui", "sans-serif"],
        "bank-mono": ["JetBrains Mono", "monospace"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        medium:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        large:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        xl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "2xl": "0 50px 100px -20px rgba(0, 0, 0, 0.25)",
        "inner-lg": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        glow: "0 0 20px rgba(59, 130, 246, 0.5)",
        "glow-lg": "0 0 50px rgba(59, 130, 246, 0.3)",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        transform: "transform",
        opacity: "opacity",
        colors:
          "color, background-color, border-color, text-decoration-color, fill, stroke",
        all: "all",
      },
      transitionDuration: {
        2000: "2000ms",
        3000: "3000ms",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        overshoot: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-premium":
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        "gradient-bank":
          "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)",
        "gradient-success": "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
        "gradient-warning": "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
        "gradient-error": "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      scale: {
        102: "1.02",
        105: "1.05",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      opacity: {
        15: "0.15",
        35: "0.35",
        65: "0.65",
        85: "0.85",
      },
      borderWidth: {
        3: "3px",
        5: "5px",
      },
      minHeight: {
        "screen-75": "75vh",
        "screen-50": "50vh",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      fontSize: {
        xxs: "0.625rem",
        "2xs": "0.5rem",
      },
      lineHeight: {
        12: "3rem",
        14: "3.5rem",
      },
    },
  },
  plugins: [
    ...(daisyuiPlugin ? [daisyuiPlugin] : []),
    function ({ addUtilities }) {
      addUtilities({
        ".text-shadow": {
          "text-shadow": "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
        ".text-shadow-lg": {
          "text-shadow":
            "0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)",
        },
        ".text-shadow-none": {
          "text-shadow": "none",
        },
      });
    },
  ],
  ...(daisyuiPlugin && {
    daisyui: {
      themes: [
        "light",
        "dark",
        "cupcake",
        "bumblebee",
        "emerald",
        "corporate",
        "synthwave",
        "retro",
        "cyberpunk",
        "valentine",
        "halloween",
        "garden",
        "forest",
        "aqua",
        "lofi",
        "pastel",
        "fantasy",
        "wireframe",
        "black",
        "luxury",
        "dracula",
        "cmyk",
        "autumn",
        "business",
        "acid",
        "lemonade",
        "night",
        "coffee",
        "winter",
        {
          worldbank: {
            primary: "#1e40af",
            secondary: "#3b82f6",
            accent: "#10b981",
            neutral: "#1f2937",
            "base-100": "#ffffff",
            info: "#06b6d4",
            success: "#10b981",
            warning: "#f59e0b",
            error: "#ef4444",
          },
        },
      ],
      darkTheme: "business",
      base: true,
      styled: true,
      utils: true,
      prefix: "",
      logs: true,
      themeRoot: ":root",
    },
  }),
};
