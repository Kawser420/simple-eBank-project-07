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
    this.applyThemeTransition();
  }

  loadTheme() {
    const savedTheme = StorageManager.getItem("bankTheme") || "business";
    this.setTheme(savedTheme, false);
  }

  setTheme(themeName, showNotification = true) {
    if (!this.themes.includes(themeName)) {
      themeName = "business";
    }

    // Add transition class
    document.documentElement.classList.add("theme-transition");

    setTimeout(() => {
      document.documentElement.setAttribute("data-theme", themeName);
      StorageManager.setItem("bankTheme", themeName);

      // Update theme selector if it exists
      const themeSelector = document.getElementById("theme-selector");
      if (themeSelector) {
        themeSelector.value = themeName;
      }

      // Update mobile theme toggle
      const themeToggle = document.getElementById("theme-toggle-mobile");
      if (themeToggle) {
        const isDark = this.isDarkTheme(themeName);
        themeToggle.innerHTML = isDark ? "☀️" : "🌙";
      }

      // Remove transition class
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 300);

      if (showNotification) {
        BankUtilities.showNotification(
          `Theme changed to ${this.formatThemeName(themeName)}`,
          "success"
        );
      }
    }, 50);
  }

  applyThemeTransition() {
    const style = document.createElement("style");
    style.textContent = `
      .theme-transition * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
      }
    `;
    document.head.appendChild(style);
  }

  createThemeSelector() {
    const existingSelector = document.getElementById("theme-selector");
    if (existingSelector) return;

    // Create theme selector for dashboard
    if (document.getElementById("theme-section")) {
      const themeSection = document.getElementById("theme-section");
      themeSection.innerHTML = `
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h3 class="card-title">🎨 Theme Customization</h3>
            <div class="form-control w-full mt-4">
              <label class="label">
                <span class="label-text font-semibold">Select Theme</span>
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
            <div class="mt-4 p-4 bg-base-200 rounded-lg">
              <p class="text-sm font-semibold">Current Theme: <span id="current-theme-name">${this.formatThemeName(
                this.getCurrentTheme()
              )}</span></p>
              <p class="text-xs text-gray-500 mt-1">Changes take effect immediately</p>
            </div>
          </div>
        </div>
      `;

      const selector = document.getElementById("theme-selector");
      selector.value = this.getCurrentTheme();
      selector.addEventListener("change", (e) => {
        this.setTheme(e.target.value);
      });
    }

    // Create mobile theme toggle
    this.createMobileThemeToggle();
  }

  createMobileThemeToggle() {
    const existingToggle = document.getElementById("theme-toggle-mobile");
    if (existingToggle) return;

    const mobileMenu = document.querySelector(
      ".navbar-end .dropdown:first-child .dropdown-content"
    );
    if (mobileMenu) {
      const themeToggleItem = document.createElement("li");
      themeToggleItem.innerHTML = `
        <a class="flex items-center justify-between" id="theme-toggle-mobile">
          <span>Toggle Theme</span>
          <span>${this.isDarkTheme() ? "☀️" : "🌙"}</span>
        </a>
      `;
      mobileMenu.appendChild(themeToggleItem);

      const toggleBtn = document.getElementById("theme-toggle-mobile");
      toggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleTheme();
      });
    }
  }

  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const isDark = this.isDarkTheme(currentTheme);
    const newTheme = isDark ? "light" : "dark";
    this.setTheme(newTheme);
  }

  attachEventListeners() {
    // Theme toggle for desktop (if exists)
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        this.toggleTheme();
      });
    }
  }

  formatThemeName(theme) {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }

  // Get current theme
  getCurrentTheme() {
    return StorageManager.getItem("bankTheme") || "business";
  }

  // Check if current theme is dark
  isDarkTheme(theme = null) {
    const currentTheme = theme || this.getCurrentTheme();
    const darkThemes = [
      "dark",
      "synthwave",
      "halloween",
      "forest",
      "black",
      "luxury",
      "dracula",
      "business",
      "night",
      "coffee",
    ];
    return darkThemes.includes(currentTheme);
  }
}

// Initialize theme manager
document.addEventListener("DOMContentLoaded", () => {
  window.themeManager = new ThemeManager();
});
