// Social Authentication Simulation
class SocialAuthManager {
  constructor() {
    this.providers = {
      google: {
        name: "Google",
        color: "bg-red-500 hover:bg-red-600",
        icon: "🔍",
      },
      facebook: {
        name: "Facebook",
        color: "bg-blue-600 hover:bg-blue-700",
        icon: "👤",
      },
      github: {
        name: "GitHub",
        color: "bg-gray-800 hover:bg-gray-900",
        icon: "💻",
      },
      twitter: {
        name: "Twitter",
        color: "bg-sky-500 hover:bg-sky-600",
        icon: "🐦",
      },
      linkedin: {
        name: "LinkedIn",
        color: "bg-blue-700 hover:bg-blue-800",
        icon: "💼",
      },
    };
    this.init();
  }

  init() {
    this.createSocialButtons();
  }

  createSocialButtons() {
    const containers = document.querySelectorAll(".social-auth-container");

    containers.forEach((container) => {
      if (container.children.length === 0) {
        container.innerHTML = Object.entries(this.providers)
          .map(
            ([key, provider]) => `
          <button class="btn btn-outline w-full social-login-btn mb-3 transition-all duration-300 transform hover:scale-105" data-provider="${key}">
            <span class="text-xl mr-2">${provider.icon}</span>
            Continue with ${provider.name}
          </button>
        `
          )
          .join("");
      }
    });
  }

  // Simulate social login (in real app, this would use OAuth)
  async simulateSocialLogin(provider) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: `social_${provider}_${Date.now()}`,
            name: `${this.providers[provider].name} User`,
            email: `user@${provider}.com`,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              this.providers[provider].name + " User"
            )}&background=3b82f6&color=fff`,
          },
        });
      }, 2000);
    });
  }
}

// Initialize social auth
document.addEventListener("DOMContentLoaded", () => {
  new SocialAuthManager();
});
