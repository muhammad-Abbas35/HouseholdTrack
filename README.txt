HOUSEHOLDTRACK — WORKING WEB PROTOTYPE

HOW TO RUN
1. Extract the ZIP folder.
2. Open the folder.
3. Double-click index.html (Chrome or Edge recommended).
4. Internet connection is needed to load Bootstrap and Bootstrap Icons from CDN.

WHAT YOU CAN DEMONSTRATE
- District dashboard with sample household and population figures.
- Household records table with search and area/status filters.
- Add a household record.
- Update an existing household record.
- Data validation (children cannot exceed total family members; duplicate IDs are blocked).
- Changes persist in the same browser using localStorage.
- Survey campaign workflow explanation.
- Reports page and CSV export.

IMPORTANT LIMITATIONS
This is a front-end demonstration prototype. It does NOT have a real backend, database,
user authentication, field-officer accounts, GPS verification, or secure government hosting.
All displayed data is fictional sample data. Do not enter real or sensitive citizen information.

SUGGESTED NEXT DEVELOPMENT PHASE
1. Backend: Node.js + Express.
2. Database: PostgreSQL.
3. Roles: District Admin, Supervisor, Survey Officer.
4. Survey history: preserve previous campaign snapshots and log every approved change.
5. Security: authentication, role-based access, audit logs, encryption, backups and approved
   data access/retention rules.
