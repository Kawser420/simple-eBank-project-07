// Enhanced utility functions
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

  // Get text content as number
  static getTextAsNumber(id) {
    const element = document.getElementById(id);
    if (!element) return 0;

    const text = element.textContent || element.innerText;
    const number = parseFloat(text.replace(/[^\d.-]/g, ""));
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
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} fixed top-4 right-4 z-50 max-w-md shadow-lg transform transition-transform duration-300 translate-x-full`;
    notification.innerHTML = `
      <div class="flex items-center">
        <span>${message}</span>
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
      notification.classList.remove("translate-x-0");
      notification.classList.add("translate-x-full");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
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

// Local Storage Management
class StorageManager {
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
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

// User Session Management
class UserSession {
  static login(userData) {
    StorageManager.setItem("currentUser", userData);
    StorageManager.setItem("isLoggedIn", true);
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
    }
  }

  static addTransaction(transaction) {
    const user = this.getCurrentUser();
    if (user) {
      if (!user.transactions) {
        user.transactions = [];
      }
      user.transactions.unshift({
        id: BankUtilities.generateTransactionId(),
        ...transaction,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 50 transactions
      if (user.transactions.length > 50) {
        user.transactions = user.transactions.slice(0, 50);
      }

      StorageManager.setItem("currentUser", user);
    }
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { BankUtilities, StorageManager, UserSession };
}
