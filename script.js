document.addEventListener('DOMContentLoaded', () => {
    const moods = ["😊", "🤩", "😐", "😔", "😠"];
    const moodButtons = document.querySelectorAll(".mood-btn");
    const submitButton = document.getElementById("submit-btn");
    const moodCalendar = document.getElementById("mood-calendar");
    const weeklyViewBtn = document.getElementById("weekly-view");
    const monthlyViewBtn = document.getElementById("monthly-view");

    const today = new Date();
    const todayKey = today.toISOString().split("T")[0];
    let savedMoods = JSON.parse(localStorage.getItem("moodData")) || {};
    let selectedMood = null;

    // Handle Mood Selection
    moodButtons.forEach(button => {
        button.addEventListener("click", () => {
            moodButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            selectedMood = button.dataset.mood;
        });
    });

    // Save Mood
    submitButton.addEventListener("click", () => {
        if (!selectedMood) {
            alert("Please select a mood!");
            return;
        }
        savedMoods[todayKey] = selectedMood;
        localStorage.setItem("moodData", JSON.stringify(savedMoods));
        renderWeeklyView();
    });

    // Generate Random Past Moods for Demo
    function generateRandomMoods() {
        let pastDate = new Date();
        for (let i = 0; i < 30; i++) {
            pastDate.setDate(today.getDate() - i);
            let dateKey = pastDate.toISOString().split("T")[0];
            if (!savedMoods[dateKey]) {
                savedMoods[dateKey] = moods[Math.floor(Math.random() * moods.length)];
            }
        }
        localStorage.setItem("moodData", JSON.stringify(savedMoods));
    }

    // Weekly View
    function renderWeeklyView() {
        moodCalendar.innerHTML = "";
        moodCalendar.className = "calendar-container weekly";
        let pastDate = new Date();
        pastDate.setDate(today.getDate() - 6);

        for (let i = 0; i < 7; i++) {
            let dateKey = pastDate.toISOString().split("T")[0];
            let mood = savedMoods[dateKey] || "";
            let cell = createCalendarCell(pastDate.getDate(), mood, dateKey);
            moodCalendar.appendChild(cell);
            pastDate.setDate(pastDate.getDate() + 1);
        }
    }

    // Monthly View
    function renderMonthlyView() {
        moodCalendar.innerHTML = "";
        moodCalendar.className = "calendar-container monthly";

        let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        let lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        let startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        // Fill Empty Cells Before First Date
        for (let i = 0; i < startDay; i++) {
            moodCalendar.appendChild(document.createElement("div"));
        }

        // Fill Calendar with Mood Data
        for (let day = 1; day <= lastDay.getDate(); day++) {
            let dateKey = new Date(today.getFullYear(), today.getMonth(), day).toISOString().split("T")[0];
            let mood = savedMoods[dateKey] || "";
            let cell = createCalendarCell(day, mood, dateKey);
            moodCalendar.appendChild(cell);
        }
    }

    // Create Calendar Cell
    function createCalendarCell(day, mood, dateKey) {
        let cell = document.createElement("div");
        cell.classList.add("calendar-cell");
        if (dateKey === todayKey) cell.classList.add("today");

        let dateLabel = document.createElement("span");
        dateLabel.classList.add("date-label");
        dateLabel.textContent = day;

        let moodIcon = document.createElement("span");
        moodIcon.classList.add("mood-icon");
        moodIcon.textContent = mood;

        cell.appendChild(dateLabel);
        cell.appendChild(moodIcon);
        return cell;
    }

    // Toggle Views
    weeklyViewBtn.addEventListener("click", () => {
        renderWeeklyView();
        weeklyViewBtn.classList.add("active");
        monthlyViewBtn.classList.remove("active");
    });

    monthlyViewBtn.addEventListener("click", () => {
        renderMonthlyView();
        monthlyViewBtn.classList.add("active");
        weeklyViewBtn.classList.remove("active");
    });

    // Initialize
    generateRandomMoods();
    renderWeeklyView();
});
