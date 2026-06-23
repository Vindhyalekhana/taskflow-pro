const themeToggle = document.querySelector("#themeToggle");
const exportBtn = document.querySelector("#exportBtn");
const importInput = document.querySelector("#importInput");

const navTasksBtn = document.querySelector("#navTasks");
const navCalendarBtn = document.querySelector("#navCalendar");
const navTagsBtn = document.querySelector("#navTags");
const navSharedBtn = document.querySelector("#navShared");
const navChatBtn = document.querySelector("#navChat");
const navDashboardBtn = document.querySelector("#navDashboard");
const navSettingsBtn = document.querySelector("#navSettings");

const tasksView = document.querySelector("#tasksView");
const calendarView = document.querySelector("#calendarView");
const tagsView = document.querySelector("#tagsView");
const sharedView = document.querySelector("#sharedView");
const chatView = document.querySelector("#chatView");
const dashboardView = document.querySelector("#dashboardView");
const settingsView = document.querySelector("#settingsView");

const modal = document.querySelector("#taskModal");
const openModalBtn = document.querySelector("#openModalBtn");
const closeModalBtn = document.querySelector(".close-modal");
const addBtn = document.querySelector("#addBtn");

const taskInput = document.querySelector("#taskInput");
const taskDesc = document.querySelector("#taskDesc");
const dueDateInput = document.querySelector("#dueDate");
const categoryInput = document.querySelector("#category");
const priorityInput = document.querySelector("#priority");
const statusSelect = document.querySelector("#statusSelect");
const isSharedCheckbox = document.querySelector("#isSharedCheckbox");
const sharedByInput = document.querySelector("#sharedByInput");

const todoList = document.querySelector("#todoList");
const inProgressList = document.querySelector("#inProgressList");
const completeList = document.querySelector("#completeList");

const prevMonthBtn = document.querySelector("#prevMonthBtn");
const nextMonthBtn = document.querySelector("#nextMonthBtn");
const monthYearEl = document.querySelector("#monthYear");
const calendarGrid = document.querySelector("#calendarGrid");

const tagsBoard = document.querySelector("#tagsBoard");
const sharedBoard = document.querySelector("#sharedBoard");

const chatContacts = document.querySelector("#chatContacts");
const chatMessages = document.querySelector("#chatMessages");
const activeChatName = document.querySelector("#activeChatName");
const chatInput = document.querySelector("#chatInput");
const sendChatBtn = document.querySelector("#sendChatBtn");

const settingsNameInput = document.querySelector("#settingsName");
const settingsThemeToggle = document.querySelector("#settingsThemeToggle");
const colorBtns = document.querySelectorAll(".color-btn");
const settingsExportBtn = document.querySelector("#settingsExportBtn");
const settingsImportInput = document.querySelector("#settingsImportInput");
const clearTasksBtn = document.querySelector("#clearTasksBtn");
const resetPrefsBtn = document.querySelector("#resetPrefsBtn");

const statTotal = document.querySelector("#statTotal");
const statCompleted = document.querySelector("#statCompleted");
const statPending = document.querySelector("#statPending");
const statShared = document.querySelector("#statShared");

const searchInput = document.querySelector("#searchInput");
const notifyBtn = document.querySelector(".notify-btn");
const viewBtns = document.querySelectorAll(".view-btn");
const kanbanBoard = document.querySelector(".kanban-board");
const sortSelect = document.querySelector("#sortSelect");

let tasks = [];
let editingTaskId = null;
let draggedTaskId = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

let categoryChartInstance = null;
let velocityChartInstance = null;

let chatData = {
    "Alex": [
        { sender: "Alex", text: "Hello 👋", timestamp: "10:30" }
    ],
    "Maria": [
        { sender: "Maria", text: "Meeting at 5?", timestamp: "09:15" }
    ],
    "Team": [],
    "Bot": []
};
let activeChat = "Alex";

let appSettings = {
    username: "Samir Mammadov",
    theme: "light",
    accent: "#9EF088"
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Application Settings State
function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(appSettings));
}

function loadSettings() {
    const stored = localStorage.getItem("settings");
    if (stored) {
        appSettings = { ...appSettings, ...JSON.parse(stored) };
    }
    applySettings();
}

