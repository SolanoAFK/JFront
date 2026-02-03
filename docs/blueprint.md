# **App Name**: BuildFlow

## Core Features:

- User Authentication: Secure login and registration using the REST API. Utilizes JWT stored in local storage for session management.
- Dashboard: A central hub displaying key project metrics such as active projects, budget summaries, and recent activity.
- Project Management: Create, read, update, and delete projects, including setting budgets, timelines, and assigning resources. Automatic budget control with REST API.
- Phase and Subphase Management: Organize projects into phases and subphases, tracking progress and dependencies. Drag & drop interface to manage the workflow and kanban board subphase management.
- Expense Tracking: Record and categorize expenses, linking them to specific projects and phases, automatically updating the remaining budget with REST API. The user will receive feedback of visual alert if less than 10% of budget is left.
- Supplier Management: Maintain a database of suppliers, including contact information and service types.
- User Role Management: Administrator interface for managing user accounts and roles (ADMIN, GERENTE, SUPERVISOR).

## Style Guidelines:

- Primary color: Deep sky blue (#007bff) for primary actions and branding.
- Background color: Off-white (#f8f9fa) to provide a clean and neutral backdrop.
- Accent color: Emerald green (#28a745) to indicate success and positive actions.
- Body and headline font: 'Inter' sans-serif for a clean and modern interface, suitable for both headlines and body text.
- Code font: 'Source Code Pro' for displaying code snippets.
- Lucide React icons for clear, consistent visual cues throughout the application.
- Responsive layout adapting to desktop, tablet, and mobile devices with a fixed sidebar on desktop and a drawer on mobile.