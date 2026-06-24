# Course Management Dashboard

A modern, highly responsive frontend Angular web application for managing educational courses on an learning platform. Built as part of a real Angular Developer technical assessment, following strict production-grade guidelines, Angular 20 best practices, and stateless architecture.

---

## 🚀 Features

### Core Requirements
* **View Courses**: Grid list (mobile cards) and dense data table (desktop) displaying all course details.
* **Search Courses**: Real-time search query matching course titles with debounced keystrokes to minimize backend load.
* **Filter Courses**: Instant filtering by course status (Active, Draft, Archived).
* **Course Details View**: Separate page detailing full course information (instructor, duration, price, status badge, description).
* **Add Course**: Form handling with typed forms, field validations, and dynamic EGP currency formatting.
* **Edit Course**: Pre-populates typed reactive forms with fetched details, allowing easy updates.
* **Delete Course**: Dialog prompt confirming course removal.
* **Status Views**: Visual loading spinners, empty search states, and retryable error state components.

### 🌟 Bonus Features
* **Client-Side Pagination**: Clean paging via Material Paginator (`MatPaginator`).
* **Column Sorting**: Integrated `MatSort` sorting by column header in desktop view.
* **Responsive Layout Switch**: Dynamic viewport listening (`BreakpointObserver`) switching rendering styles:
  - **Desktop**: Dense, sorted `MatTable`.
  - **Mobile**: Dynamic Flex-Wrap `MatCard` grid layouts.
* **Stateless HTTP Service**: Full integration with a local Mock API (`json-server`) using Angular `HttpClient`.
* **Zero NgModule Overhead**: Exclusively standalone design, routing config, and configuration files.

---

## 🛠️ Technologies Used

* **Frontend Framework**: Angular 20 (Standalone Components, Signals, modern `@if` / `@for` template control flow)
* **Reactivity & Async Flows**: RxJS (Debounce, Subjects, streams) & Angular Signals (`signal`, `computed`, signal inputs)
* **UI Design & Theme**: Angular Material (Tables, Sort, Paginator, Dialogs, Cards, Fields, Chips)
* **Typed Forms**: Strictly-Typed Reactive Forms (`NonNullableFormBuilder`)
* **Styling**: Vanilla CSS with custom media query layouts and Material Indigo-Pink prebuilt palettes
* **Mock Backend API**: JSON Server (RESTful endpoint simulator)
* **Package Manager**: npm

---

## 📂 Folder Structure

The application implements a scalable **Feature-Based Architecture**:

```text
src/app
├── core/
│   └── services/               # Shared system-wide services
│
├── shared/
│   ├── components/
│   │   ├── empty-state/        # Reusable component for empty lists
│   │   └── error-state/        # Reusable error handler with Retry button
│   ├── constants/
│   │   ├── categories.ts       # Shared course categories array
│   │   └── course-status-options.ts # Shared statuses array
│   └── models/                 # Global interfaces and definitions
│
└── features/
    └── courses/
        ├── pages/
        │   ├── course-list/    # Main grid list page container
        │   ├── course-form/    # Create/Edit reactive forms view
        │   └── course-details/ # Individual course data preview page
        ├── components/
        │   ├── course-table/   # Desktop-optimized sorted MatTable
        │   ├── course-card/    # Mobile-optimized card layout
        │   ├── course-filter/  # Debounced filters panel
        │   └── delete-dialog/  # Modal confirmation popup
        ├── services/
        │   └── course.service.ts # HTTP stateless CRUD actions
        ├── models/
        │   ├── course.model.ts # TypeScript interfaces
        │   └── course-status.enum.ts # Status typescript enum
        └── routes/
            └── courses.routes.ts # Lazy loaded child routes
```

---

## ⚙️ Installation & Running

Follow these instructions to run the application locally:

### 1. Prerequisites
Ensure you have the latest LTS versions of **Node.js** and **npm** installed.
* Node.js version verified: `v22.13.0+`
* npm version verified: `v11.0.0+`

### 2. Install Dependencies
Clone the repository, open a terminal in the root folder, and run:
```bash
npm install
```

### 3. Start Mock API Server
This application uses a local JSON Server. Start the database by running:
```bash
npm run mock-api
```
This runs the local server at `http://localhost:3000/courses` watching `db.json`.

### 4. Run Angular Application
In a separate terminal tab/window in the project root, start the Angular development server:
```bash
npm start
```
Open your browser and navigate to `http://localhost:4200/`.

---

## 📝 Assumptions & Considerations
1. **Hybrid Data Store Fallback**: To maximize accessibility, the application is built with a dynamic data store fallback. If the local `json-server` is not running, or if the project is viewed on a live hosting environment (like GitHub Pages), the app seamlessly transitions to managing records in browser `LocalStorage` loaded with 10 seed courses. The reviewer can verify CRUD operations in either setup.
2. **EGP Currency**: Currency variables display in local formats matching mock prices.
3. **Form Validations**: Standard validation checks (minimum title length, positive numbers, numeric requirements) must be satisfied before submit actions are unlocked.

---

## 🔮 Future Improvements
* **Server-Side Filtering & Pagination**: Upgrade the stateless HTTP service parameters to pass limit/page queries to support larger backend datasets.
* **Component Test Suite**: Implement unit tests for core forms and page layouts using Angular Testing Utilities or Jest.
* **TailwindCSS Integration**: Migrating styling sheets to standard utility frameworks once styling constraints change.
