class TransactionsManager {
  constructor() {
    this.currentUser = null;
    this.transactions = [];
    this.filters = {
      type: "all",
      dateRange: "all",
      category: "all",
    };
    this.init();
  }

  init() {
    this.checkAuthentication();
    this.loadTransactions();
    this.attachEventListeners();
    this.initializeFilters();
  }

  checkAuthentication() {
    if (!UserSession.isLoggedIn()) {
      window.location.href = "index.html";
      return;
    }
    this.currentUser = UserSession.getCurrentUser();
  }

  loadTransactions() {
    if (!this.currentUser) return;

    this.transactions = this.currentUser.transactions || [];
    this.renderTransactions();
    this.updateTransactionStats();
  }

  renderTransactions() {
    const container = document.getElementById("transactions-container");
    const tableBody = document.getElementById("transactions-table-body");

    if (!container && !tableBody) return;

    const filteredTransactions = this.applyFilters(this.transactions);

    if (filteredTransactions.length === 0) {
      const emptyMessage = `
        <div class="col-span-full text-center py-12">
          <div class="text-6xl mb-4">📊</div>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">No transactions found</h3>
          <p class="text-gray-500">Try adjusting your filters or make your first transaction</p>
        </div>
      `;

      if (container) container.innerHTML = emptyMessage;
      if (tableBody)
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-8">${emptyMessage}</td></tr>`;
      return;
    }

    // Render grid view
    if (container) {
      container.innerHTML = filteredTransactions
        .map((transaction) => this.createTransactionCard(transaction))
        .join("");
    }

    // Render table view
    if (tableBody) {
      tableBody.innerHTML = filteredTransactions
        .map((transaction) => this.createTransactionRow(transaction))
        .join("");
    }

    this.updateResultsCount(filteredTransactions.length);
  }

  createTransactionCard(transaction) {
    const typeConfig = {
      deposit: {
        color: "text-success",
        bgColor: "bg-success",
        icon: "⬇️",
        badge: "Deposit",
      },
      withdrawal: {
        color: "text-error",
        bgColor: "bg-error",
        icon: "⬆️",
        badge: "Withdrawal",
      },
      transfer: {
        color: "text-info",
        bgColor: "bg-info",
        icon: "🔄",
        badge: "Transfer",
      },
    };

    const config = typeConfig[transaction.type] || typeConfig.deposit;

    return `
      <div class="card bank-card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="card-body">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 rounded-full ${
                config.bgColor
              } text-white flex items-center justify-center text-lg">
                ${config.icon}
              </div>
              <div>
                <h3 class="font-semibold text-lg">${
                  transaction.description
                }</h3>
                <p class="text-sm text-gray-500">${BankUtilities.formatDate(
                  transaction.timestamp
                )}</p>
              </div>
            </div>
            <span class="badge ${config.bgColor} text-white">${
      config.badge
    }</span>
          </div>
          
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Amount:</span>
              <span class="font-semibold ${config.color}">
                ${
                  transaction.type === "deposit" ? "+" : "-"
                }${BankUtilities.formatCurrency(transaction.amount)}
              </span>
            </div>
            
            ${
              transaction.recipient
                ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Recipient:</span>
              <span class="font-medium">${transaction.recipient}</span>
            </div>
            `
                : ""
            }
            
            ${
              transaction.method
                ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Method:</span>
              <span class="font-medium">${transaction.method}</span>
            </div>
            `
                : ""
            }
            
            <div class="flex justify-between">
              <span class="text-gray-600">Transaction ID:</span>
              <span class="font-mono text-xs">${transaction.id}</span>
            </div>
          </div>
          
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-ghost btn-sm" onclick="transactionsManager.downloadTransaction('${
              transaction.id
            }')">
              📥 Download
            </button>
            <button class="btn btn-ghost btn-sm" onclick="transactionsManager.viewTransactionDetails('${
              transaction.id
            }')">
              👁️ Details
            </button>
          </div>
        </div>
      </div>
    `;
  }

