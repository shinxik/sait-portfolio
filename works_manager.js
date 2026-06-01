let worksDatabase = [];

function loadWorks() {
    const stored = localStorage.getItem("portfolioWorks");
    if(stored) {
        worksDatabase = JSON.parse(stored);
    } else {
        worksDatabase = [
            { id: "1", title: "Плакат с цитатой", category: "Типографика", imageUrl: "https://picsum.photos/id/13/500/600", year: "1 курс" },
            { id: "2", title: "Абстракция 'Вдохновение'", category: "Иллюстрация", imageUrl: "https://picsum.photos/id/30/500/600", year: "2 курс" },
            { id: "3", title: "Шрифтовая композиция", category: "Типографика", imageUrl: "https://picsum.photos/id/42/500/600", year: "1 курс" },
            { id: "4", title: "Графический постер", category: "Графика", imageUrl: "https://picsum.photos/id/76/500/600", year: "2 курс" }
        ];
        saveWorks();
    }
    renderGrid();
}

function saveWorks() {
    localStorage.setItem("portfolioWorks", JSON.stringify(worksDatabase));
    // Уведомляем другие вкладки
    window.dispatchEvent(new StorageEvent('storage', { key: 'portfolioWorks', newValue: JSON.stringify(worksDatabase) }));
}

function generateId() {
    return Date.now().toString() + Math.floor(Math.random() * 10000);
}

function addWork(title, category, imageUrl, year) {
    if(!title.trim() || !imageUrl.trim()) {
        alert("Заполните название и URL изображения");
        return false;
    }
    worksDatabase.push({
        id: generateId(),
        title: title.trim(),
        category: category.trim() || "Разное",
        imageUrl: imageUrl.trim(),
        year: year.trim() || "—"
    });
    saveWorks();
    renderGrid();
    return true;
}

function updateWork(id, updatedData) {
    const index = worksDatabase.findIndex(w => w.id === id);
    if(index !== -1) {
        worksDatabase[index] = { ...worksDatabase[index], ...updatedData };
        saveWorks();
        renderGrid();
    }
}

function deleteWork(id) {
    if(confirm("Удалить работу?")) {
        worksDatabase = worksDatabase.filter(w => w.id !== id);
        saveWorks();
        renderGrid();
    }
}

let editModeId = null;

function renderGrid() {
    const grid = document.getElementById("worksGrid");
    if(!grid) return;
    
    if(worksDatabase.length === 0) {
        grid.innerHTML = "<p style='text-align:center; grid-column:1/-1;'>Пока нет работ. Добавьте первую работу!</p>";
        return;
    }
    
    grid.innerHTML = worksDatabase.map(work => `
        <div class="work-card" data-id="${work.id}">
            <img src="${work.imageUrl}" alt="${work.title}" onerror="this.src='https://picsum.photos/id/1/300/200'">
            <div class="work-card-info">
                <h3>${escapeHtml(work.title)}</h3>
                <p>${escapeHtml(work.category)} • ${escapeHtml(work.year)}</p>
                <div class="card-actions">
                    <button class="edit-btn" data-id="${work.id}"><i class="fas fa-edit"></i> Редактировать</button>
                    <button class="delete-btn" data-id="${work.id}"><i class="fas fa-trash-alt"></i> Удалить</button>
                </div>
            </div>
        </div>
    `).join("");
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const work = worksDatabase.find(w => w.id === id);
            if(work) {
                document.getElementById("workTitle").value = work.title;
                document.getElementById("workCategory").value = work.category;
                document.getElementById("workImageUrl").value = work.imageUrl;
                document.getElementById("workYear").value = work.year;
                editModeId = work.id;
                document.getElementById("editHint").innerHTML = `✏️ Редактирование: ${work.title}. Нажмите "Добавить работу" для сохранения.`;
            }
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            deleteWork(id);
        });
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if(m === '&') return '&amp;';
        if(m === '<') return '&lt;';
        if(m === '>') return '&gt;';
        return m;
    });
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    loadWorks();
    
    document.getElementById("addWorkBtn").addEventListener("click", () => {
        const title = document.getElementById("workTitle").value;
        const category = document.getElementById("workCategory").value;
        const imgUrl = document.getElementById("workImageUrl").value;
        const year = document.getElementById("workYear").value;
        
        if(editModeId) {
            updateWork(editModeId, { title, category, imageUrl: imgUrl, year });
            editModeId = null;
            document.getElementById("editHint").innerHTML = "";
        } else {
            addWork(title, category, imgUrl, year);
        }
        
        document.getElementById("workTitle").value = "";
        document.getElementById("workCategory").value = "";
        document.getElementById("workImageUrl").value = "";
        document.getElementById("workYear").value = "";
    });
    
    document.getElementById("resetFormBtn").addEventListener("click", () => {
        document.getElementById("workTitle").value = "";
        document.getElementById("workCategory").value = "";
        document.getElementById("workImageUrl").value = "";
        document.getElementById("workYear").value = "";
        editModeId = null;
        document.getElementById("editHint").innerHTML = "";
    });
});
