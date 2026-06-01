// База данных (localStorage)
let worksDatabase = [];

function loadWorksFromStorage() {
    const stored = localStorage.getItem("portfolioWorks");
    if(stored) {
        worksDatabase = JSON.parse(stored);
    } else {
        worksDatabase = [
            { id: "1", title: "Плакат с цитатой", category: "Типографика", imageUrl: "https://picsum.photos/id/13/500/600", year: "1 курс" },
            { id: "2", title: "Абстракция 'Вдохновение'", category: "Иллюстрация", imageUrl: "https://picsum.photos/id/30/500/600", year: "2 курс" },
            { id: "3", title: "Шрифтовая композиция", category: "Типографика", imageUrl: "https://picsum.photos/id/42/500/600", year: "1 курс" }
        ];
        saveWorksToStorage();
    }
    syncBestSlider();
}

function saveWorksToStorage() {
    localStorage.setItem("portfolioWorks", JSON.stringify(worksDatabase));
}

// Слайдер
let bestWorksArray = [];
let currentBestIndex = 0;

function syncBestSlider() {
    bestWorksArray = worksDatabase.length ? [...worksDatabase] : [];
    currentBestIndex = Math.min(currentBestIndex, bestWorksArray.length - 1);
    if(currentBestIndex < 0 && bestWorksArray.length) currentBestIndex = 0;
    renderBestSlider();
}

function renderBestSlider() {
    const gallery = document.getElementById("galleryContainer");
    if(!gallery) return;
    if(bestWorksArray.length === 0) {
        gallery.innerHTML = '<div class="work">Нет работ</div>';
        return;
    }
    const prevIndex = (currentBestIndex - 1 + bestWorksArray.length) % bestWorksArray.length;
    const nextIndex = (currentBestIndex + 1) % bestWorksArray.length;
    const centerWork = bestWorksArray[currentBestIndex];
    const leftWork = bestWorksArray[prevIndex];
    const rightWork = bestWorksArray[nextIndex];
    
    gallery.innerHTML = `
        <div class="work" data-index="${prevIndex}"><img src="${leftWork.imageUrl}" alt="${leftWork.title}" onerror="this.src='https://picsum.photos/id/1/300/200'"></div>
        <div class="work active" data-index="${currentBestIndex}"><img src="${centerWork.imageUrl}" alt="${centerWork.title}" onerror="this.src='https://picsum.photos/id/1/300/200'"></div>
        <div class="work" data-index="${nextIndex}"><img src="${rightWork.imageUrl}" alt="${rightWork.title}" onerror="this.src='https://picsum.photos/id/1/300/200'"></div>
    `;
    
    document.getElementById("workCaption").innerText = centerWork.title;
    
    document.querySelectorAll('.gallery .work').forEach(workDiv => {
        workDiv.addEventListener('click', () => {
            const idx = parseInt(workDiv.getAttribute('data-index'));
            if(!isNaN(idx) && idx !== currentBestIndex) {
                currentBestIndex = idx;
                renderBestSlider();
            }
        });
    });
}

function slidePrev() {
    if(bestWorksArray.length) {
        currentBestIndex = (currentBestIndex - 1 + bestWorksArray.length) % bestWorksArray.length;
        renderBestSlider();
    }
}

function slideNext() {
    if(bestWorksArray.length) {
        currentBestIndex = (currentBestIndex + 1) % bestWorksArray.length;
        renderBestSlider();
    }
}

// Отправка email (демо)
function setupEmail() {
    const sendBtn = document.getElementById("sendEmailBtn");
    const feedback = document.getElementById("mailFeedback");
    if(sendBtn) {
        sendBtn.addEventListener("click", () => {
            const msg = document.getElementById("emailMessage").value.trim();
            if(!msg) {
                feedback.innerText = "✉️ Напишите текст сообщения!";
                feedback.style.color = "red";
            } else {
                feedback.innerText = "✅ Сообщение отправлено! Я свяжусь с вами.";
                feedback.style.color = "green";
                document.getElementById("emailMessage").value = "";
                setTimeout(() => feedback.innerText = "", 3000);
            }
        });
    }
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    loadWorksFromStorage();
    setupEmail();
    
    document.getElementById("prevBtn")?.addEventListener("click", slidePrev);
    document.getElementById("nextBtn")?.addEventListener("click", slideNext);
    
    // Обновляем слайдер при изменении данных в localStorage (если другая вкладка)
    window.addEventListener("storage", (e) => {
        if(e.key === "portfolioWorks") {
            loadWorksFromStorage();
        }
    });
});
