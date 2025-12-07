## TesseraOS MVP (Core Scope)

**Features in first slice**
- Projects + Tasks: create project, add tasks, assign, due dates, list + board views (no recurrence/custom fields/timelines/tags/templates).
- Clients + Portal: create client, client login, view assigned projects/tasks/invoices, project messaging; minimal—no tags/notes/activity logs.
- Invoicing: create invoice, items (name/qty/rate), PDF download, mark paid/unpaid; no subscriptions/partials/gateways.
- Messaging: project-based chat, text-only + file upload; no canned replies/widgets/scheduling/groups.
- File Manager: upload, attach to project, download; no public links/previews/permission layers/colors.

**Architecture**
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind/CSS vars, TanStack Query, NextAuth (JWT). Client portal is a dedicated surface with restricted data.
- Backend: NestJS (modular), Prisma ORM, PostgreSQL, Redis (sessions/cache/rate limits), S3-compatible storage (AWS/MinIO) for files and chat uploads.
- APIs: REST now, DTOs ready for GraphQL later. Auth via JWT; role guard for admin/member vs client. File uploads via signed URLs.

**Backend modules (MVP)**
- Auth, Users, Clients, Projects, Tasks (list/board), Invoices (with items + PDF), Messages (project chat), Files (metadata + storage), Portal (client-scoped fetches).

**Data model (high level)**
- User, Client, Project, Task, Invoice, InvoiceItem, Message, File. Tasks and invoices always belong to a project; project ties to a client. Clients see only their projects.

**Dev workflow**
- Separate `backend/` and `frontend/` packages. Docker Compose for Postgres + MinIO + Redis. CI: lint/test/build. Environment samples per app.

---

## **1. Import / Export**

* Import tasks, projects, calendar items, contacts and other data from anywhere.

---

## **2. Dashboards & Client Portals**

* Fully customizable dashboards and branded portals.
* Interactive graphs (bar, pie, line, etc).
* Real-time metrics and goals.
* Dynamic content per logged-in user.
* Rich media (images, videos, HTML widgets).
* Multi-page dashboards.
* Different dashboards per role.
* Pull data from third-party sources.
* Built-in design editor.
* Widgets: income over time, billable hours, labor costs, task lists, proposals sent, image widget, calendar widgets, custom HTML.

---

## **3. Task Management**

* Custom fields, colored tags.
* Checklists and task templates.
* Descriptions and comments.
* Start dates, due dates, recurring tasks.
* Reminders (email/push).
* Delegation and followers.
* @Mentions.
* File uploads (local, Drive, Facebook, FTP and links).
* Move/copy tasks across projects and boards.
* Unique public link.
* Multiple views: list, columns, timeline.
* Task boards with drag and drop.

---

## **4. Time Tracking**

* Instant time tracking or manual logging.
* Billable vs non-billable.
* Project-level timesheets.
* Edit logged time.
* Print-ready and downloadable XLSX.
* Invoice automation from timesheets.
* Real-time stats.
* Public shared timesheet link.
* Email sending with attached timesheet.

---

## **5. Project Management**

* Clean project dashboard.
* Project templates.
* Custom fields and custom statuses.
* Real-time progress bar.
* File uploads.
* Project brief.
* Tags and colored tags.
* Start and deadline dates.
* Per-project currency and hourly rate.
* Contributors and conversations.
* Public view for tasks.
* Override permissions.
* Views: list, cards, timeline.

---

## **6. Invoicing**

* Payment methods: Stripe, PayPal, bank.
* Multi-currency and subscriptions.
* Split payment schedules.
* Custom fields.
* Send and track opens/payments.
* Mark paid/unpaid.
* PDF download.
* Discounts and tax.
* References and footers.
* Auto issue/due dates.
* Auto client details.
* Attach to projects.
* Public invoice link.
* Custom numbering.
* Billable tasks auto import.
* Push notifications.
* Auto receipts.
* Drag and drop editor.
* CSS styling.
* Item templates.
* Invoice generator.

---

## **7. Proposals**

* Drag and drop builder.
* Items, required/optional flags.
* Packages.
* Blocks: video, text, table, images.
* Electronic signatures.
* View/sign tracking.
* Automation (create project + invoice).
* Adjustable quantities.
* Manual approval.
* PDF download.
* Templates.
* Auto creation and expiry dates.
* Assign to client or project.
* Public link.
* Notifications.

---

## **8. Contracts**

* E-signatures.
* Multiple signees.
* Block-based editor.
* Track views/signatures.
* PDF download.
* Templates.
* Attach to proposals.
* Public sharing link.

---

## **9. Client Management**

* Profiles with complete details.
* Private notes.
* Log activities (calls, meetings, etc).
* Company profiles.
* Invite people.
* Custom fields and colored tags.
* Online/offline status.
* Local time.
* Archive profiles.

---

## **10. Inbox & Messaging**

* Direct messages and group chat.
* Email replies from inbox.
* Email sync (Gmail/Outlook).
* People view grouping.
* Website/app chat widgets.
* Canned responses.
* Convert to tasks.
* Snooze, send later.
* Auto-save drafts.
* Custom statuses.
* File attachments.
* Unlimited chat widgets.
* Rich formatting.
* Auto-assign.
* Conversation IDs.
* Lead collection.
* Delegation.
* Availability windows.
* Embed anywhere.
* Mobile friendly.

---

## **11. Wiki**

* Unlimited workspaces.
* Fully customizable blocks (images, tables, videos).
* Private docs for internal notes.
* Team knowledge base.
* Public help center.

---

## **12. Forms & Surveys**

* Drag and drop editor.
* Intro page and confirmation page.
* Activation/expiration dates.
* Submission limits.
* Response viewer with sorting, notes, and search.
* Templates.
* Shareable link or embed.
* Customizable design or stylesheet.
* Field types: short text, long text, dropdown, multi choice, image choice, name, email, phone, address, date/time, numbers, links, file uploads, signatures, payments (Stripe/PayPal).
* Advanced options (placeholders, tooltips, warnings).

---

## **13. File Manager**

* Unlimited folders with colors.
* Permission control.
* Shareable folders.
* File request uploads without login.
* Previews (Docs, PPT, Excel, video).
* Reusable assets.

---

## **14. Documents**

* Create and edit docs inside the app.

---

## **15. Calendar**

* View tasks, projects, invoices.
* Events with due dates.
* Google sync.
* Calendar feed for external apps.

---

## **16. Integrations**

* Public API.
* Zapier (500+ apps).
* Integromat.
* Stripe, Square, PayPal.
* Google Calendar.

---

## **17. Branding**

* White-label.
* Custom domain.
* Custom email address.
* Upload logo.
* Customize interface colors.

---

## **18. General Features**

* Multiple workspaces.
* 25 languages.
* User roles and permissions.
* Client portals.
* Dark mode.
* Personal time/date formats.
* Default colors.
* Notifications.
* Daily digest emails.
* Activity feed.

---
