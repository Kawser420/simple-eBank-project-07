// Enhanced utility functions with improved error handling
class BankUtilities {
  // Get input field value
  static getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
  }

  // Get numeric input value
  static getNumericInputValue(id) {
    const value = this.getInputValue(id);
    const number = parseFloat(value);
    return isNaN(number) ? 0 : number;
  }

  // Format currency
  static formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  // Show notification
  static showNotification(message, type = "info") {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll(
      ".custom-notification"
    );
    existingNotifications.forEach((notification) => notification.remove());

    const notification = document.createElement("div");
    notification.className = `custom-notification alert alert-${type} fixed top-4 right-4 z-50 max-w-md shadow-lg transform transition-all duration-300 translate-x-full`;
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <span>${message}</span>
        <button class="btn btn-ghost btn-xs" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
      notification.classList.add("translate-x-0");
    }, 100);

    // Remove after delay
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.remove("translate-x-0");
        notification.classList.add("translate-x-full");
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  }

  // Validate email
  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Validate phone
  static validatePhone(phone) {
    const re = /^\+?[\d\s-()]{10,}$/;
    return re.test(phone);
  }

  // Generate random transaction ID
  static generateTransactionId() {
    return (
      "TXN" + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase()
    );
  }

  // Validate password strength
  static validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
      },
    };
  }

  // Format date
  static formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  // Download data as PDF (simulated)
  static downloadAsPDF(data, filename) {
    // In a real application, this would generate an actual PDF
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification(
      `Downloading ${filename} as JSON (PDF simulation)`,
      "info"
    );
  }

  // Debounce function
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Enhanced Local Storage Management
class StorageManager {
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      BankUtilities.showNotification("Error saving data", "error");
      return false;
    }
  }

  static getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage:", error);
      return false;
    }
  }

  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  }
}

// Enhanced User Session Management
class UserSession {
  static login(userData) {
    StorageManager.setItem("currentUser", userData);
    StorageManager.setItem("isLoggedIn", true);
    StorageManager.setItem("lastLogin", new Date().toISOString());
  }

  static logout() {
    StorageManager.removeItem("currentUser");
    StorageManager.setItem("isLoggedIn", false);
  }

  static getCurrentUser() {
    return StorageManager.getItem("currentUser");
  }

  static isLoggedIn() {
    return StorageManager.getItem("isLoggedIn") === true;
  }

  static updateUserBalance(newBalance) {
    const user = this.getCurrentUser();
    if (user) {
      user.balance = newBalance;
      StorageManager.setItem("currentUser", user);

      // Also update in bankUsers array
      const users = StorageManager.getItem("bankUsers") || [];
      const userIndex = users.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].balance = newBalance;
        StorageManager.setItem("bankUsers", users);
      }
    }
  }

  static addTransaction(transaction) {
    const user = this.getCurrentUser();
    if (user) {
      if (!user.transactions) {
        user.transactions = [];
      }

      const newTransaction = {
        id: BankUtilities.generateTransactionId(),
        ...transaction,
        timestamp: new Date().toISOString(),
        status: "completed",
      };

      user.transactions.unshift(newTransaction);

      // Keep only last 100 transactions
      if (user.transactions.length > 100) {
        user.transactions = user.transactions.slice(0, 100);
      }

      StorageManager.setItem("currentUser", user);

      // Also update in bankUsers array
      const users = StorageManager.getItem("bankUsers") || [];
      const userIndex = users.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        if (!users[userIndex].transactions) {
          users[userIndex].transactions = [];
        }
        users[userIndex].transactions.unshift(newTransaction);
        if (users[userIndex].transactions.length > 100) {
          users[userIndex].transactions = users[userIndex].transactions.slice(
            0,
            100
          );
        }
        StorageManager.setItem("bankUsers", users);
      }

      return newTransaction;
    }
  }

  static updateUserProfile(profileData) {
    const user = this.getCurrentUser();
    if (user) {
      Object.assign(user, profileData);
      StorageManager.setItem("currentUser", user);

      // Also update in bankUsers array
      const users = StorageManager.getItem("bankUsers") || [];
      const userIndex = users.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        Object.assign(users[userIndex], profileData);
        StorageManager.setItem("bankUsers", users);
      }

      return true;
    }
    return false;
  }
}
