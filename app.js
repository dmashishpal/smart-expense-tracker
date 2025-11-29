// Load from localStorage or start empty
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const filterCategory = document.getElementById("filterCategory");
const sortBy = document.getElementById("sortBy");

// Save to localStorage
function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Get filtered + sorted list
function getProcessedExpenses() {
  let data = [...expenses];

  // Filter by category
  const cat = filterCategory.value;
  if (cat) {
    data = data.filter((exp) => exp.category === cat);
  }

  // Sort
  const sortValue = sortBy.value;
  if (sortValue === "newest") {
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortValue === "oldest") {
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortValue === "amount_desc") {
    data.sort((a, b) => Number(b.amount) - Number(a.amount));
  } else if (sortValue === "amount_asc") {
    data.sort((a, b) => Number(a.amount) - Number(b.amount));
  }

  return data;
}

// Render UI
function renderExpenses() {
  list.innerHTML = "";
  const processed = getProcessedExpenses();

  if (processed.length === 0) {
    list.innerHTML = `<p class="empty-text">No expenses yet.</p>`;
    totalAmount.textContent = 0;
    return;
  }

  let total = 0;

  processed.forEach((exp) => {
    total += Number(exp.amount);

    const item = document.createElement("li");
    item.className = "expense-item";

    item.innerHTML = `
      <div class="expense-left">
        <span class="expense-title">${exp.title} - ₹${exp.amount}</span>
        <span class="expense-meta">${exp.category} • ${exp.date}</span>
      </div>
      <button class="delete-btn" data-id="${exp.id}">Delete</button>
    `;

    list.appendChild(item);
  });

  totalAmount.textContent = total;
  saveExpenses();

  // attach delete listeners
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteExpense(id);
    });
  });
}

// Delete by id
function deleteExpense(id) {
  expenses = expenses.filter((exp) => String(exp.id) !== String(id));
  renderExpenses();
}

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!title || !amount || !category || !date) return;

  const newExpense = {
    id: Date.now(), // unique id
    title,
    amount,
    category,
    date
  };

  expenses.push(newExpense);
  renderExpenses();
  form.reset();
});

// Re-render when filters change
filterCategory.addEventListener("change", renderExpenses);
sortBy.addEventListener("change", renderExpenses);

// Initial render
renderExpenses();
