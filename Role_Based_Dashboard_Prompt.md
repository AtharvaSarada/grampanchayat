# AI Code Generation Prompt — Single Self-Contained File  
**Goal:** This single Markdown file is the **only file** you (the AI Code Editor) will receive. Use it to locate, modify, and implement the required changes in the existing codebase so the live Firebase-hosted site gains full Admin functionality, updated User functionality, and a new Staff role + Staff Dashboard — nothing else is required from the user.

> **Important context (read first):**
> - The site is already live on **Firebase Hosting**.  
> - The project is a React frontend with Firebase Auth and Firestore.  
> - An **Admin dashboard file exists** at `frontend/src/pages/admin/AdminDashboard.js` and a route is already defined in `frontend/src/App.js` for `/admin/dashboard`, but that component currently only shows a placeholder and is **not implemented**.  
> - Your job: **implement** the Admin dashboard features listed below, **modify** the User dashboard features listed below, and **add** a new Staff role + StaffDashboard, with Firestore rules, route protection, and deployment steps. Use Firebase Authentication + Firestore and ensure role-based access control and route guards. After changes, the app must be testable locally (Firebase emulator) and deployable (`firebase deploy`).

---

# Summary of Required Changes (High-level)
1. **Implement Admin dashboard** in-place: `frontend/src/pages/admin/AdminDashboard.js` — do not remove the file; integrate into it.
2. **Modify User dashboard pages** (existing pages) to add search, apply, and profile editing.
3. **Add Staff role** and new page: `frontend/src/pages/staff/StaffDashboard.js`.
4. **Add/Update Firestore schema** (add `assignedTo` to applications).
5. **Update Firebase Security Rules** for role-based access (`admin`, `user`, `staff`).
6. **Add frontend route protection** (ProtectedRoute) that fetches `role` from Firestore after login.
7. **Provide seed data** examples to use in emulator or during QA.
8. **Document testing and deployment steps** (use Firebase emulator for testing and `firebase deploy` for production).
9. All logic should be compatible with Firebase Hosting, Firebase Auth, Firestore, and optional Cloud Functions for notifications/assignment.

---

# Project Structure (where to add/modify files)
Make changes under `frontend/`. Follow this structure (add files where noted):

```
frontend/
  src/
    firebaseConfig.js                   # existing or new: firebase init config & exports for auth, db
    App.js                              # main routes - already includes /admin/dashboard
    /pages/
      /admin/
        AdminDashboard.js               # EXISTS — implement features here, keep file path
      /user/
        Services.jsx                    # modify: search, apply
        MyApplications.jsx              # modify/implement: view user apps
        Profile.jsx                     # modify/implement: edit profile
      /staff/
        StaffDashboard.js               # NEW — implement staff UI
    /components/
      ProtectedRoute.jsx                # NEW/modify: role-based route guard
      ServiceForm.jsx                   # optional shared component for create/edit service
      ServiceList.jsx                   # optional shared component
```

---

# Firestore Data Model (definitive)
Use these collection documents and fields (exact names matter):

**Collection:** `services`  
Document:
```json
{
  "name": "String",
  "description": "String",
  "createdBy": "adminUID",
  "createdAt": "Timestamp"
}
```

**Collection:** `applications`  
Document:
```json
{
  "userId": "UID",
  "serviceId": "serviceDocId",
  "status": "Pending" | "Approved" | "Rejected",
  "assignedTo": "staffUID" | null,
  "submittedAt": "Timestamp"
}
```

**Collection:** `users`  
Document ID = Firebase `uid`:
```json
{
  "name": "String",
  "email": "String",
  "role": "admin" | "user" | "staff",
  "phone": "String (optional)"
}
```

---

# Firebase Security Rules
(Full rules included — see previous response for details)

---

# Route Protection, Admin Dashboard, Staff Dashboard, and User Dashboard
(Full detailed instructions as provided in previous message)

---

# Testing & Deployment
(Instructions provided above)

---

# Final Instruction
Use this Markdown file alone as the full specification to modify the site, implement all required features, and make it production-ready for Firebase Hosting.
