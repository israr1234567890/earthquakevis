# Real-Time Earthquake Visualizer
**A High-Performance Seismology Analytics Web Application**

A React-based web dashboard visualizing global earthquake activity in real-time, designed for geologists, seismology enthusiasts, and students. It integrates live USGS data feeds to plot, cluster, and filter seismic events on an interactive map.

---

## 🚀 Key Features

*   **Interactive Leaflet Map:** Features real-time earthquake mapping with custom magnitude-scaled markers and clustering to handle thousands of events smoothly.
*   **Dynamic Analytics Dashboard:** Renders responsive data visualizations using **Recharts** representing:
    *   *Magnitude Distribution* (Pie chart breakdown).
    *   *Depth Distribution* (Bar chart detailing fault line depths).
    *   *Activity Timeline* (Area chart tracking frequency spikes).
*   **Advanced Seismology Filters:** Dynamic search filters by magnitude range, date boundaries, and geographic search parameters.
*   **State Management:** Built with **Redux Toolkit** for predictable global state management across map layers, analytics widgets, and bookmarks.
*   **UI/UX:** Styled using **Tailwind CSS** and **Material UI (MUI)** for a clean, responsive layout.

---

## 🛠️ Tech Stack & Libraries

*   **Framework:** React 18 & Vite (ES Modules)
*   **Styling:** Tailwind CSS & Material UI (MUI)
*   **Mapping:** Leaflet & React-Leaflet
*   **Charts:** Recharts
*   **State Management:** Redux Toolkit & React-Redux
*   **Testing:** Vitest & React Testing Library

---

## 🧪 Testing

The repository contains unit tests covering telemetry formatters and coordinate parsing:

To execute the test suite:
```bash
npm run test
```

---

## 🛠️ Quick Start (Local Setup)

1.  **Clone & Navigate:**
    ```bash
    git clone https://github.com/israr1234567890/earthquakevis.git
    cd earthquakevis
    ```
2.  **Install Node Modules:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    *Open [http://localhost:5173](http://localhost:5173) in your browser.*
