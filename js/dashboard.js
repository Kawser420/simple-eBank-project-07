// Enhanced Dashboard Management
class DashboardManager {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    this.checkAuthentication();
    this.loadUserData();
    this.updateDashboard();
    this.attachEventListeners();
    this.initializeCharts();
  }

  checkAuthentication() {
    if (!UserSession.isLoggedIn()) {
      window.location.href = "index.html";
      return;
    }
    this.currentUser = UserSession.getCurrentUser();
  }

  loadUserData() {
    if (!this.currentUser) return;

    // Update user info in UI
    document.getElementById("user-name").textContent = this.currentUser.name;
    document.getElementById("user-email").textContent = this.currentUser.email;
    document.getElementById("user-avatar").src = this.currentUser.avatar;
    document.getElementById("user-avatar").alt = this.currentUser.name;

    // Update balance
    this.updateBalanceDisplay();

    // Load recent transactions
    this.loadRecentTransactions();
  }

  updateBalanceDisplay() {
    const balanceElement = document.getElementById("account-balance");
    if (balanceElement) {
      balanceElement.textContent = BankUtilities.formatCurrency(
        this.currentUser.balance
      );
    }
  }

  loadRecentTransactions() {
    const container = document.getElementById("recent-transactions");
    if (!container || !this.currentUser.transactions) return;

    const recentTransactions = this.currentUser.transactions.slice(0, 5);

    if (recentTransactions.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="text-4xl mb-4">📊</div>
          <p class="text-gray-500">No transactions yet</p>
          <p class="text-sm text-gray-400">Your transactions will appear here</p>
        </div>
      `;
      return;
    }

    container.innerHTML = recentTransactions
      .map(
        (transaction) => `
      <div class="flex items-center justify-between p-4 bg-base-200 rounded-lg transition-all duration-200 hover:bg-base-300">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center ${
            transaction.type === "deposit"
              ? "bg-success text-success-content"
              : transaction.type === "withdrawal"
              ? "bg-error text-error-content"
              : "bg-info text-info-content"
          }">
            ${
              transaction.type === "deposit"
                ? "⬇️"
                : transaction.type === "withdrawal"
                ? "⬆️"
                : "🔄"
            }
          </div>
          <div>
            <p class="font-semibold">${transaction.description}</p>
            <p class="text-sm text-gray-500">${new Date(
              transaction.timestamp
            ).toLocaleDateString()}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-semibold ${
            transaction.type === "deposit"
              ? "text-success"
              : transaction.type === "withdrawal"
              ? "text-error"
              : "text-info"
          }">
            ${
              transaction.type === "deposit" ? "+" : "-"
            }${BankUtilities.formatCurrency(transaction.amount)}
          </p>
          <p class="text-sm text-gray-500">${transaction.id}</p>
        </div>
      </div>
    `
      )
      .join("");
  }

  attachEventListeners() {
    // Add money form
    const addMoneyForm = document.getElementById("add-money-form");
    if (addMoneyForm) {
      addMoneyForm.addEventListener("submit", (e) => this.handleAddMoney(e));
    }

    // Cash out form
    const cashOutForm = document.getElementById("cash-out-form");
    if (cashOutForm) {
      cashOutForm.addEventListener("submit", (e) => this.handleCashOut(e));
    }

    // Transfer form
    const transferForm = document.getElementById("transfer-form");
    if (transferForm) {
      transferForm.addEventListener("submit", (e) => this.handleTransfer(e));
    }

    // Navigation
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleNavigation(e));
    });

    // Quick actions
    document.querySelectorAll(".quick-action").forEach((action) => {
      action.addEventListener("click", (e) => this.handleQuickAction(e));
    });
  }

  async handleAddMoney(e) {
    e.preventDefault();

    const amount = BankUtilities.getNumericInputValue("add-money-amount");
    const method = BankUtilities.getInputValue("add-money-method");
    const pin = BankUtilities.getInputValue("add-money-pin");

    if (amount <= 0) {
      BankUtilities.showNotification("Please enter a valid amount", "error");
      return;
    }

    if (pin !== "1234") {
      // In real app, this would be secure
      BankUtilities.showNotification("Invalid PIN", "error");
      return;
    }

    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="loading loading-spinner"></span> Processing...';
    submitBtn.disabled = true;

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update balance
    const newBalance = this.currentUser.balance + amount;
    UserSession.updateUserBalance(newBalance);
    this.currentUser.balance = newBalance;

    // Add transaction
    UserSession.addTransaction({
      type: "deposit",
      amount: amount,
      description: `Deposit via ${method}`,
      method: method,
    });

    // Update UI
    this.updateBalanceDisplay();
    this.loadRecentTransactions();

    BankUtilities.showNotification(
      `Successfully added ${BankUtilities.formatCurrency(amount)}`,
      "success"
    );

    // Reset form
    e.target.reset();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // Close modal if exists
    const modal = document.getElementById("add-money-modal");
    if (modal) {
      modal.close();
    }
  }

  async handleCashOut(e) {
    e.preventDefault();

    const amount = BankUtilities.getNumericInputValue("cash-out-amount");
    const method = BankUtilities.getInputValue("cash-out-method");
    const pin = BankUtilities.getInputValue("cash-out-pin");

    if (amount <= 0) {
      BankUtilities.showNotification("Please enter a valid amount", "error");
      return;
    }

    if (amount > this.currentUser.balance) {
      BankUtilities.showNotification("Insufficient balance", "error");
      return;
    }

    if (pin !== "1234") {
      BankUtilities.showNotification("Invalid PIN", "error");
      return;
    }

    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="loading loading-spinner"></span> Processing...';
    submitBtn.disabled = true;

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update balance
    const newBalance = this.currentUser.balance - amount;
    UserSession.updateUserBalance(newBalance);
    this.currentUser.balance = newBalance;

    // Add transaction
    UserSession.addTransaction({
      type: "withdrawal",
      amount: amount,
      description: `Withdrawal via ${method}`,
      method: method,
    });

    // Update UI
    this.updateBalanceDisplay();
    this.loadRecentTransactions();

    BankUtilities.showNotification(
      `Successfully withdrew ${BankUtilities.formatCurrency(amount)}`,
      "success"
    );

    // Reset form
    e.target.reset();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // Close modal if exists
    const modal = document.getElementById("cash-out-modal");
    if (modal) {
      modal.close();
    }
  }

  async handleTransfer(e) {
    e.preventDefault();

    const amount = BankUtilities.getNumericInputValue("transfer-amount");
    const recipient = BankUtilities.getInputValue("transfer-recipient");
    const description = BankUtilities.getInputValue("transfer-description");
    const pin = BankUtilities.getInputValue("transfer-pin");

    if (amount <= 0) {
      BankUtilities.showNotification("Please enter a valid amount", "error");
      return;
    }

    if (amount > this.currentUser.balance) {
      BankUtilities.showNotification("Insufficient balance", "error");
      return;
    }

    if (!recipient) {
      BankUtilities.showNotification("Please enter recipient details", "error");
      return;
    }

    if (pin !== "1234") {
      BankUtilities.showNotification("Invalid PIN", "error");
      return;
    }

    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="loading loading-spinner"></span> Processing...';
    submitBtn.disabled = true;

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Update balance
    const newBalance = this.currentUser.balance - amount;
    UserSession.updateUserBalance(newBalance);
    this.currentUser.balance = newBalance;

    // Add transaction
    UserSession.addTransaction({
      type: "transfer",
      amount: amount,
      description: `Transfer to ${recipient}`,
      note: description,
      recipient: recipient,
    });

    // Update UI
    this.updateBalanceDisplay();
    this.loadRecentTransactions();

    BankUtilities.showNotification(
      `Successfully transferred ${BankUtilities.formatCurrency(
        amount
      )} to ${recipient}`,
      "success"
    );

    // Reset form
    e.target.reset();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // Close modal if exists
    const modal = document.getElementById("transfer-modal");
    if (modal) {
      modal.close();
    }
  }

  handleNavigation(e) {
    const target = e.currentTarget.dataset.target;
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-ghost");
    });

    e.currentTarget.classList.remove("btn-ghost");
    e.currentTarget.classList.add("btn-primary");

    // Show target section, hide others
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.add("hidden");
    });

    document.getElementById(target).classList.remove("hidden");
  }

  handleQuickAction(e) {
    const action = e.currentTarget.dataset.action;

    switch (action) {
      case "add-money":
        document.getElementById("add-money-modal").showModal();
        break;
      case "cash-out":
        document.getElementById("cash-out-modal").showModal();
        break;
      case "transfer":
        document.getElementById("transfer-modal").showModal();
        break;
      case "transactions":
        window.location.href = "transactions.html";
        break;
    }
  }

  initializeCharts() {
    // Simple chart implementation using CSS and HTML
    // In a real app, you would use Chart.js or similar
    this.updateStatsCards();
  }

  updateStatsCards() {
    if (!this.currentUser.transactions) return;

    const stats = {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalTransfers: 0,
    };

    this.currentUser.transactions.forEach((transaction) => {
      if (transaction.type === "deposit") {
        stats.totalDeposits += transaction.amount;
      } else if (transaction.type === "withdrawal") {
        stats.totalWithdrawals += transaction.amount;
      } else if (transaction.type === "transfer") {
        stats.totalTransfers += transaction.amount;
      }
    });

    // Update stats cards
    const depositsElement = document.getElementById("total-deposits");
    const withdrawalsElement = document.getElementById("total-withdrawals");
    const transfersElement = document.getElementById("total-transfers");

    if (depositsElement)
      depositsElement.textContent = BankUtilities.formatCurrency(
        stats.totalDeposits
      );
    if (withdrawalsElement)
      withdrawalsElement.textContent = BankUtilities.formatCurrency(
        stats.totalWithdrawals
      );
    if (transfersElement)
      transfersElement.textContent = BankUtilities.formatCurrency(
        stats.totalTransfers
      );
  }

  updateDashboard() {
    this.updateBalanceDisplay();
    this.loadRecentTransactions();
    this.updateStatsCards();
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DashboardManager();
});
