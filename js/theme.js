// Advanced Theme Management
class ThemeManager {
  constructor() {
    this.themes = [
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
    ];
    this.init();
  }

  init() {
    this.loadTheme();
    this.createThemeSelector();
    this.attachEventListeners();
  }

  loadTheme() {
    const savedTheme = StorageManager.getItem("bankTheme") || "business";
    this.setTheme(savedTheme);
  }

  setTheme(themeName) {
    if (!this.themes.includes(themeName)) {
      themeName = "business";
    }

    document.documentElement.setAttribute("data-theme", themeName);
    StorageManager.setItem("bankTheme", themeName);

    // Update theme selector if it exists
    const themeSelector = document.getElementById("theme-selector");
    if (themeSelector) {
      themeSelector.value = themeName;
    }
  }

  createThemeSelector() {
    const existingSelector = document.getElementById("theme-selector");
    if (existingSelector) return;

    // Create theme selector for dashboard
    if (document.getElementById("theme-section")) {
      const themeSection = document.getElementById("theme-section");
      themeSection.innerHTML = `
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-semibold">Theme</span>
          </label>
          <select class="select select-bordered w-full" id="theme-selector">
            ${this.themes
              .map(
                (theme) =>
                  `<option value="${theme}">${this.formatThemeName(
                    theme
                  )}</option>`
              )
              .join("")}
          </select>
        </div>
      `;

      const selector = document.getElementById("theme-selector");
      selector.value = StorageManager.getItem("bankTheme") || "business";
      selector.addEventListener("change", (e) => {
        this.setTheme(e.target.value);
        BankUtilities.showNotification(
          `Theme changed to ${this.formatThemeName(e.target.value)}`,
          "success"
        );
      });
    }
  }

  formatThemeName(theme) {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }

  attachEventListeners() {
    // Theme toggle for mobile
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const currentTheme = StorageManager.getItem("bankTheme") || "business";
        const isDark =
          currentTheme === "dark" || currentTheme.includes("night");
        this.setTheme(isDark ? "light" : "dark");
      });
    }
  }

  // Get current theme
  getCurrentTheme() {
    return StorageManager.getItem("bankTheme") || "business";
  }

  // Check if current theme is dark
  isDarkTheme() {
    const theme = this.getCurrentTheme();
    return theme === "dark" || theme.includes("night") || theme === "business";
  }
}

// Initialize theme manager
document.addEventListener("DOMContentLoaded", () => {
  window.themeManager = new ThemeManager();
});
