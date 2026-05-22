let habits = JSON.parse(localStorage.getItem('habits')) || [];
let currentAnchorDate = new Date(); 

const habitGrid = document.getElementById('habit-grid');
const weekRangeLabel = document.getElementById('week-range-label');
const emptyState = document.getElementById('empty-state');
const gridWrapper = document.getElementById('grid-wrapper');

const habitModal = document.getElementById('habit-modal');
const habitForm = document.getElementById('habit-form');
const habitNameInput = document.getElementById('habit-name');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const emptyStateAddBtn = document.getElementById('empty-state-add-btn');

const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');
const todayBtn = document.getElementById('today-btn');

function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    const monday = new Date(d.setDate(diff));
    monday.setHours(0,0,0,0);
    return monday;
}

function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function generateWeekDays(mondayDate) {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(mondayDate);
        nextDay.setDate(mondayDate.getDate() + i);
        days.push(nextDay);
    }
    return days;
}

function calculateCurrentStreak(habit) {
    const todayStr = formatDateString(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDateString(yesterday);

    let streak = 0;
    let checkDate = new Date();

    if (!habit.history[todayStr] && habit.history[yesterdayStr]) {
        checkDate = yesterday;
    } else if (!habit.history[todayStr] && !habit.history[yesterdayStr]) {
        return 0;
    }

    while (true) {
        const dateStr = formatDateString(checkDate);
        if (habit.history[dateStr]) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

function renderApp() {
    const currentMonday = getMonday(currentAnchorDate);
    const weekDays = generateWeekDays(currentMonday);
    const todayStr = formatDateString(new Date());

    const options = { month: 'short', day: 'numeric' };
    weekRangeLabel.textContent = `${weekDays[0].toLocaleDateString('en-US', options)} – ${weekDays[6].toLocaleDateString('en-US', options)}, ${weekDays[6].getFullYear()}`;

    if (habits.length === 0) {
        emptyState.classList.remove('hidden');
        gridWrapper.classList.add('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
        gridWrapper.classList.remove('hidden');
    }

    habitGrid.innerHTML = '';

    const headerRow = document.createElement('div');
    headerRow.className = 'grid-row header-row';

    const cornerHeader = document.createElement('div');
    cornerHeader.className = 'cell grid-header-cell habit-info-cell';
    cornerHeader.textContent = 'Habits';
    headerRow.appendChild(cornerHeader);

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    weekDays.forEach((date, index) => {
        const dayHeader = document.createElement('div');
        const dateStr = formatDateString(date);
        
        dayHeader.className = 'cell grid-header-cell day-column';
        if (dateStr === todayStr) dayHeader.classList.add('is-today');

        dayHeader.innerHTML = `
            <div>${dayNames[index]}</div>
            <div class="header-date">${date.getDate()}</div>
        `;
        headerRow.appendChild(dayHeader);
    });

    const streakHeader = document.createElement('div');
    streakHeader.className = 'cell grid-header-cell streak-cell';
    streakHeader.textContent = 'Streak';
    headerRow.appendChild(streakHeader);
    
    habitGrid.appendChild(headerRow);

    habits.forEach(habit => {
        const habitContainer = document.createElement('div');
        habitContainer.className = 'habit-row-container';

        const mainRow = document.createElement('div');
        mainRow.className = 'grid-row habit-main-row';

        const infoCell = document.createElement('div');
        infoCell.className = 'cell habit-info-cell dynamic-toggle';
        infoCell.innerHTML = `
            <button class="delete-habit-btn" data-id="${habit.id}" aria-label="Delete ${habit.name}">🗑️</button>
            <span class="habit-title">${habit.name}</span>
            <span class="dropdown-arrow">▼</span>
        `;
        mainRow.appendChild(infoCell);

        const mobileDaysPanel = document.createElement('div');
        mobileDaysPanel.className = 'mobile-days-panel hidden';

        weekDays.forEach((date, index) => {
            const dateStr = formatDateString(date);
            const isChecked = habit.history[dateStr] || false;
            const isToday = dateStr === todayStr;
            const isFuture = date.getTime() > new Date().setHours(23,59,59,999);

            const cell = document.createElement('div');
            cell.className = 'cell day-column';
            if (isToday) cell.classList.add('is-today');
            if (isFuture) cell.classList.add('is-future');

            const checkboxHTML = `
                <label class="checkbox-container">
                    <input type="checkbox" 
                           data-habit-id="${habit.id}" 
                           data-date="${dateStr}" 
                           ${isChecked ? 'checked' : ''} 
                           ${isFuture ? 'disabled' : ''}>
                    <span class="checkmark"></span>
                </label>
            `;
            
            cell.innerHTML = checkboxHTML;
            mainRow.appendChild(cell);

            const mobileRow = document.createElement('div');
            mobileRow.className = `mobile-day-row ${isToday ? 'is-today' : ''} ${isFuture ? 'is-future' : ''}`;
            mobileRow.innerHTML = `
                <span class="mobile-day-label">${dayNames[index]} ${date.getDate()}</span>
                ${checkboxHTML}
            `;
            mobileDaysPanel.appendChild(mobileRow);
        });

        const currentStreak = calculateCurrentStreak(habit);
        const streakCell = document.createElement('div');
        streakCell.className = 'cell streak-cell';
        if (currentStreak > 0) streakCell.classList.add('has-streak');
        streakCell.innerHTML = `<span class="streak-count">🔥 ${currentStreak}d</span>`;
        mainRow.appendChild(streakCell);

        habitContainer.appendChild(mainRow);
        habitContainer.appendChild(mobileDaysPanel);
        habitGrid.appendChild(habitContainer);
    });
}

function saveToLocalStorage() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

const toggleModal = () => habitModal.classList.toggle('hidden');
openModalBtn.addEventListener('click', toggleModal);
closeModalBtn.addEventListener('click', toggleModal);
emptyStateAddBtn.addEventListener('click', toggleModal);

window.addEventListener('click', (e) => {
    if (e.target === habitModal) toggleModal();
});

habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = habitNameInput.value.trim();
    if (!name) return;

    const newHabit = {
        id: 'habit_' + Date.now(),
        name: name,
        history: {}
    };

    habits.push(newHabit);
    saveToLocalStorage();
    habitForm.reset();
    toggleModal();
    renderApp();
});

habitGrid.addEventListener('change', (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
        const habitId = e.target.dataset.habitId;
        const dateStr = e.target.dataset.date;
        const isChecked = e.target.checked;

        const habit = habits.find(h => h.id === habitId);
        if (habit) {
            if (isChecked) {
                habit.history[dateStr] = true;
            } else {
                delete habit.history[dateStr];
            }
            saveToLocalStorage();
            renderApp();
        }
    }
});

habitGrid.addEventListener('click', (e) => {
    if (e.target.matches('.delete-habit-btn')) {
        const habitId = e.target.dataset.id;
        if (confirm('Are you sure you want to delete this habit?')) {
            habits = habits.filter(h => h.id !== habitId);
            saveToLocalStorage();
            renderApp();
        }
        return;
    }

    const toggleZone = e.target.closest('.dynamic-toggle');
    if (toggleZone && window.innerWidth <= 768) {
        const container = toggleZone.closest('.habit-row-container');
        const panel = container.querySelector('.mobile-days-panel');
        const arrow = toggleZone.querySelector('.dropdown-arrow');
        
        if (panel) {
            const isHidden = panel.classList.toggle('hidden');
            arrow.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }
});

prevWeekBtn.addEventListener('click', () => {
    currentAnchorDate.setDate(currentAnchorDate.getDate() - 7);
    renderApp();
});

nextWeekBtn.addEventListener('click', () => {
    currentAnchorDate.setDate(currentAnchorDate.getDate() + 7);
    renderApp();
});

todayBtn.addEventListener('click', () => {
    currentAnchorDate = new Date();
    renderApp();
});

document.addEventListener('DOMContentLoaded', renderApp);