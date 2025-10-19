// Enhanced Authentication System
class AuthManager {
  constructor() {
    this.init();
  }

  init() {
    this.checkExistingSession();
    this.attachEventListeners();
  }

  checkExistingSession() {
    if (
      UserSession.isLoggedIn() &&
      window.location.pathname.includes("index.html")
    ) {
      window.location.href = "dashboard.html";
    } else if (
      !UserSession.isLoggedIn() &&
      !window.location.pathname.includes("index.html")
    ) {
      window.location.href = "index.html";
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

    // Social login buttons
    document.querySelectorAll(".social-login-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleSocialLogin(e));
    });
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check credentials (in real app, this would be a server call)
    const users = StorageManager.getItem("bankUsers") || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      UserSession.login({
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance || 1000,
        transactions: user.transactions || [],
        avatar: user.avatar,
      });

      BankUtilities.showNotification(
        "Login successful! Redirecting...",
        "success"
      );

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      BankUtilities.showNotification("Invalid email or password", "error");
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

    // Validation
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

    if (password.length < 6) {
      BankUtilities.showNotification(
        "Password must be at least 6 characters",
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check if user already exists
    const users = StorageManager.getItem("bankUsers") || [];
    if (users.find((u) => u.email === email)) {
      BankUtilities.showNotification(
        "An account with this email already exists",
        "error"
      );
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      return;
    }

    // Create new user
    const newUser = {
      id: "user_" + Date.now(),
      name,
      email,
      phone,
      password, // In real app, this would be hashed
      balance: 1000,
      transactions: [],
      createdAt: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=3b82f6&color=fff`,
    };

    users.push(newUser);
    StorageManager.setItem("bankUsers", users);

    // Auto login
    UserSession.login({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      balance: newUser.balance,
      transactions: newUser.transactions,
      avatar: newUser.avatar,
    });

    BankUtilities.showNotification("Account created successfully!", "success");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  }

  async handleSocialLogin(e) {
    const provider = e.currentTarget.dataset.provider;

    // Show loading
    e.currentTarget.innerHTML = `<span class="loading loading-spinner"></span> Connecting to ${provider}...`;
    e.currentTarget.disabled = true;

    // Simulate social login
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create mock user for social login
    const socialUser = {
      id: `social_${provider}_${Date.now()}`,
      name: `${provider} User`,
      email: `user@${provider}.com`,
      balance: 1500,
      transactions: [],
      avatar: `https://ui-avatars.com/api/?name=${provider}+User&background=10b981&color=fff`,
      isSocial: true,
    };

    UserSession.login(socialUser);

    BankUtilities.showNotification(
      `Signed in with ${provider} successfully!`,
      "success"
    );

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  }

  handleLogout() {
    UserSession.logout();
    BankUtilities.showNotification("Logged out successfully", "info");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  }
}

// Initialize auth manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AuthManager();
});
