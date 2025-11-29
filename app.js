let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");

function renderExpenses() {
  list.innerHTML = "";
  let total = 0;

  expenses.forEach((exp, index) => {
    total += Number(exp.amount);

    const item = document.createElement("li");
    item.className = "expense-item";
    item.innerHTML = `
      ${exp.title} (₹${exp.amount}) - ${exp.category} - ${exp.date}
      <button onclick="deleteExpense(${index})">❌</button>
    `;
    list.appendChild(item);
  });

  totalAmount.textContent = total;
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  renderExpenses();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newExpense = {
    title: title.value,
    amount: amount.value,
    category: category.value,
    date: date.value
  };

  expenses.push(newExpense);
  renderExpenses();
  form.reset();
});

renderExpenses();