  createTransactionRow(transaction) {
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
        <td>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full ${
              config.badge
            } text-white flex items-center justify-center">
              ${
                transaction.type === "deposit"
                  ? "⬇️"
                  : transaction.type === "withdrawal"
                  ? "⬆️"
                  : "🔄"
              }
            </div>
            <div>
              <div class="font-bold">${transaction.description}</div>
              <div class="text-sm text-gray-500">${BankUtilities.formatDate(
                transaction.timestamp
              )}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="font-mono text-sm">${transaction.id}</span>
        </td>
        <td class="${config.color} font-semibold">
          ${
            transaction.type === "deposit" ? "+" : "-"
          }${BankUtilities.formatCurrency(transaction.amount)}
        </td>
        <td>
          <span class="badge ${config.badge}">${config.text}</span>
        </td>
        <td>
          ${transaction.recipient || "-"}
        </td>
        <td>
          <div class="flex space-x-2">
            <button class="btn btn-ghost btn-xs" onclick="transactionsManager.downloadTransaction('${
              transaction.id
            }')">
              📥
            </button>
            <button class="btn btn-ghost btn-xs" onclick="transactionsManager.viewTransactionDetails('${
              transaction.id
            }')">
              👁️
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  attachEventListeners() {
    // Filter elements
    const filterType = document.getElementById("filter-type");
    const filterDate = document.getElementById("filter-date");
    const filterCategory = document.getElementById("filter-category");
    const searchInput = document.getElementById("search-transactions");
    const clearFilters = document.getElementById("clear-filters");
    const downloadAll = document.getElementById("download-all-transactions");
    const viewToggle = document.getElementById("view-toggle");

    if (filterType)
      filterType.addEventListener("change", (e) =>
        this.handleFilterChange("type", e.target.value)
      );
    if (filterDate)
      filterDate.addEventListener("change", (e) =>
        this.handleFilterChange("dateRange", e.target.value)
      );
    if (filterCategory)
      filterCategory.addEventListener("change", (e) =>
        this.handleFilterChange("category", e.target.value)
      );
    if (searchInput)
      searchInput.addEventListener(
        "input",
        BankUtilities.debounce((e) => this.handleSearch(e.target.value), 300)
      );
    if (clearFilters)
      clearFilters.addEventListener("click", () => this.clearFilters());
    if (downloadAll)
      downloadAll.addEventListener("click", () =>
        this.downloadAllTransactions()
      );
    if (viewToggle)
      viewToggle.addEventListener("click", () => this.toggleView());

    // Export buttons
    const exportPDF = document.getElementById("export-pdf");
    const exportCSV = document.getElementById("export-csv");

    if (exportPDF)
      exportPDF.addEventListener("click", () => this.exportTransactions("pdf"));
    if (exportCSV)
      exportCSV.addEventListener("click", () => this.exportTransactions("csv"));
  }

  initializeFilters() {
    // Set default values for filter dropdowns
    const setFilterValue = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.value = value;
    };

    setFilterValue("filter-type", this.filters.type);
    setFilterValue("filter-date", this.filters.dateRange);
    setFilterValue("filter-category", this.filters.category);
  }

  handleFilterChange(filterType, value) {
    this.filters[filterType] = value;
    this.renderTransactions();
  }

  handleSearch(query) {
    this.searchQuery = query.toLowerCase();
    this.renderTransactions();
  }

  applyFilters(transactions) {
    let filtered = [...transactions];

    // Apply type filter
    if (this.filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === this.filters.type);
    }

    // Apply date range filter
    if (this.filters.dateRange !== "all") {
      const now = new Date();
      let startDate;

      switch (this.filters.dateRange) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      if (startDate) {
        filtered = filtered.filter((t) => new Date(t.timestamp) >= startDate);
      }
    }

    // Apply category filter
    if (this.filters.category !== "all") {
      filtered = filtered.filter((t) => t.category === this.filters.category);
    }

    // Apply search query
    if (this.searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(this.searchQuery) ||
          t.id.toLowerCase().includes(this.searchQuery) ||
          (t.recipient && t.recipient.toLowerCase().includes(this.searchQuery))
      );
    }

    return filtered;
  }

  clearFilters() {
    this.filters = {
      type: "all",
      dateRange: "all",
      category: "all",
    };
    this.searchQuery = "";

    const searchInput = document.getElementById("search-transactions");
    if (searchInput) searchInput.value = "";

    this.initializeFilters();
    this.renderTransactions();

    BankUtilities.showNotification("Filters cleared", "info");
  }

  downloadTransaction(transactionId) {
    const transaction = this.transactions.find((t) => t.id === transactionId);
    if (transaction) {
      BankUtilities.downloadAsPDF(
        [transaction],
        `transaction_${transactionId}`
      );
    } else {
      BankUtilities.showNotification("Transaction not found", "error");
    }
  }

  downloadAllTransactions() {
    const filteredTransactions = this.applyFilters(this.transactions);
    if (filteredTransactions.length === 0) {
      BankUtilities.showNotification("No transactions to download", "warning");
      return;
    }

    BankUtilities.downloadAsPDF(
      filteredTransactions,
      `all_transactions_${this.currentUser.name}_${
        new Date().toISOString().split("T")[0]
      }`
    );
  }

  exportTransactions(format) {
    const filteredTransactions = this.applyFilters(this.transactions);

    if (filteredTransactions.length === 0) {
      BankUtilities.showNotification("No transactions to export", "warning");
      return;
    }

    let content, mimeType, extension;

    if (format === "csv") {
      const headers = [
        "Date",
        "Description",
        "Amount",
        "Type",
        "Recipient",
        "Transaction ID",
      ];
      const csvData = filteredTransactions.map((t) => [
        BankUtilities.formatDate(t.timestamp),
        t.description,
        t.amount,
        t.type,
        t.recipient || "",
        t.id,
      ]);

      content = [headers, ...csvData]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");
      mimeType = "text/csv";
      extension = "csv";
    } else {
      content = JSON.stringify(filteredTransactions, null, 2);
      mimeType = "application/json";
      extension = "json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_export.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    BankUtilities.showNotification(
      `Transactions exported as ${format.toUpperCase()}`,
      "success"
    );
  }

  viewTransactionDetails(transactionId) {
    const transaction = this.transactions.find((t) => t.id === transactionId);
    if (!transaction) {
      BankUtilities.showNotification("Transaction not found", "error");
      return;
    }

    const modal = document.getElementById("transaction-details-modal");
    if (modal) {
      const detailsContent = document.getElementById(
        "transaction-details-content"
      );
      if (detailsContent) {
        detailsContent.innerHTML =
          this.createTransactionDetailsHTML(transaction);
      }
      modal.showModal();
    }
  }

  createTransactionDetailsHTML(transaction) {
    const typeConfig = {
      deposit: { color: "success", icon: "⬇️" },
      withdrawal: { color: "error", icon: "⬆️" },
      transfer: { color: "info", icon: "🔄" },
    };

    const config = typeConfig[transaction.type] || typeConfig.deposit;

    return `
      <div class="text-center mb-6">
        <div class="w-16 h-16 rounded-full bg-${
          config.color
        } text-white flex items-center justify-center text-2xl mx-auto mb-4">
          ${config.icon}
        </div>
        <h3 class="text-xl font-bold">${transaction.description}</h3>
        <p class="text-${config.color} font-semibold text-lg mt-2">
          ${
            transaction.type === "deposit" ? "+" : "-"
          }${BankUtilities.formatCurrency(transaction.amount)}
        </p>
      </div>

      <div class="space-y-4">
        <div class="flex justify-between">
          <span class="text-gray-600">Transaction ID:</span>
          <span class="font-mono">${transaction.id}</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-gray-600">Date & Time:</span>
          <span>${BankUtilities.formatDate(transaction.timestamp)}</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-gray-600">Type:</span>
          <span class="badge badge-${config.color}">${transaction.type}</span>
        </div>
        
        ${
          transaction.recipient
            ? `
        <div class="flex justify-between">
          <span class="text-gray-600">Recipient:</span>
          <span class="font-medium">${transaction.recipient}</span>
        </div>
        `
            : ""
        }
        
        ${
          transaction.method
            ? `
        <div class="flex justify-between">
          <span class="text-gray-600">Method:</span>
          <span class="font-medium">${transaction.method}</span>
        </div>
        `
            : ""
        }
        
        ${
          transaction.note
            ? `
        <div class="flex justify-between">
          <span class="text-gray-600">Note:</span>
          <span class="font-medium">${transaction.note}</span>
        </div>
        `
            : ""
        }
        
        <div class="flex justify-between">
          <span class="text-gray-600">Status:</span>
          <span class="badge badge-success">Completed</span>
        </div>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" onclick="document.getElementById('transaction-details-modal').close()">Close</button>
        <button class="btn btn-primary" onclick="transactionsManager.downloadTransaction('${
          transaction.id
        }')">
          Download Receipt
        </button>
      </div>
    `;
  }

  toggleView() {
    const container = document.getElementById("transactions-container");
    const tableView = document.getElementById("transactions-table-view");
    const viewToggle = document.getElementById("view-toggle");

    if (container && tableView && viewToggle) {
      const isGridView = !container.classList.contains("hidden");

      if (isGridView) {
        container.classList.add("hidden");
        tableView.classList.remove("hidden");
        viewToggle.innerHTML = '<span class="mr-2">🔄</span> Grid View';
      } else {
        container.classList.remove("hidden");
        tableView.classList.add("hidden");
        viewToggle.innerHTML = '<span class="mr-2">📋</span> Table View';
      }
    }
  }

  updateTransactionStats() {
    const stats = {
      total: this.transactions.length,
      deposits: this.transactions.filter((t) => t.type === "deposit").length,
      withdrawals: this.transactions.filter((t) => t.type === "withdrawal")
        .length,
      transfers: this.transactions.filter((t) => t.type === "transfer").length,
    };

    const updateStat = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    };

    updateStat("stat-total", stats.total);
    updateStat("stat-deposits", stats.deposits);
    updateStat("stat-withdrawals", stats.withdrawals);
    updateStat("stat-transfers", stats.transfers);
  }

  updateResultsCount(count) {
    const resultsElement = document.getElementById("results-count");
    if (resultsElement) {
      resultsElement.textContent = `${count} transaction${
        count !== 1 ? "s" : ""
      } found`;
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  window.transactionsManager = new TransactionsManager();
});
