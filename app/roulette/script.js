const roulette = document.getElementById("roulette");
const result = document.getElementById("result");
const spinBtn = document.getElementById("spin");
const statusSelect = document.getElementById("statusSelect");

let currentPos = 0;
let displayItems = [];
let items = [];

// Текст для пустой рулетки
const statusMap = {
  "completed": "✅ Пройденно",
  "in-progress": "⏳ В процессе",
  "not-completed": "❌ Не пройденно",
  "abandoned": "🗑️ Заброшенно",
  "infinity": "♻️ Сесионка",
  "rejected": "🚫 Забракованно"
};

function buildRoulette() {
  roulette.innerHTML = "";
  currentPos = 0;

  const status = statusSelect.value;
  items = cardsConfig.filter(c => c.status === status);

  if (!items.length) {
    roulette.innerHTML = `<div class="empty">Нет игр со статусом «${statusMap[status]}»</div>`;
    return;
  }

  // Дублируем список много раз для бесконечной рулетки
  const repeatCount = 50; 
  displayItems = [];
  for (let i = 0; i < repeatCount; i++) {
    displayItems = displayItems.concat(items);
  }

  displayItems.forEach(item => {
    const el = document.createElement("div");
    el.className = "roulette-item";
    el.innerHTML = `<img src="${item.image}"><span>${item.name}</span>`;
    roulette.appendChild(el);
  });

  // Устанавливаем начальную позицию рулетки в центр
  const midIndex = Math.floor(displayItems.length / 2) - Math.floor(items.length / 2);
  currentPos = midIndex * 180; // 180px — высота карточки
  roulette.style.transition = "none";
  roulette.style.transform = `translateY(-${currentPos}px)`;
  void roulette.offsetWidth; // форсируем перерисовку
  roulette.style.transition = "transform 3s cubic-bezier(.17,.67,.12,1)";
}

function spinRoulette() {
  if (!items.length) return;

  const itemHeight = 180;
  const winnerIndex = Math.floor(Math.random() * items.length);
  const winner = items[winnerIndex];

  // Находим индекс победителя в displayItems, ближе к середине
  const mid = Math.floor(displayItems.length / 2);
  let winnerPosIndex = mid;
  for (let i = mid; i < displayItems.length; i++) {
    if (displayItems[i] === winner) {
      winnerPosIndex = i;
      break;
    }
  }

  const rounds = 5; // количество витков
  winnerPosIndex += rounds * items.length;

  const initialPos = currentPos;
  const finalPos = winnerPosIndex * itemHeight;

  const duration = 4000; // длительность спина
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animate(time) {
    const elapsed = time - startTime;
    let progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    const pos = initialPos + (finalPos - initialPos) * eased;
    roulette.style.transform = `translateY(-${pos}px)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      currentPos = pos; // сохраняем позицию для следующего спина
      result.textContent = `🎉 Выпало: ${winner.name}`;
      result.classList.add("show");
      setTimeout(() => result.classList.remove("show"), 3000);
    }
  }

  requestAnimationFrame(animate);
}

// события
spinBtn.addEventListener("click", spinRoulette);
statusSelect.addEventListener("change", buildRoulette);

// первый запуск
buildRoulette();