function applySettings() {
    // Apply Profile
    document.querySelector("#headerUserName").innerText = appSettings.username;
    settingsNameInput.value = appSettings.username;
    
    // Apply Accent Color
    document.documentElement.style.setProperty('--color-accent', appSettings.accent);
    
    // Apply Theme
    if (appSettings.theme === "dark") {
        document.body.classList.add("dark");
        themeToggle.innerText = "☀";
    } else {
        document.body.classList.remove("dark");
        themeToggle.innerText = "🌙";
    }
}

// Global App Renderer
function renderApp() {
    renderTasks();
    renderCalendar();
    renderTagsView();
    renderSharedView();
    renderDashboard();
    updateStats();
}

// View Navigation
function hideAllViews() {
    tasksView.style.display = "none";
    calendarView.style.display = "none";
    tagsView.style.display = "none";
    sharedView.style.display = "none";
    chatView.style.display = "none";
    dashboardView.style.display = "none";
    settingsView.style.display = "none";
    
    navTasksBtn.classList.remove("active");
    navCalendarBtn.classList.remove("active");
    navTagsBtn.classList.remove("active");
    navSharedBtn.classList.remove("active");
    navChatBtn.classList.remove("active");
    navDashboardBtn.classList.remove("active");
    navSettingsBtn.classList.remove("active");
}

navTasksBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideAllViews();
    navTasksBtn.classList.add("active");
    tasksView.style.display = "flex";
    renderTasks();
    if(viewBtns.length === 3) {
        viewBtns[1].classList.add("active");
        viewBtns[0].classList.remove("active");
        viewBtns[2].classList.remove("active");
    }
    if(kanbanBoard) kanbanBoard.classList.remove("list-mode");
});

navCalendarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideAllViews();
    navCalendarBtn.classList.add("active");
    calendarView.style.display = "flex";
    renderCalendar();
    if(viewBtns.length === 3) {
        viewBtns[2].classList.add("active");
        viewBtns[0].classList.remove("active");
        viewBtns[1].classList.remove("active");
    }
});

navTagsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideAllViews();
    navTagsBtn.classList.add("active");
    tagsView.style.display = "flex";
    renderTagsView();
});

navSharedBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideAllViews();
    navSharedBtn.classList.add("active");
    sharedView.style.display = "flex";
    renderSharedView();
});

navChatBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideAllViews();
    navChatBtn.classList.add("active");
    chatView.style.display = "flex";
    renderChatContacts();
    renderChatMessages();
});

navDashboardBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideAllViews();
    navDashboardBtn.classList.add("active");
    dashboardView.style.display = "block";
    renderDashboard();
});

navSettingsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideAllViews();
    navSettingsBtn.classList.add("active");
    settingsView.style.display = "block";
    updateStats();
});

// Calendar Month Navigation
prevMonthBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

function getTasksForDate(dateString) {
    return tasks.filter(task => task.dueDate === dateString);
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveChats() {
    localStorage.setItem("chatData", JSON.stringify(chatData));
}

function loadChats() {
    const stored = localStorage.getItem("chatData");
    if (stored) chatData = JSON.parse(stored);
}

function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        
        // Data Migration
        tasks.forEach(task => {
            if (task.completed !== undefined) {
                task.status = task.completed ? "complete" : "todo";
                delete task.completed;
            }
            if (!task.createdAt) {
                task.createdAt = new Date().toISOString().split('T')[0];
            }
        });
        saveTasks();
    }
    renderApp();
}

// Settings Logic
settingsNameInput.addEventListener("input", (e) => {
    appSettings.username = e.target.value.trim() || "User";
    applySettings();
    saveSettings();
});

function toggleThemeLogic() {
    appSettings.theme = appSettings.theme === "light" ? "dark" : "light";
    applySettings();
    saveSettings();
}

themeToggle.addEventListener("click", toggleThemeLogic);
settingsThemeToggle.addEventListener("click", toggleThemeLogic);

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        appSettings.accent = btn.getAttribute("data-color");
        applySettings();
        saveSettings();
    });
});

function exportData() {
    const jsonData = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    a.click();
    URL.revokeObjectURL(url);
}

exportBtn.addEventListener("click", exportData);
settingsExportBtn.addEventListener("click", exportData);

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedTasks = JSON.parse(e.target.result);
            const ids = new Set(tasks.map(task => task.id));
            importedTasks.forEach(task => {
                if (!ids.has(task.id)) {
                    if (task.completed !== undefined) {
                        task.status = task.completed ? "complete" : "todo";
                        delete task.completed;
                    }
                    if (!task.createdAt) task.createdAt = new Date().toISOString().split('T')[0];
                    tasks.push(task);
                }
            });
            saveTasks();
            renderApp();
            alert("Tasks imported successfully!");
        } catch {
            alert("Invalid JSON file!");
        }
        event.target.value = "";
    };
    reader.readAsText(file);
}

