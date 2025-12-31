// import { cardsConfig } from './config/config.js';

const container = document.getElementById("cards");
const searchInput = document.getElementById("search");
const filterButtons = document.querySelectorAll(".filters button");

let currentStatus = "all";

// Маппинг статусов: английский класс → русский текст
const statusMap = {
  "completed": "Пройденно",
  "not-completed": "Не пройденно",
  "in-progress": "В процессе",
  "rejected": "Забракованно",
  "infinity": "Сесионка", 
  "abandoned": "Заброшенно"
};

// Форматирование даты
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU");
}

// Рендер карточек
function renderCards() {
  const searchValue = searchInput.value.toLowerCase();
  container.innerHTML = "";

  cardsConfig
    .filter(card => {
      const matchName = card.name.toLowerCase().includes(searchValue);
      const matchStatus = currentStatus === "all" || card.status === currentStatus;
      return matchName && matchStatus;
    })
    .forEach(card => {
      const div = document.createElement("div");
      div.className = `card ${card.status}`; // класс на английском

      div.innerHTML = `
        <img src="${card.image}" alt="${card.name}">
        <div class="card-content">
          <div class="card-date">📅 ${formatDate(card.date)}</div>
          <h3>${card.name}</h3>
          <p>${card.description}</p>
          ${card.friends ? `<p><strong>Друзья:</strong> ${card.friends.join(", ")}</p>` : ""}
          <p><strong>Статус:</strong> ${statusMap[card.status]}</p>
          ${card.video ? `<iframe src="${card.video}" frameborder="0" allowfullscreen></iframe>` : ""}
          <a href="${card.link}" target="_blank">Перейти</a>
        </div>
      `;

      container.appendChild(div);
    });
}

// События
searchInput.addEventListener("input", renderCards);

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentStatus = btn.dataset.status;
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderCards();
  });
});

// Первый рендер
renderCards();
