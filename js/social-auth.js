class SocialAuthManager {
  constructor() {
    this.providers = {
      google: {
        name: "Google",
        color: "bg-red-500 hover:bg-red-600 border-red-500",
        icon: "G",
        textColor: "text-white",
      },
      facebook: {
        name: "Facebook",
        color: "bg-blue-600 hover:bg-blue-700 border-blue-600",
        icon: "F",
        textColor: "text-white",
      },
      github: {
        name: "GitHub",
        color: "bg-gray-800 hover:bg-gray-900 border-gray-800",
        icon: "G",
        textColor: "text-white",
      },
      X: {
        name: "Twitter",
        color: "bg-sky-500 hover:bg-sky-600 border-sky-500",
        icon: "X",
        textColor: "text-white",
      },
      linkedin: {
        name: "LinkedIn",
        color: "bg-blue-700 hover:bg-blue-800 border-blue-700",
        icon: "L",
        textColor: "text-white",
      },
    };
    this.init();
  }

  init() {
    this.createSocialButtons();
    this.attachSocialEventListeners();
  }

  createSocialButtons() {
    const containers = document.querySelectorAll(".social-auth-container");

    containers.forEach((container) => {
      if (container.children.length === 0) {
        container.innerHTML = Object.entries(this.providers)
          .map(
            ([key, provider]) => `
          <button class="btn w-full social-login-btn mb-3 transition-all duration-300 transform hover:scale-105 ${provider.color} ${provider.textColor} border-2" data-provider="${key}">
            <span class="text-xl mr-2">${provider.icon}</span>
            Continue with ${provider.name}
          </button>
        `
          )
          .join("");
      }
    });
  }

  attachSocialEventListeners() {
    document.querySelectorAll(".social-login-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleSocialLogin(e));
    });
  }

  // social login
  async handleSocialLogin(e) {
    const provider = e.currentTarget.dataset.provider;
    const providerInfo = this.providers[provider];

    if (!providerInfo) {
      BankUtilities.showNotification("Unsupported login provider", "error");
      return;
    }

    // Show loading
    const originalHTML = e.currentTarget.innerHTML;
    e.currentTarget.innerHTML = `<span class="loading loading-spinner"></span> Connecting to ${providerInfo.name}...`;
    e.currentTarget.disabled = true;

    try {
      await this.simulateSocialLogin(provider);

      const socialUser = this.generateSocialUser(provider, providerInfo);

      const users = StorageManager.getItem("bankUsers") || [];
      let existingUser = users.find((u) => u.email === socialUser.email);

      if (existingUser) {
        existingUser.lastLogin = new Date().toISOString();
        StorageManager.setItem("bankUsers", users);
        socialUser.balance = existingUser.balance;
        socialUser.transactions = existingUser.transactions;
      } else {
        users.push(socialUser);
        StorageManager.setItem("bankUsers", users);
      }

      UserSession.login(socialUser);

      BankUtilities.showNotification(
        `Successfully signed in with ${providerInfo.name}!`,
        "success"
      );

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } catch (error) {
      BankUtilities.showNotification(
        `Failed to sign in with ${providerInfo.name}`,
        "error"
      );
      e.currentTarget.innerHTML = originalHTML;
      e.currentTarget.disabled = false;
    }
  }

  async simulateSocialLogin(provider) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.1) {
          reject(new Error(`${provider} authentication failed`));
        } else {
          resolve({
            success: true,
            user: {
              name: `${this.providers[provider].name} User`,
              email: `user@${provider}.com`,
            },
          });
        }
      }, 2000);
    });
  }

  generateSocialUser(provider, providerInfo) {
    const timestamp = Date.now();
    return {
      id: `social_${provider}_${timestamp}`,
      name: `${providerInfo.name} User`,
      email: `user.${timestamp}@${provider}.com`,
      phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      balance: 1500,
      transactions: this.generateInitialTransactions(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        providerInfo.name + " User"
      )}&background=10b981&color=fff&size=128`,
      isSocial: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      security: {
        twoFactorEnabled: false,
        loginNotifications: true,
      },
    };
  }

  generateInitialTransactions() {
    const transactions = [];
    const types = ["deposit", "withdrawal"];
    const descriptions = [
      "Initial account funding",
      "Welcome bonus",
      "Account setup",
      "Mobile deposit",
    ];

    for (let i = 0; i < 3; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const amount =
        type === "deposit"
          ? Math.floor(Math.random() * 500) + 100
          : Math.floor(Math.random() * 200) + 10;

      transactions.push({
        id: BankUtilities.generateTransactionId(),
        type: type,
        amount: amount,
        description:
          descriptions[Math.floor(Math.random() * descriptions.length)],
        timestamp: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: "completed",
      });
    }

    return transactions;
  }

  handleSocialCallback(provider, data) {
    console.log(`Social login callback for ${provider}:`, data);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new SocialAuthManager();
});

// social auth end
// --------------------------------------->>>
