
# 🏥 Dental Center Management System - Entnt Assignment
Live Link: https://dental-management-system-alpha.vercel.app/
## ✨ Overview

This project is a comprehensive web application developed for managing dental center operations. Its primary function is to provide role-based access for dental practice management, supporting both Administrators (Dentists) and Patients with tailored interfaces and functionality. The system enables efficient patient management, appointment scheduling, and medical record tracking through an intuitive web interface.

## 🚀 Features

*   **Role-Based Access Control:** Separate interfaces and permissions for Administrators and Patients with secure authentication.
*   **Patient Management:** Complete CRUD operations for patient records, medical history, and personal information.
*   **Appointment Scheduling:** Interactive calendar view with appointment booking, rescheduling, and status tracking.
*   **Medical Records:** Secure storage and retrieval of patient medical records, treatment history, and file attachments.
*   **Dashboard Analytics:** Visual insights into practice statistics, appointment trends, and patient demographics.
*   **Responsive Design:** Mobile-friendly interface that works seamlessly across all devices.

## **Project Structure** 🗂️

```markdown
dental-center-management/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui reusable components
│   │   ├── Layout.tsx      # Main application shell
│   │   ├── Dashboard.tsx   # Role-based dashboard
│   │   ├── Login.tsx       # Authentication interface
│   │   ├── PatientManagement.tsx    # Admin patient CRUD
│   │   ├── AppointmentManagement.tsx # Scheduling interface
│   │   ├── CalendarView.tsx         # Calendar visualization
│   │   ├── PatientView.tsx          # Patient dashboard
│   │   └── PatientRecords.tsx       # Patient record access
│   ├── contexts/
│   │   └── AppContext.tsx  # Global state management
│   ├── hooks/
│   │   └── use-toast.ts    # Toast notification utilities
│   ├── lib/
│   │   └── utils.ts        # Shared utility functions
│   ├── pages/
│   │   └── NotFound.tsx    # 404 error handling
│   └── App.tsx             # Root application component
├── public/                 # Static assets
├── docs/                   # Optional: Directory for documentation/images
│   └── images/
│       └── workflow.png    # High-level workflow diagram image
├── .gitignore             # Specifies intentionally untracked files
├── package.json           # Node.js dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite build configuration
└── README.md              # This file
```

## 🏗️ Architecture

The application follows a modern React architecture with client-side state management:

**Frontend (React + TypeScript + Tailwind):** Provides the complete user interface with role-based navigation. Built with React 18, TypeScript for type safety, and Tailwind CSS for responsive styling.

**State Management (React Context + useReducer):** Centralized application state using React Context API with useReducer for predictable state updates and localStorage integration for data persistence.

**Component Architecture:** Modular design with presentational components (ui/), container components with business logic, and page-level routing components.

**Data Persistence (localStorage):** Client-side data storage for demo purposes, allowing full CRUD operations without backend infrastructure.

**Authentication System:** Simulated role-based authentication with session persistence and automatic login restoration.



## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Vite (build tool)
- React Router v6

**UI Components:**
- shadcn/ui
- Radix UI primitives
- Lucide React (icons)
- Sonner (toast notifications)

**State Management:**
- React Context API
- useReducer pattern
- localStorage integration

**Additional Libraries:**
- React Hook Form + Zod (form handling)
- date-fns (date manipulation)
- Recharts (data visualization)
- TanStack React Query (prepared for future API integration)

## ⚙️ Installation and Setup

To run this project locally, follow these steps:

### Prerequisites
- Node.js (v18 or higher) and npm installed
- Modern web browser with localStorage support

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd dental-center-management
   ```
   *(Replace <repository_url> with the actual URL of your repository)*

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The application should start and be accessible at `http://localhost:5173`

4. **Build for Production:**
   ```bash
   npm run build
   ```

5. **Preview Production Build:**
   ```bash
   npm run preview
   ```

## 💡 Usage

Once the application is running, open your web browser to `http://localhost:5173`.

### Demo User Accounts

**Admin Account (Full Access):**
- Email: `admin@entnt.in`
- Password: `admin123`
- Access: All features, patient management, appointment scheduling

**Patient Accounts (Limited Access):**
- Email: `john@entnt.in` / Password: `patient123`
- Email: `jane@entnt.in` / Password: `patient123`
- Access: Personal dashboard, own appointments/records only

### Key Features Usage:

1. **Login** with one of the demo accounts above
2. **Dashboard** provides role-specific overview and navigation
3. **Patient Management** (Admin only) - Add, edit, delete patient records
4. **Appointments** - Schedule, view, and manage appointments with calendar integration
5. **Medical Records** - Access treatment history and upload medical files
6. **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## ⏭️ Future Enhancements

- **Backend Integration:** Replace localStorage with REST API and database
- **Real-time Updates:** WebSocket integration for live appointment notifications
- **Advanced Reporting:** Export capabilities and detailed analytics dashboard
- **Multi-clinic Support:** Manage multiple dental practice locations
- **Mobile App:** React Native companion application
- **Integration APIs:** Connect with insurance providers and payment gateways
- **Enhanced Security:** JWT authentication, data encryption, and audit logging
- **Telehealth Features:** Video consultation capabilities
- **Automated Reminders:** SMS/Email appointment reminders
- **Billing Integration:** Invoice generation and payment processing

## 🔐 Security Considerations

**Current Limitations:**
- Frontend-only authentication (demo purposes)
- Client-side data storage (not suitable for production)
- No data encryption or backup mechanisms

**Production Requirements:**
- Implement proper backend authentication
- Use secure database storage
- Add data encryption and HIPAA compliance measures
- Implement proper session management and CSRF protection

## 📱 Browser Compatibility

- **Supported:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Requirements:** JavaScript enabled, localStorage support
- **Mobile:** Responsive design optimized for iOS and Android browsers

---