importInput.addEventListener("change", importData);
settingsImportInput.addEventListener("change", importData);

clearTasksBtn.addEventListener("click", () => {
    if(confirm("Are you sure? This action cannot be undone and will delete ALL tasks.")) {
        tasks = [];
        saveTasks();
        renderApp();
    }
});

resetPrefsBtn.addEventListener("click", () => {
    appSettings = {
        username: "Samir Mammadov",
        theme: "light",
        accent: "#9EF088"
    };
    applySettings();
    saveSettings();
});

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "complete").length;
    const pending = total - completed;
    const shared = tasks.filter(t => t.isShared).length;

    statTotal.innerText = total;
    statCompleted.innerText = completed;
    statPending.innerText = pending;
    statShared.innerText = shared;
}

// Dashboard Logic
function renderDashboard() {
    const bentoContainer = document.querySelector("#bentoGridContainer");
    if (!bentoContainer) return;
    
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "complete").length;
    const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    // Streak Calculation
    const completedDates = [...new Set(tasks.filter(t => t.completedAt).map(t => t.completedAt))].sort().reverse();
    let currentStreak = 0;
    let checkDate = new Date();
    for (let i = 0; i < 30; i++) {
        const dStr = checkDate.toISOString().split('T')[0];
        if (completedDates.includes(dStr)) {
            currentStreak++;
        } else if (i === 0) {
            // Check yesterday if nothing completed today
        } else {
            break;
        }
        checkDate.setDate(checkDate.getDate() - 1);
    }
    
    // Priority Math
    const high = tasks.filter(t => t.priority === "High").length;
    const med = tasks.filter(t => t.priority === "Medium").length;
    const low = tasks.filter(t => t.priority === "Low").length;
    const maxPrio = Math.max(high, med, low, 1);
    const highP = (high / maxPrio) * 100;
    const medP = (med / maxPrio) * 100;
    const lowP = (low / maxPrio) * 100;

    // Upcoming
    const upcoming = tasks
        .filter(t => t.status !== "complete" && t.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);

    bentoContainer.innerHTML = `
        <div class="bento-card bento-large">
            <div class="bento-title">Overall Progress</div>
            <div class="bento-progress-wrap">
                <div class="bento-percent">${progressPercent}%</div>
                <div class="bento-progress-track">
                    <div class="bento-progress-fill" style="width: ${progressPercent}%;"></div>
                </div>
            </div>
        </div>

        <div class="bento-card bento-small">
            <div class="bento-title">Total Tasks</div>
            <div class="bento-number">${total}</div>
        </div>

        <div class="bento-card bento-small">
            <div class="bento-title">🔥 Streak</div>
            <div class="bento-number">${currentStreak} <span style="font-size:16px;">Days</span></div>
        </div>

        <div class="bento-card bento-wide">
            <div class="bento-title">Priority Breakdown</div>
            <div class="priority-row">
                <div class="priority-label">High</div>
                <div class="priority-bar-track">
                    <div class="priority-bar-fill fill-high" style="width: ${highP}%;"></div>
                </div>
                <div style="font-weight:700; width:20px; text-align:right;">${high}</div>
            </div>
            <div class="priority-row">
                <div class="priority-label">Medium</div>
                <div class="priority-bar-track">
                    <div class="priority-bar-fill fill-medium" style="width: ${medP}%;"></div>
                </div>
                <div style="font-weight:700; width:20px; text-align:right;">${med}</div>
            </div>
            <div class="priority-row" style="margin-bottom:0;">
                <div class="priority-label">Low</div>
                <div class="priority-bar-track">
                    <div class="priority-bar-fill fill-low" style="width: ${lowP}%;"></div>
                </div>
                <div style="font-weight:700; width:20px; text-align:right;">${low}</div>
            </div>
        </div>

        <div class="bento-card bento-large">
            <div class="bento-title">Category Distribution</div>
            <div class="chart-container">
                <canvas id="categoryChart"></canvas>
            </div>
        </div>

        <div class="bento-card bento-tall">
            <div class="bento-title">Upcoming Deadlines</div>
            <div class="upcoming-list">
                ${upcoming.length === 0 ? '<p style="color: #6b7280; font-weight:500;">No upcoming deadlines.</p>' : ''}
                ${upcoming.map(t => `
                    <div class="upcoming-item">
                        <div class="upcoming-title">📅 ${t.title}</div>
                        <div class="upcoming-date">${t.dueDate}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="bento-card bento-full">
            <div class="bento-title">Task Velocity (Last 7 Days)</div>
            <div class="chart-container" style="height: 250px;">
                <canvas id="velocityChart"></canvas>
            </div>
        </div>
    `;

    // Category Pie Chart
    const catCounts = { Study: 0, Work: 0, Personal: 0, Health: 0 };
    tasks.forEach(t => {
        if (catCounts[t.category] !== undefined) catCounts[t.category]++;
    });

    if (categoryChartInstance) categoryChartInstance.destroy();
    const ctxCat = document.getElementById('categoryChart');
    if(ctxCat && typeof Chart !== 'undefined') {
        categoryChartInstance = new Chart(ctxCat.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Study', 'Work', 'Personal', 'Health'],
                datasets: [{
                    data: [catCounts.Study, catCounts.Work, catCounts.Personal, catCounts.Health],
                    backgroundColor: ['#9EF088', '#60A5FA', '#F472B6', '#FB923C'],
                    borderWidth: 2,
                    borderColor: '#111'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
    }

    // Velocity Bar Chart
    const velocityLabels = [];
    const addedData = [];
    const completedData = [];
    for(let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const displayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
        velocityLabels.push(displayLabel);
        
        const added = tasks.filter(t => t.createdAt === dStr).length;
        const comp = tasks.filter(t => t.completedAt === dStr).length;
        addedData.push(added);
        completedData.push(comp);
    }

    if (velocityChartInstance) velocityChartInstance.destroy();
    const ctxVel = document.getElementById('velocityChart');
    if (ctxVel && typeof Chart !== 'undefined') {
        velocityChartInstance = new Chart(ctxVel.getContext('2d'), {
            type: 'bar',
            data: {
                labels: velocityLabels,
                datasets: [
                    {
                        label: 'Tasks Added',
                        data: addedData,
                        backgroundColor: '#60A5FA',
                        borderColor: '#111',
                        borderWidth: 2,
                        borderRadius: 4
                    },
                    {
                        label: 'Tasks Completed',
                        data: completedData,
                        backgroundColor: '#9EF088',
                        borderColor: '#111',
                        borderWidth: 2,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    }
}

// Chat Logic
function renderChatContacts() {
    chatContacts.innerHTML = "";
    Object.keys(chatData).forEach(contact => {
        const div = document.createElement("div");
        div.classList.add("contact-item");
        if (contact === activeChat) div.classList.add("active");
        
        const avatar = document.createElement("div");
        avatar.classList.add("shared-avatar");
        avatar.innerText = contact === "Bot" ? "🤖" : contact.charAt(0).toUpperCase();

        const name = document.createElement("span");
        name.style.fontWeight = "600";
        name.innerText = contact;

        div.appendChild(avatar);
        div.appendChild(name);

        div.onclick = () => {
            activeChat = contact;
            renderChatContacts();
            renderChatMessages();
        };

        chatContacts.appendChild(div);
    });
}

function renderChatMessages() {
    activeChatName.innerText = activeChat;
    chatMessages.innerHTML = "";
    
    const msgs = chatData[activeChat] || [];
    msgs.forEach(msg => {
        const wrap = document.createElement("div");
        wrap.classList.add("message-wrapper");
        wrap.classList.add(msg.sender === "You" ? "sent" : "received");

        const bubble = document.createElement("div");
        bubble.classList.add("message-bubble");
        bubble.innerText = msg.text;

        const time = document.createElement("div");
        time.classList.add("message-time");
        time.innerText = msg.timestamp;

        wrap.appendChild(bubble);
        wrap.appendChild(time);
        chatMessages.appendChild(wrap);
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    chatData[activeChat].push({ sender: "You", text, timestamp });
    chatInput.value = "";
    saveChats();
    renderChatMessages();

    // Mock auto reply
    setTimeout(() => {
        const responses = ["Sounds good 👍", "Great idea!", "Okay 😊", "Interesting!", "Let's do it 🚀", "Noted ✔"];
        const resText = responses[Math.floor(Math.random() * responses.length)];
        
        const now2 = new Date();
        const ts2 = `${String(now2.getHours()).padStart(2, '0')}:${String(now2.getMinutes()).padStart(2, '0')}`;
        
        chatData[activeChat].push({ sender: activeChat, text: resText, timestamp: ts2 });
        saveChats();
        if (activeChat === activeChat) {
            renderChatMessages();
        }
    }, 1000);
}

sendChatBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});


// Modal Logic
isSharedCheckbox.addEventListener("change", () => {
    sharedByInput.style.display = isSharedCheckbox.checked ? "block" : "none";
});

openModalBtn.addEventListener("click", () => {
    editingTaskId = null;
    document.querySelector("#modalTitle").innerText = "New Task";
    taskInput.value = "";
    taskDesc.value = "";
    dueDateInput.value = "";
    categoryInput.value = "Study";
    priorityInput.value = "Medium";
    statusSelect.value = "todo";
    isSharedCheckbox.checked = false;
    sharedByInput.value = "";
    sharedByInput.style.display = "none";
    modal.classList.add("show");
});

closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("show");
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("show");
    }
});

addBtn.addEventListener("click", () => {
    const title = taskInput.value.trim();
    if (!title) {
        alert("Please enter a task title");
        return;
    }

    const nowIso = new Date().toISOString().split('T')[0];

    if (editingTaskId !== null) {
        const task = tasks.find(t => t.id === editingTaskId);
        if (task) {
            task.title = title;
            task.desc = taskDesc.value.trim();
            task.dueDate = dueDateInput.value;
            task.category = categoryInput.value;
            task.priority = priorityInput.value;
            task.status = statusSelect.value;
            task.isShared = isSharedCheckbox.checked;
            task.sharedBy = isSharedCheckbox.checked ? sharedByInput.value.trim() : "";
            if (task.status === "complete" && !task.completedAt) task.completedAt = nowIso;
            if (task.status !== "complete") task.completedAt = null;
        }
    } else {
        const newTask = {
            id: Date.now(),
            title: title,
            desc: taskDesc.value.trim(),
            dueDate: dueDateInput.value,
            category: categoryInput.value,
            priority: priorityInput.value,
            status: statusSelect.value,
            isShared: isSharedCheckbox.checked,
            sharedBy: isSharedCheckbox.checked ? sharedByInput.value.trim() : "",
            createdAt: nowIso,
            completedAt: statusSelect.value === "complete" ? nowIso : null
        };
        tasks.push(newTask);
    }

    saveTasks();
    renderApp();
    modal.classList.remove("show");
});

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    editingTaskId = id;
    document.querySelector("#modalTitle").innerText = "Edit Task";
    taskInput.value = task.title;
    taskDesc.value = task.desc || "";
    dueDateInput.value = task.dueDate || "";
    categoryInput.value = task.category || "Study";
    priorityInput.value = task.priority || "Medium";
    statusSelect.value = task.status || "todo";
    isSharedCheckbox.checked = task.isShared || false;
    sharedByInput.value = task.sharedBy || "";
    sharedByInput.style.display = task.isShared ? "block" : "none";
    
    modal.classList.add("show");
}

function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderApp();
    }
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        if (task.status === "complete") {
            task.status = "todo";
            task.completedAt = null;
        } else {
            task.status = "complete";
            task.completedAt = new Date().toISOString().split('T')[0];
        }
        saveTasks();
        renderApp();
    }
}

// Render Functions
function renderTasks() {
    todoList.innerHTML = "";
    inProgressList.innerHTML = "";
    completeList.innerHTML = "";

    let todoCount = 0;
    let inProgressCount = 0;
    let completeCount = 0;
    
    const tasksToRender = getSortedTasks();

    tasksToRender.forEach(task => {
        const card = document.createElement("div");
        card.classList.add("task-card");
        card.draggable = true;

        card.addEventListener("dragstart", () => {
            draggedTaskId = task.id;
            card.classList.add("dragging");
        });

        card.addEventListener("dragend", () => {
            card.classList.remove("dragging");
            draggedTaskId = null;
        });

        const titleEl = document.createElement("div");
        titleEl.classList.add("task-title");
        titleEl.innerText = task.title;
        card.appendChild(titleEl);

        if (task.desc) {
            const descEl = document.createElement("div");
            descEl.classList.add("task-desc");
            descEl.innerText = task.desc;
            card.appendChild(descEl);
        }

        const footerEl = document.createElement("div");
        footerEl.classList.add("task-footer");

        const actionsEl = document.createElement("div");
        actionsEl.classList.add("task-actions");

        const completeBtn = document.createElement("button");
        completeBtn.classList.add("action-icon");
        completeBtn.innerText = "☑";
        if (task.status === "complete") {
            completeBtn.style.color = "var(--color-complete)";
            completeBtn.style.borderColor = "var(--color-complete)";
        }
        completeBtn.onclick = () => toggleComplete(task.id);

        const editBtn = document.createElement("button");
        editBtn.classList.add("action-icon");
        editBtn.innerText = "✎";
        editBtn.onclick = () => editTask(task.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("action-icon");
        deleteBtn.innerText = "🗑";
        deleteBtn.onclick = () => deleteTask(task.id);

        actionsEl.appendChild(completeBtn);
        actionsEl.appendChild(editBtn);
        actionsEl.appendChild(deleteBtn);
        footerEl.appendChild(actionsEl);

        const metaEl = document.createElement("div");
        metaEl.classList.add("task-meta");
        if (task.dueDate) {
            metaEl.innerText = task.dueDate;
        }
        footerEl.appendChild(metaEl);

        card.appendChild(footerEl);

        if (task.status === "todo" || !task.status) {
            todoList.appendChild(card);
            todoCount++;
        } else if (task.status === "in-progress") {
            inProgressList.appendChild(card);
            inProgressCount++;
        } else if (task.status === "complete") {
            completeList.appendChild(card);
            completeCount++;
        }
    });

    document.querySelector(".todo-header .count").innerText = todoCount;
    document.querySelector(".in-progress-header .count").innerText = inProgressCount;
    document.querySelector(".complete-header .count").innerText = completeCount;
}

function getSortedTasks() {
    if (!sortSelect || sortSelect.value === "default") {
        return tasks;
    }
    
    // Create a copy to sort without mutating the drag-and-drop order
    const sorted = [...tasks];
    
    if (sortSelect.value === "priority") {
        const pMap = { "High": 3, "Medium": 2, "Low": 1 };
        sorted.sort((a, b) => (pMap[b.priority] || 0) - (pMap[a.priority] || 0));
    } else if (sortSelect.value === "dueDate") {
        sorted.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    } else if (sortSelect.value === "alphabetical") {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return sorted;
}

// Modify the tasks.forEach inside renderTasks to use getSortedTasks()
// But wait, renderTasks uses tasks.forEach...
// I will patch renderTasks separately below.

function renderCalendar() {
    monthYearEl.innerText = `${monthNames[currentMonth]} ${currentYear}`;
    calendarGrid.innerHTML = "";

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("calendar-day", "empty");
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("calendar-day");
        
        if (day === todayDate && currentMonth === todayMonth && currentYear === todayYear) {
            dayCell.classList.add("today");
        }

        const dayNum = document.createElement("div");
        dayNum.classList.add("day-number");
        dayNum.innerText = day;
        dayCell.appendChild(dayNum);

        const mm = String(currentMonth + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        const dateString = `${currentYear}-${mm}-${dd}`;

        const dayTasks = getTasksForDate(dateString);
        
        dayTasks.forEach(task => {
            const pill = document.createElement("div");
            pill.classList.add("task-pill");
            pill.innerText = task.title;
            
            if (task.status === "todo" || !task.status) {
                pill.classList.add("pill-todo");
            } else if (task.status === "in-progress") {
                pill.classList.add("pill-inprogress");
            } else if (task.status === "complete") {
                pill.classList.add("pill-complete");
            }

            if (task.priority === "High") {
                pill.classList.add("border-high");
            } else if (task.priority === "Medium") {
                pill.classList.add("border-medium");
            } else if (task.priority === "Low") {
                pill.classList.add("border-low");
            }

            pill.addEventListener("click", () => editTask(task.id));

            dayCell.appendChild(pill);
        });

        calendarGrid.appendChild(dayCell);
    }
}

function renderTagsView() {
    const categories = ["Study", "Work", "Personal", "Health"];
    tagsBoard.innerHTML = "";

    categories.forEach(category => {
        const column = document.createElement("div");
        column.classList.add("tag-column");

        const header = document.createElement("div");
        header.classList.add("tag-header");
        let icon = "🏷";
        if(category === "Study") icon = "📚";
        if(category === "Work") icon = "💼";
        if(category === "Personal") icon = "🏠";
        if(category === "Health") icon = "❤️";
        header.innerHTML = `<h3>${icon} ${category}</h3>`;
        column.appendChild(header);

        const list = document.createElement("div");
        list.classList.add("task-list");

        const tagTasks = tasks.filter(t => t.category === category);

        tagTasks.forEach(task => {
            const card = document.createElement("div");
            card.classList.add("task-card");

            const titleEl = document.createElement("div");
            titleEl.classList.add("task-title");
            titleEl.innerText = task.title;
            
            if (task.status === "complete") {
                titleEl.style.textDecoration = "line-through";
                card.style.opacity = "0.6";
            }
            
            card.appendChild(titleEl);

            const footerEl = document.createElement("div");
            footerEl.classList.add("task-footer");
            footerEl.style.marginTop = "15px";

            const actionsEl = document.createElement("div");
            actionsEl.classList.add("task-actions");

            const completeBtn = document.createElement("button");
            completeBtn.classList.add("action-icon");
            completeBtn.innerText = "☑";
            if (task.status === "complete") {
                completeBtn.style.color = "var(--color-complete)";
                completeBtn.style.borderColor = "var(--color-complete)";
            }
            completeBtn.onclick = () => toggleComplete(task.id);

            const editBtn = document.createElement("button");
            editBtn.classList.add("action-icon");
            editBtn.innerText = "✎";
            editBtn.onclick = () => editTask(task.id);

            actionsEl.appendChild(completeBtn);
            actionsEl.appendChild(editBtn);
            footerEl.appendChild(actionsEl);

            const metaEl = document.createElement("div");
            metaEl.classList.add("task-meta");
            metaEl.style.display = "flex";
            metaEl.style.gap = "8px";
            
            if (task.priority) {
                const pSpan = document.createElement("span");
                const pIcon = task.priority === "High" ? "🔴" : task.priority === "Medium" ? "🟡" : "🟢";
                pSpan.innerText = `${pIcon} ${task.priority}`;
                metaEl.appendChild(pSpan);
            }

            if (task.dueDate) {
                const dSpan = document.createElement("span");
                dSpan.innerText = `📅 ${task.dueDate}`;
                metaEl.appendChild(dSpan);
            }

            footerEl.appendChild(metaEl);
            card.appendChild(footerEl);
            list.appendChild(card);
        });

        column.appendChild(list);
        tagsBoard.appendChild(column);
    });
}

function renderSharedView() {
    sharedBoard.innerHTML = "";
    const sharedTasks = tasks.filter(task => task.isShared);

    if (sharedTasks.length === 0) {
        sharedBoard.innerHTML = "<p style='color: #6b7280; font-weight: 500;'>No tasks have been shared with you yet.</p>";
        return;
    }

    sharedTasks.forEach(task => {
        const card = document.createElement("div");
        card.classList.add("task-card");

        const titleEl = document.createElement("div");
        titleEl.classList.add("task-title");
        titleEl.innerText = task.title;
        if (task.status === "complete") {
            titleEl.style.textDecoration = "line-through";
            card.style.opacity = "0.6";
        }
        card.appendChild(titleEl);

        const footerEl = document.createElement("div");
        footerEl.classList.add("task-footer");
        footerEl.style.marginTop = "15px";

        const actionsEl = document.createElement("div");
        actionsEl.classList.add("task-actions");

        const completeBtn = document.createElement("button");
        completeBtn.classList.add("action-icon");
        completeBtn.innerText = "☑";
        if (task.status === "complete") {
            completeBtn.style.color = "var(--color-complete)";
            completeBtn.style.borderColor = "var(--color-complete)";
        }
        completeBtn.onclick = () => toggleComplete(task.id);

        const editBtn = document.createElement("button");
        editBtn.classList.add("action-icon");
        editBtn.innerText = "✎";
        editBtn.onclick = () => editTask(task.id);

        actionsEl.appendChild(completeBtn);
        actionsEl.appendChild(editBtn);
        footerEl.appendChild(actionsEl);

        const metaEl = document.createElement("div");
        metaEl.classList.add("task-meta");
        metaEl.style.display = "flex";
        metaEl.style.gap = "8px";
        
        if (task.priority) {
            const pSpan = document.createElement("span");
            const pIcon = task.priority === "High" ? "🔴" : task.priority === "Medium" ? "🟡" : "🟢";
            pSpan.innerText = `${pIcon} ${task.priority}`;
            metaEl.appendChild(pSpan);
        }

        if (task.dueDate) {
            const dSpan = document.createElement("span");
            dSpan.innerText = `📅 ${task.dueDate}`;
            metaEl.appendChild(dSpan);
        }

        footerEl.appendChild(metaEl);
        card.appendChild(footerEl);
        
        const sharedFooter = document.createElement("div");
        sharedFooter.classList.add("shared-footer");
        
        const avatar = document.createElement("div");
        avatar.classList.add("shared-avatar");
        const name = task.sharedBy || "Unknown";
        avatar.innerText = name.charAt(0).toUpperCase();

        const sharedText = document.createElement("span");
        sharedText.innerText = `Shared by ${name}`;
        
        sharedFooter.appendChild(avatar);
        sharedFooter.appendChild(sharedText);
        
        card.appendChild(sharedFooter);
        
        sharedBoard.appendChild(card);
    });
}

// Drag over handling for Kanban columns
[todoList, inProgressList, completeList].forEach(list => {
    list.addEventListener("dragover", e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (draggable) {
            if (afterElement == null) {
                list.appendChild(draggable);
            } else {
                list.insertBefore(draggable, afterElement);
            }
        }
    });

    list.addEventListener("drop", e => {
        if (!draggedTaskId) return;
        const dropZoneId = list.id;
        let newStatus = "todo";
        if (dropZoneId === "inProgressList") newStatus = "in-progress";
        if (dropZoneId === "completeList") newStatus = "complete";

        const taskIndex = tasks.findIndex(t => t.id === draggedTaskId);
        if (taskIndex !== -1) {
            const task = tasks[taskIndex];
            task.status = newStatus;
            if (newStatus === "complete" && !task.completedAt) {
                task.completedAt = new Date().toISOString().split('T')[0];
            } else if (newStatus !== "complete") {
                task.completedAt = null;
            }
            
            tasks.splice(taskIndex, 1);
            
            const columnTasks = tasks.filter(t => t.status === newStatus);
            const cards = [...list.querySelectorAll('.task-card')];
            const dropIndexInColumn = cards.findIndex(c => c.classList.contains('dragging'));
            
            if (dropIndexInColumn === -1 || dropIndexInColumn >= columnTasks.length) {
                tasks.push(task);
            } else {
                const nextTaskId = columnTasks[dropIndexInColumn].id;
                const insertIndex = tasks.findIndex(t => t.id === nextTaskId);
                tasks.splice(insertIndex, 0, task);
            }
            
            saveTasks();
            renderApp();
        }
    });
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Initialize Application
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const taskCards = document.querySelectorAll(".task-card");
        
        taskCards.forEach(card => {
            const title = card.querySelector(".task-title")?.innerText.toLowerCase() || "";
            const desc = card.querySelector(".task-desc")?.innerText.toLowerCase() || "";
            
            if (title.includes(query) || desc.includes(query)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}

if (notifyBtn) {
    const notificationPanel = document.querySelector("#notificationPanel");
    const clearNotifsBtn = document.querySelector("#clearNotifsBtn");
    const notificationList = document.querySelector("#notificationList");

    notifyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (notificationPanel) notificationPanel.classList.toggle("show");
    });

    if (clearNotifsBtn && notificationList) {
        clearNotifsBtn.addEventListener("click", () => {
            notificationList.innerHTML = "<div class='empty-notif'>No new notifications. You're all caught up!</div>";
        });
    }

    window.addEventListener("click", (e) => {
        if (notificationPanel && !notificationPanel.contains(e.target) && e.target !== notifyBtn) {
            notificationPanel.classList.remove("show");
        }
    });
}

if (viewBtns.length === 3 && kanbanBoard) {
    viewBtns[0].addEventListener("click", () => {
        navTasksBtn.click();
        kanbanBoard.classList.add("list-mode");
        viewBtns[0].classList.add("active");
        viewBtns[1].classList.remove("active");
        viewBtns[2].classList.remove("active");
    });

    viewBtns[1].addEventListener("click", () => {
        navTasksBtn.click();
        kanbanBoard.classList.remove("list-mode");
        viewBtns[1].classList.add("active");
        viewBtns[0].classList.remove("active");
        viewBtns[2].classList.remove("active");
    });

    viewBtns[2].addEventListener("click", () => {
        navCalendarBtn.click();
    });
}

if (sortSelect) {
    sortSelect.addEventListener("change", () => {
        renderTasks();
    });
}

loadSettings();
loadChats();
loadTasks();
