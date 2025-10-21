// Authentication System
class AuthManager {
  constructor() {
    this.init();
  }

  init() {
    this.checkExistingSession();
    this.attachEventListeners();
    this.initializePasswordToggle();
  }

  checkExistingSession() {
    const currentPath = window.location.pathname;

    if (UserSession.isLoggedIn()) {
      if (currentPath.includes("index.html") || currentPath.endsWith("/")) {
        window.location.href = "dashboard.html";
      }
    } else {
      if (
        !currentPath.includes("index.html") &&
        !currentPath.includes("signup.html") &&
        !currentPath.endsWith("/")
      ) {
        window.location.href = "index.html";
      }
    }
  }

  attachEventListeners() {
    // Login form
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    // Signup form
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => this.handleSignup(e));
    }

    // Logout button
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.handleLogout());
    }

    // Forgot password
    const forgotPasswordLink = document.querySelector(
      'a[href="#forgot-password"]'
    );
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleForgotPassword();
      });
    }

    // Social login buttons
    document.querySelectorAll(".social-login-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleSocialLogin(e));
    });

    // Real-time password validation for signup
    const signupPassword = document.getElementById("signup-password");
    if (signupPassword) {
      signupPassword.addEventListener("input", (e) =>
        this.validatePasswordStrength(e.target.value)
      );
    }
  }

  initializePasswordToggle() {
    // Add password toggle functionality
    document.querySelectorAll('input[type="password"]').forEach((input) => {
      const parent = input.parentElement;
      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className =
        "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700";
      toggleBtn.innerHTML = "👁️";
      toggleBtn.addEventListener("click", () => {
        const type =
          input.getAttribute("type") === "password" ? "text" : "password";
        input.setAttribute("type", type);
        toggleBtn.innerHTML = type === "password" ? "👁️" : "🔒";
      });

      if (!parent.querySelector(".password-toggle")) {
        parent.style.position = "relative";
        toggleBtn.classList.add("password-toggle");
        parent.appendChild(toggleBtn);
      }
    });
  }

  validatePasswordStrength(password) {
    const validation = BankUtilities.validatePassword(password);
    const strengthIndicator = document.getElementById("password-strength");

    if (strengthIndicator) {
      if (password.length === 0) {
        strengthIndicator.innerHTML = "";
        return;
      }

      const requirements = Object.entries(validation.requirements)
        .map(([key, met]) => {
          const label = {
            minLength: "At least 8 characters",
            hasUpperCase: "One uppercase letter",
            hasLowerCase: "One lowercase letter",
            hasNumbers: "One number",
            hasSpecialChar: "One special character",
          }[key];

          return `<div class="flex items-center text-sm ${
            met ? "text-success" : "text-error"
          }">
          <span class="mr-2">${met ? "✓" : "✗"}</span> ${label}
        </div>`;
        })
        .join("");

      strengthIndicator.innerHTML = requirements;
    }
  }

  async handleLogin(e) {
    e.preventDefault();

    const email = BankUtilities.getInputValue("login-email");
    const password = BankUtilities.getInputValue("login-password");
    const rememberMe = document.getElementById("remember-me")?.checked;

    // Validation
    if (!BankUtilities.validateEmail(email)) {
      BankUtilities.showNotification(
        "Please enter a valid email address",
        "error"
      );
      return;
    }

    if (password.length < 6) {
      BankUtilities.showNotification(
        "Password must be at least 6 characters",
        "error"
      );
      return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="loading loading-spinner"></span> Logging in...';
    submitBtn.disabled = true;

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = StorageManager.getItem("bankUsers") || [];
          const user = users.find(
            (u) => u.email === email && u.password === password
          );

          if (user) {
            resolve(user);
          } else {
            reject(new Error("Invalid email or password"));
          }
        }, 1500);
      })
        .then((user) => {
          UserSession.login({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            balance: user.balance || 1000,
            transactions: user.transactions || [],
            avatar: user.avatar,
            lastLogin: new Date().toISOString(),
          });

          BankUtilities.showNotification(
            "Login successful! Redirecting...",
            "success"
          );

          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1000);
        })
        .catch((error) => {
          BankUtilities.showNotification(error.message, "error");
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        });
    } catch (error) {
      BankUtilities.showNotification("An error occurred during login", "error");
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  async handleSignup(e) {
    e.preventDefault();

    const name = BankUtilities.getInputValue("signup-name");
    const email = BankUtilities.getInputValue("signup-email");
    const phone = BankUtilities.getInputValue("signup-phone");
    const password = BankUtilities.getInputValue("signup-password");
    const confirmPassword = BankUtilities.getInputValue(
      "signup-confirm-password"
    );
    const terms = document.getElementById("signup-terms")?.checked;

    if (name.length < 2) {
      BankUtilities.showNotification("Please enter your full name", "error");
      return;
    }

    if (!BankUtilities.validateEmail(email)) {
      BankUtilities.showNotification(
        "Please enter a valid email address",
        "error"
      );
      return;
    }

    if (!BankUtilities.validatePhone(phone)) {
      BankUtilities.showNotification(
        "Please enter a valid phone number",
        "error"
      );
      return;
    }

    const passwordValidation = BankUtilities.validatePassword(password);
    if (!passwordValidation.isValid) {
      BankUtilities.showNotification(
        "Password does not meet security requirements",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      BankUtilities.showNotification("Passwords do not match", "error");
      return;
    }

    if (!terms) {
      BankUtilities.showNotification(
        "Please accept the terms and conditions",
        "error"
      );
      return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="loading loading-spinner"></span> Creating account...';
    submitBtn.disabled = true;

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = StorageManager.getItem("bankUsers") || [];
          if (users.find((u) => u.email === email)) {
            reject(new Error("An account with this email already exists"));
            return;
          }

          // Create new user
          const newUser = {
            id: "user_" + Date.now(),
            name,
            email,
            phone,
            password,
            balance: 1000,
            transactions: [],
            createdAt: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              name
            )}&background=3b82f6&color=fff&size=128`,
            isVerified: false,
            security: {
              twoFactorEnabled: false,
              loginNotifications: true,
            },
          };

          users.push(newUser);
          StorageManager.setItem("bankUsers", users);
          resolve(newUser);
        }, 2000);
      })
        .then((newUser) => {
          UserSession.login({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            balance: newUser.balance,
            transactions: newUser.transactions,
            avatar: newUser.avatar,
          });

          BankUtilities.showNotification(
            "Account created successfully! Welcome to WorldBank!",
            "success"
          );

          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1500);
        })
        .catch((error) => {
          BankUtilities.showNotification(error.message, "error");
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        });
    } catch (error) {
      BankUtilities.showNotification(
        "An error occurred during signup",
        "error"
      );
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  async handleSocialLogin(e) {
    const provider = e.currentTarget.dataset.provider;
    const providers = {
      google: { name: "Google", color: "bg-red-500", icon: "🔍" },
      facebook: { name: "Facebook", color: "bg-blue-600", icon: "👤" },
      github: { name: "GitHub", color: "bg-gray-800", icon: "💻" },
      twitter: { name: "Twitter", color: "bg-sky-500", icon: "🐦" },
    };

    const providerInfo = providers[provider];
    if (!providerInfo) return;

    // Show loading
    const originalHTML = e.currentTarget.innerHTML;
    e.currentTarget.innerHTML = `<span class="loading loading-spinner"></span> Connecting to ${providerInfo.name}...`;
    e.currentTarget.disabled = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const socialUser = {
        id: `social_${provider}_${Date.now()}`,
        name: `${providerInfo.name} User`,
        email: `user@${provider}.com`,
        balance: 1500,
        transactions: [],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          providerInfo.name + " User"
        )}&background=10b981&color=fff&size=128`,
        isSocial: true,
        lastLogin: new Date().toISOString(),
      };

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

  handleForgotPassword() {
    BankUtilities.showNotification(
      "Password reset feature coming soon! For now, please contact support.",
      "info"
    );
  }

  handleLogout() {
    UserSession.logout();
    BankUtilities.showNotification("Logged out successfully", "info");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new AuthManager();
});
