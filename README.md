# Emergency Response Command Center
## Real-Time Emergency Monitoring and Response Management System

A high-tech, futuristic **Emergency Operations Center (EOC) Dashboard** built with Angular, TypeScript, HTML5, and SCSS. Designed for real-time monitoring of city emergencies, response team telemetry, interactive geospatial dispatch, and situational awareness.

---

### Key Highlights
- **100% Frontend-Only:** Completely self-contained, offline-capable, and requires zero external databases, Firebase, or paid API keys.
- **Futuristic Command Center Theme:** Deep charcoal glassmorphism panels, glowing critical alerts, cyan telemetry indicators, radar sweep vector effects, and technical typography.
- **Simulated Real-Time Data:** Live telemetry ticker updating active incidents, team dispatch statuses, and average response times every few seconds.
- **Interactive Geospatial City Map:** Vector SVG map of city sectors (Anna Nagar, Guindy, Adyar, T Nagar, Velachery, Central Zone, Marina Promenade) with pulsing severity markers and one-click detailed incident inspection.
- **Tactical Response Team Fleet:** Comprehensive tracking of 26 units across Police (12), Fire & Rescue (6), and Ambulance (8) with dynamic assignment and status toggling.
- **Built-in Synthetic Audio:** Native Web Audio API sound effects for alerts, sirens, and radio clicks without requiring external audio files.

---

### Default Credentials
For demonstration and evaluation:
- **Username:** `admin`
- **Password:** `admin123`

---

### How to Run Locally with Angular CLI

#### 1. Navigate to the Angular project:
```bash
cd angular-project
```

#### 2. Install dependencies:
```bash
npm install
```

#### 3. Start the development server:
```bash
ng serve
```
or:
```bash
npm start
```

#### 4. Open in browser:
Navigate to:
```
http://localhost:4200/
```

---

### Project Architecture

```
angular-project/
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss
│   └── app/
│       ├── app.component.ts/.html/.scss
│       ├── app.config.ts
│       ├── app.routes.ts
│       ├── models/
│       │   ├── incident.model.ts
│       │   ├── response-team.model.ts
│       │   ├── alert.model.ts
│       │   └── dashboard-stats.model.ts
│       ├── services/
│       │   ├── incident.service.ts
│       │   ├── response-team.service.ts
│       │   ├── alert.service.ts
│       │   └── settings.service.ts
│       └── components/
│           ├── login/
│           ├── dashboard/
│           ├── navbar/
│           ├── sidebar/
│           ├── stat-card/
│           ├── incident-map/
│           ├── incident-modal/
│           ├── incidents/
│           ├── response-teams/
│           ├── alerts/
│           ├── analytics/
│           └── settings/
```

---

### College Project Evaluation Summary
- **Framework:** Angular 19+ (Standalone Components, RxJS reactive state, Angular Router)
- **Styling:** Custom SCSS with CSS custom properties (`--bg-primary`, `--panel`, `--critical`, `--info`, `--warning`)
- **Visuals:** High-contrast tactical UI, animated markers, radar scan line, glassmorphism
- **Offline Reliability:** Zero external API dependencies; runs seamlessly on any system.
