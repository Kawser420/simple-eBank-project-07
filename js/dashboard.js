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
    this.loadNotifications();
  }

  checkAuthentication() {
    if (!UserSession.isLoggedIn()) {
      window.location.href = "index.html";
      return;
    }
    this.currentUser = UserSession.getCurrentUser();

    if (!this.currentUser) {
      UserSession.logout();
      window.location.href = "index.html";
      return;
    }
  }

  loadUserData() {
    if (!this.currentUser) return;

    const updateElement = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    };

    updateElement("user-name", this.currentUser.name);
    updateElement("user-email", this.currentUser.email);
    updateElement("user-phone", this.currentUser.phone || "Not provided");

    const avatar = document.getElementById("user-avatar");
    if (avatar) {
      avatar.src = this.currentUser.avatar;
      avatar.alt = this.currentUser.name;
    }

    // Update balance
    this.updateBalanceDisplay();

    // Load recent transactions
    this.loadRecentTransactions();

    // Update account number
    const accountNumber = document.getElementById("account-number");
    if (accountNumber) {
      accountNumber.textContent = `•••• ${this.currentUser.id.slice(-4)}`;
    }
  }

  updateBalanceDisplay() {
    const balanceElement = document.getElementById("account-balance");
    if (balanceElement && this.currentUser) {
      balanceElement.textContent = BankUtilities.formatCurrency(
        this.currentUser.balance
      );
    }
  }

  loadRecentTransactions() {
    const container = document.getElementById("recent-transactions");
    const tableBody = document.getElementById("transactions-table");

    if (!container && !tableBody) return;

    const transactions = this.currentUser.transactions || [];
    const recentTransactions = transactions.slice(0, 5);

    // Update recent transactions container
    if (container) {
      if (recentTransactions.length === 0) {
        container.innerHTML = `
          <div class="text-center py-8">
            <div class="text-4xl mb-4">📊</div>
            <p class="text-gray-500">No transactions yet</p>
            <p class="text-sm text-gray-400">Your transactions will appear here</p>
          </div>
        `;
      } else {
        container.innerHTML = recentTransactions
          .map((transaction) => this.createTransactionHTML(transaction))
          .join("");
      }
    }

    // Update transactions table
    if (tableBody) {
      if (transactions.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="4" class="text-center py-8">
              <div class="text-4xl mb-4">📊</div>
              <p class="text-gray-500">No transactions yet</p>
            </td>
          </tr>
        `;
      } else {
        tableBody.innerHTML = transactions
          .map((transaction) => this.createTransactionTableRow(transaction))
          .join("");
      }
    }
  }

  createTransactionHTML(transaction) {
    const typeConfig = {
      deposit: {
        color: "text-success",
        bgColor: "bg-success",
        icon: "⬇️",
        prefix: "+",
      },
      withdrawal: {
        color: "text-error",
        bgColor: "bg-error",
        icon: "⬆️",
        prefix: "-",
      },
      transfer: {
        color: "text-info",
        bgColor: "bg-info",
        icon: "🔄",
        prefix: "-",
      },
    };

    const config = typeConfig[transaction.type] || typeConfig.deposit;

    return `
      <div class="transaction-item flex items-center justify-between p-4 bg-base-200 rounded-lg transition-all duration-200 hover:bg-base-300 hover:shadow-md">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center ${
            config.bgColor
          } text-white">
            ${config.icon}
          </div>
          <div>
            <p class="font-semibold">${transaction.description}</p>
            <p class="text-sm text-gray-500">${BankUtilities.formatDate(
              transaction.timestamp
            )}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-semibold ${config.color}">
            ${config.prefix}${BankUtilities.formatCurrency(transaction.amount)}
          </p>
          <p class="text-sm text-gray-500">${transaction.id}</p>
        </div>
      </div>
    `;
  }

  createTransactionTableRow(transaction) {
    const typeConfig = {
      deposit: {
        color: "text-success",
        badge: "badge-success",
        text: "Deposit",
      },
      withdrawal: {
        color: "text-error",
        badge: "badge-error",
        text: "Withdrawal",
      },
      transfer: { color: "text-info", badge: "badge-info", text: "Transfer" },
    };

    const config = typeConfig[transaction.type] || typeConfig.deposit;

    return `
      <tr class="hover:bg-base-200 transition-colors">
        <td>${BankUtilities.formatDate(transaction.timestamp)}</td>
        <td>
          <div>
            <p class="font-medium">${transaction.description}</p>
            <p class="text-sm text-gray-500">${transaction.id}</p>
          </div>
        </td>
        <td class="${config.color} font-semibold">
          ${
            transaction.type === "deposit" ? "+" : "-"
          }${BankUtilities.formatCurrency(transaction.amount)}
        </td>
        <td>
          <span class="badge ${config.badge} badge-sm">${config.text}</span>
        </td>
      </tr>
    `;
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

    // Modal transfer form
    const transferFormModal = document.getElementById("transfer-form-modal");
    if (transferFormModal) {
      transferFormModal.addEventListener("submit", (e) =>
        this.handleTransferModal(e)
      );
    }

    // Navigation
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleNavigation(e));
    });

    // Quick actions
    document.querySelectorAll(".quick-action").forEach((action) => {
      action.addEventListener("click", (e) => this.handleQuickAction(e));
    });

    // View all transactions
    const viewAllBtn = document.querySelector(
      'a[href="#view-all-transactions"]'
    );
    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleNavigation({
          currentTarget: document.querySelector(
            '[data-target="transactions-section"]'
          ),
        });
      });
    }

    // Download transactions
    const downloadBtn = document.getElementById("download-transactions");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () =>
        this.handleDownloadTransactions()
      );
    }

    // Profile update form
    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
      profileForm.addEventListener("submit", (e) =>
        this.handleProfileUpdate(e)
      );
    }

    // Security settings
    document.querySelectorAll(".security-toggle").forEach((toggle) => {
      toggle.addEventListener("change", (e) => this.handleSecurityToggle(e));
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

    if (amount > 10000) {
      BankUtilities.showNotification(
        "Maximum deposit amount is $10,000",
        "error"
      );
      return;
    }

    if (pin !== "1234") {
      BankUtilities.showNotification("Invalid security PIN", "error");
      return;
    }

    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="loading loading-spinner"></span> Processing...';
    submitBtn.disabled = true;

    try {
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
        category: "deposit",
      });

      // Update UI
      this.updateBalanceDisplay();
      this.loadRecentTransactions();
      this.updateStatsCards();

      BankUtilities.showNotification(
        `Successfully added ${BankUtilities.formatCurrency(
          amount
        )} to your account`,
        "success"
      );

      // Reset form
      e.target.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Close modal
      const modal = document.getElementById("add-money-modal");
      if (modal) {
        modal.close();
      }
    } catch (error) {
      BankUtilities.showNotification("Failed to process deposit", "error");
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
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

    if (amount > 5000) {
      BankUtilities.showNotification(
        "Maximum withdrawal amount is $5,000",
        "error"
      );
      return;
    }

    if (pin !== "1234") {
      BankUtilities.showNotification("Invalid security PIN", "error");
      return;
    }

    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="loading loading-spinner"></span> Processing...';
    submitBtn.disabled = true;

    try {
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
        category: "withdrawal",
      });

      // Update UI
      this.updateBalanceDisplay();
      this.loadRecentTransactions();
      this.updateStatsCards();

      BankUtilities.showNotification(
        `Successfully withdrew ${BankUtilities.formatCurrency(amount)}`,
        "success"
      );

      // Reset form
      e.target.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Close modal
      const modal = document.getElementById("cash-out-modal");
      if (modal) {
        modal.close();
      }
    } catch (error) {
      BankUtilities.showNotification("Failed to process withdrawal", "error");
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  async handleTransfer(e) {
    e.preventDefault();
    await this.processTransfer(e.target, "transfer-section");
  }

  async handleTransferModal(e) {
    e.preventDefault();
    await this.processTransfer(e.target, "modal");
  }

  async processTransfer(form, source) {
    const amount = BankUtilities.getNumericInputValue(
      source === "modal" ? "transfer-amount-modal" : "transfer-amount"
    );
    const recipient = BankUtilities.getInputValue(
      source === "modal" ? "transfer-recipient-modal" : "transfer-recipient"
    );
    const description = BankUtilities.getInputValue(
      source === "modal" ? "transfer-description-modal" : "transfer-description"
    );
    const pin = BankUtilities.getInputValue(
      source === "modal" ? "transfer-pin-modal" : "transfer-pin"
    );

    if (amount <= 0) {
      BankUtilities.showNotification("Please enter a valid amount", "error");
      return;
    }

    if (amount > this.currentUser.balance) {
      BankUtilities.showNotification("Insufficient balance", "error");
      return;
    }

    if (amount > 10000) {
      BankUtilities.showNotification(
        "Maximum transfer amount is $10,000",
        "error"
      );
      return;
    }

    if (!recipient) {
      BankUtilities.showNotification("Please enter recipient details", "error");
      return;
    }

    if (pin !== "1234") {
      BankUtilities.showNotification("Invalid security PIN", "error");
      return;
    }

    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="loading loading-spinner"></span> Processing...';
    submitBtn.disabled = true;

    try {
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
        category: "transfer",
      });

      // Update UI
      this.updateBalanceDisplay();
      this.loadRecentTransactions();
      this.updateStatsCards();

      BankUtilities.showNotification(
        `Successfully transferred ${BankUtilities.formatCurrency(
          amount
        )} to ${recipient}`,
        "success"
      );

      // Reset form
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Close modal if from modal
      if (source === "modal") {
        const modal = document.getElementById("transfer-modal");
        if (modal) {
          modal.close();
        }
      }
    } catch (error) {
      BankUtilities.showNotification("Failed to process transfer", "error");
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
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

    document.querySelectorAll(".section").forEach((section) => {
      section.classList.add("hidden");
    });

    const targetSection = document.getElementById(target);
    if (targetSection) {
      targetSection.classList.remove("hidden");

      if (target === "transactions-section") {
        this.loadRecentTransactions();
      }
    }
  }

  handleQuickAction(e) {
    const action = e.currentTarget.dataset.action;

    switch (action) {
      case "add-money":
        document.getElementById("add-money-modal")?.showModal();
        break;
      case "cash-out":
        document.getElementById("cash-out-modal")?.showModal();
        break;
      case "transfer":
        document.getElementById("transfer-modal")?.showModal();
        break;
      case "transactions":
        this.handleNavigation({
          currentTarget: document.querySelector(
            '[data-target="transactions-section"]'
          ),
        });
        break;
    }
  }

  handleDownloadTransactions() {
    const transactions = this.currentUser.transactions || [];
    if (transactions.length === 0) {
      BankUtilities.showNotification("No transactions to download", "warning");
      return;
    }

    BankUtilities.downloadAsPDF(
      transactions,
      `transactions_${this.currentUser.name}_${
        new Date().toISOString().split("T")[0]
      }`
    );
  }

  async handleProfileUpdate(e) {
    e.preventDefault();

    const name = BankUtilities.getInputValue("profile-name");
    const email = BankUtilities.getInputValue("profile-email");
    const phone = BankUtilities.getInputValue("profile-phone");

    if (name.length < 2) {
      BankUtilities.showNotification("Please enter a valid name", "error");
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

    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="loading loading-spinner"></span> Updating...';
    submitBtn.disabled = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const success = UserSession.updateUserProfile({
        name,
        email,
        phone,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=3b82f6&color=fff&size=128`,
      });

      if (success) {
        this.currentUser = UserSession.getCurrentUser();
        this.loadUserData();
        BankUtilities.showNotification(
          "Profile updated successfully",
          "success"
        );
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      BankUtilities.showNotification("Failed to update profile", "error");
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  handleSecurityToggle(e) {
    const setting = e.target.id;
    const isEnabled = e.target.checked;

    BankUtilities.showNotification(
      `${setting.replace(/-/g, " ")} ${isEnabled ? "enabled" : "disabled"}`,
      "info"
    );

    // Update user preferences
    const user = UserSession.getCurrentUser();
    if (user) {
      if (!user.security) user.security = {};
      user.security[setting] = isEnabled;
      UserSession.updateUserProfile({ security: user.security });
    }
  }

  initializeCharts() {
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
    const updateStat = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = BankUtilities.formatCurrency(value);
    };

    updateStat("total-deposits", stats.totalDeposits);
    updateStat("total-withdrawals", stats.totalWithdrawals);
    updateStat("total-transfers", stats.totalTransfers);
  }

  loadNotifications() {
    const notifications = [
      {
        id: 1,
        type: "info",
        message: "New security features available",
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: 2,
        type: "success",
        message: "Your account has been successfully verified",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
      },
    ];

    const notificationBadge = document.querySelector(".indicator-item");
    if (notificationBadge) {
      notificationBadge.textContent = notifications.filter(
        (n) => !n.read
      ).length;
    }

    const notificationDropdown = document.querySelector(
      ".dropdown-content .card-body"
    );
    if (notificationDropdown) {
      notificationDropdown.innerHTML = `
        <span class="font-bold text-lg">Notifications (${
          notifications.length
        })</span>
        <div class="mt-2 space-y-2 max-h-60 overflow-y-auto">
          ${notifications
            .map(
              (notification) => `
            <div class="alert alert-${notification.type}">
              <span>${notification.message}</span>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    }
  }

  updateDashboard() {
    this.updateBalanceDisplay();
    this.loadRecentTransactions();
    this.updateStatsCards();
    this.loadNotifications();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new DashboardManager();
});
