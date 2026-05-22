# Frontend Assessment Answers — HabitLoop

### 1. How to run
You don't need to install anything or run any commands in the terminal. Since this is built using pure **HTML, CSS, and Vanilla JavaScript**, you can run it easily:
1. Clone or download this project folder.
2. Simply double-click the `index.html` file to open it directly in any web browser.
3. Alternatively, if you use VS Code, you can right-click `index.html` and click **"Open with Live Server"**.

---

### 2. Stack & design choices
* **Frontend Stack:** I chose vanilla **HTML5, CSS3, and native JavaScript** because the project didn't require heavy framework features like routing or complex state management. Using pure JS keeps the application super lightweight, fast, and removes unnecessary `node_modules` clutter. It also makes it very easy to directly save data into `localStorage`.
* **Design Decision 1 (Weekly Grid):** I chose a **horizontal 7-day layout** instead of a simple vertical list. For a habit tracker, seeing the whole week at a glance is very important. It gives clear visual feedback, when you see an empty spot, you feel motivated to fill it, and seeing a row of checkmarks feels like a win.
* **Design Decision 2 (Dark Green Theme & Contrast):** I used a **deep dark forest green background** with a **bright mint green color** for the brand name and the main "+ New Habit" button. This makes the main action items pop out immediately against the dark background, guiding the user's eyes directly to where they need to click.

---

### 3. Responsive & accessibility
* **360px Phone vs 1440px Laptop:** On a big laptop screen, the app displays a wide dashboard grid where everything sits perfectly side-by-side. But on a small 360px mobile screen, a 7-day horizontal grid would get cut off or look squished. To fix this, I used CSS media queries to change the layout entirely on mobile, it stacks the days vertically , making it clean and easy to tap on phones.
* **Accessibility Handled:** I made sure the text inside the bright mint green buttons is a very dark color instead of white. This creates a strong contrast, making the button text completely readable for everyone. I also used correct HTML tags like `<header>`, `<main>`, and `<button>` instead of just using `<div>` for everything.
* **Accessibility Skipped:** I did not fully implement custom keyboard navigation (like using the Tab key to perfectly navigate through the expanded mobile rows) . My main focus was on getting the responsive layout and storage logic working first.

---

### 4. AI usage
* **Tools Used:** I used an AI assistant to help me refine the layout, tweak the colors, and fix responsive design issues.

* **What I asked & what it gave:** I asked for CSS structures to build a dark UI theme and clean media queries for mobile devices.

* **What I modified manually:** The AI provided the JavaScript event listener logic for the `+ Create Habit` button, but it only saved the new habit data directly into the localStorage object. It failed to update the visual layout inline, meaning the new habit wouldn't appear on the screen unless the user manually reloaded the entire page. I modified the function by inserting a direct call to the app's dynamic rendering system `(renderApp())` right after the state push, forcing the UI grid to refresh and instantly showcase the new habit row without any full-page lag.

---

### 5. Honest gap
I would implement a manual reordering or drag-and-drop feature for the habits. Currently, when a new habit is added, it just appends to the bottom of the list. If a user has 10+ habits, it can get cluttered, and they might want to prioritize important habits at the top. I would also add a small "Total Completion Rate" percentage stats section at the top of the dashboard so users can see their overall performance for the week, which would make the tracker much more insightful.