# Backlog Mapping – ArtConnect

## Overview

Mapping SKPL requirements (SRS-F-001 to SRS-F-025) ke user stories dengan estimates, priorities, dan dependencies untuk sprint planning.

**Sumber:** SKPL ArtConnect v1.4 (77 pages)

---

## Requirements Summary

### Functional Requirements (SRS-F)

| ID | Category | Description | Priority |
|----|----------|-------------|----------|
| SRS-F-001 | Auth | Register seniman visual | High |
| SRS-F-002 | Auth | Login seniman visual | High |
| SRS-F-003 | Auth | Logout seniman visual | High |
| SRS-F-004 | Auth | Manage profile seniman | Medium |
| SRS-F-005 | Dashboard | Display dashboard overview | Medium |
| SRS-F-006 | Dashboard | Quick access menu | Low |
| SRS-F-007 | Artwork | Add new artwork | High |
| SRS-F-008 | Artwork | View artwork detail | High |
| SRS-F-009 | Artwork | Edit artwork information | High |
| SRS-F-010 | Artwork | Delete artwork | Medium |
| SRS-F-011 | Artwork | Upload artwork image | High |
| SRS-F-012 | Artwork | Search artworks | Medium |
| SRS-F-013 | Artwork | Filter artworks by category/status | Medium |
| SRS-F-014 | Contact | Add new contact (potential buyer) | High |
| SRS-F-015 | Contact | View contact detail | High |
| SRS-F-016 | Contact | Edit contact information | Medium |
| SRS-F-017 | Contact | Delete contact | Low |
| SRS-F-018 | Pipeline | View sales pipeline (Kanban board) | High |
| SRS-F-019 | Pipeline | Add sales opportunity | High |
| SRS-F-020 | Pipeline | Update opportunity stage | High |
| SRS-F-021 | Analytics | View revenue analytics | Medium |
| SRS-F-022 | Analytics | View artwork performance metrics | Medium |
| SRS-F-023 | Analytics | Filter analytics by date range | Low |
| SRS-F-024 | Analytics | Export analytics report | Low |
| SRS-F-025 | Analytics | Sales conversion funnel | Low |

### Non-Functional Requirements (SRS-NF)

| ID | Category | Requirement |
|----|----------|-------------|
| SRS-NF-001 | Performance | Page load <3s |
| SRS-NF-002 | Performance | API response <2s |
| SRS-NF-003 | Security | Firebase Auth untuk authentication |
| SRS-NF-004 | Security | HTTPS encryption |
| SRS-NF-005 | Usability | Intuitive UI, minimal training |
| SRS-NF-006 | Compatibility | Chrome, Firefox, Safari, Edge (latest) |
| SRS-NF-007 | Responsive | Desktop, tablet, mobile |
| SRS-NF-008 | Availability | 99% uptime |

---

## Epic Breakdown

### Epic 1: Authentication & User Management

**Goal:** Enable users to register, login, logout, dan manage profiles.

**SRS-F:** 001, 002, 003, 004  
**Priority:** High  
**Estimated Effort:** 2 sprints (16 story points)

#### User Stories:

**US-1.1: User Registration**  
**As a** seniman visual  
**I want to** register untuk account baru  
**So that** saya dapat access ArtConnect platform  

**Acceptance Criteria:**
- Form has fields: name, email, password, confirm password
- Email validation (format check)
- Password validation (min 6 chars)
- Firebase Authentication creates user
- Success message setelah registration
- Redirect to login page

**SRS-F:** 001  
**Priority:** High  
**Estimate:** 5 points  
**Dependencies:** None  
**Sprint:** Sprint 1

---

**US-1.2: User Login**  
**As a** registered user  
**I want to** login dengan email dan password  
**So that** saya dapat access my artworks dan contacts  

**Acceptance Criteria:**
- Form has fields: email, password
- Firebase Authentication verifies credentials
- Success redirect to dashboard
- Error message untuk invalid credentials
- "Remember me" checkbox (future enhancement)

**SRS-F:** 002  
**Priority:** High  
**Estimate:** 3 points  
**Dependencies:** US-1.1  
**Sprint:** Sprint 1

---

**US-1.3: User Logout**  
**As a** logged-in user  
**I want to** logout dari aplikasi  
**So that** my account remains secure  

**Acceptance Criteria:**
- Logout button visible dalam navbar
- Firebase signOut() called
- User redirected to login page
- Auth state cleared

**SRS-F:** 003  
**Priority:** High  
**Estimate:** 2 points  
**Dependencies:** US-1.2  
**Sprint:** Sprint 1

---

**US-1.4: Profile Management**  
**As a** logged-in user  
**I want to** view dan edit my profile information  
**So that** my contact details up to date  

**Acceptance Criteria:**
- View profile page shows: name, email, phone, bio
- Edit form dengan validation
- Firebase Firestore stores profile data
- Success message setelah update

**SRS-F:** 004  
**Priority:** Medium  
**Estimate:** 5 points  
**Dependencies:** US-1.2  
**Sprint:** Sprint 2

---

### Epic 2: Artwork Management (CRUD)

**Goal:** Enable users to create, read, update, delete artworks dengan image uploads.

**SRS-F:** 007, 008, 009, 010, 011, 012, 013  
**Priority:** High  
**Estimated Effort:** 3-4 sprints (34 story points)

#### User Stories:

**US-2.1: Add New Artwork**  
**As a** seniman  
**I want to** add artwork baru ke my collection  
**So that** saya dapat track dan sell my creations  

**Acceptance Criteria:**
- Form fields: title, description, price, category, status, dimensions, year created
- Required field validation
- Firebase Firestore stores artwork data
- Success message + redirect ke artwork list

**SRS-F:** 007  
**Priority:** High  
**Estimate:** 5 points  
**Dependencies:** US-1.2 (auth)  
**Sprint:** Sprint 3

---

**US-2.2: Upload Artwork Image**  
**As a** seniman  
**I want to** upload image untuk my artwork  
**So that** potential buyers can see my work  

**Acceptance Criteria:**
- File upload input (accept: JPEG, PNG)
- Max file size: 10MB
- Firebase Storage stores images
- Generate thumbnails (150px, 400px, 800px, original)
- Preview uploaded image
- Progress indicator during upload

**SRS-F:** 011  
**Priority:** High  
**Estimate:** 8 points  
**Dependencies:** US-2.1  
**Sprint:** Sprint 3

---

**US-2.3: View Artwork List**  
**As a** seniman  
**I want to** view all my artworks dalam grid layout  
**So that** saya dapat browse my collection  

**Acceptance Criteria:**
- Grid layout (3-4 columns on desktop)
- Each card shows: thumbnail, title, price, status
- Click card → navigate to detail page
- Empty state jika no artworks
- Loading state during fetch

**SRS-F:** 008 (implied)  
**Priority:** High  
**Estimate:** 5 points  
**Dependencies:** US-2.1, US-2.2  
**Sprint:** Sprint 4

---

**US-2.4: View Artwork Detail**  
**As a** seniman  
**I want to** view detailed information tentang an artwork  
**So that** saya dapat see all metadata  

**Acceptance Criteria:**
- Display: full image, title, description, price, dimensions, year, category, status
- Edit button (navigate to edit form)
- Delete button (dengan confirmation)
- Back button to list

**SRS-F:** 008  
**Priority:** High  
**Estimate:** 3 points  
**Dependencies:** US-2.1  
**Sprint:** Sprint 4

---

**US-2.5: Edit Artwork**  
**As a** seniman  
**I want to** edit artwork information  
**So that** saya dapat update details atau fix errors  

**Acceptance Criteria:**
- Pre-filled form dengan existing data
- Same validation rules as add form
- Firebase Firestore updates document
- Option to replace image
- Success message

**SRS-F:** 009  
**Priority:** High  
**Estimate:** 5 points  
**Dependencies:** US-2.1  
**Sprint:** Sprint 4

---

**US-2.6: Delete Artwork**  
**As a** seniman  
**I want to** delete an artwork  
**So that** saya dapat remove sold/unwanted items  

**Acceptance Criteria:**
- Delete button dalam detail page
- Confirmation modal ("Are you sure?")
- Firebase Firestore deletes document
- Firebase Storage deletes associated images
- Redirect to artwork list setelah delete
- Success message

**SRS-F:** 010  
**Priority:** Medium  
**Estimate:** 3 points  
**Dependencies:** US-2.1  
**Sprint:** Sprint 4

---

**US-2.7: Search Artworks**  
**As a** seniman  
**I want to** search my artworks by title or description  
**So that** saya dapat quickly find specific pieces  

**Acceptance Criteria:**
- Search input field dalam artwork list page
- Real-time filtering (debounced)
- Case-insensitive search
- Highlight matched results
- Show "No results" message jika empty

**SRS-F:** 012  
**Priority:** Medium  
**Estimate:** 3 points  
**Dependencies:** US-2.3  
**Sprint:** Sprint 5

---

**US-2.8: Filter Artworks**  
**As a** seniman  
**I want to** filter artworks by category, status, atau price range  
**So that** saya dapat segment my collection  

**Acceptance Criteria:**
- Filter dropdowns: category, status
- Price range slider (future)
- Combine filters (AND logic)
- Clear filters button
- Filter state persists during session

**SRS-F:** 013  
**Priority:** Medium  
**Estimate:** 5 points  
**Dependencies:** US-2.3  
**Sprint:** Sprint 5

---

### Epic 3: Contact Management (CRM)

**Goal:** Enable users to manage potential buyers dan contacts.

**SRS-F:** 014, 015, 016, 017  
**Priority:** High  
**Estimated Effort:** 2 sprints (14 story points)

#### User Stories:

**US-3.1: Add New Contact**  
**As a** seniman  
**I want to** add potential buyer details  
**So that** saya dapat track my leads  

**Acceptance Criteria:**
- Form fields: name, email, phone, company, notes, source
- Email dan phone validation
- Firebase Firestore stores contact
- Success message

**SRS-F:** 014  
**Priority:** High  
**Estimate:** 5 points  
**Dependencies:** US-1.2  
**Sprint:** Sprint 6

---

**US-3.2: View Contact List**  
**As a** seniman  
**I want to** view all my contacts dalam list/card layout  
**So that** saya dapat browse my network  

**Acceptance Criteria:**
- List layout dengan contact cards
- Each card shows: name, email, phone, company
- Click card → navigate to detail page
- Empty state jika no contacts
- Sortable by name, date added

**SRS-F:** 015 (implied)  
**Priority:** High  
**Estimate:** 3 points  
**Dependencies:** US-3.1  
**Sprint:** Sprint 6

---

**US-3.3: View Contact Detail**  
**As a** seniman  
**I want to** view full contact information  
**So that** saya dapat see all details dan notes  

**Acceptance Criteria:**
- Display: name, email, phone, company, notes, source, created date
- Edit button
- Delete button
- Show related opportunities (future)

**SRS-F:** 015  
**Priority:** High  
**Estimate:** 2 points  
**Dependencies:** US-3.1  
**Sprint:** Sprint 6

---

**US-3.4: Edit Contact**  
**As a** seniman  
**I want to** update contact information  
**So that** details remain current  

**Acceptance Criteria:**
- Pre-filled form dengan existing data
- Same validation rules as add form
- Firebase Firestore updates document
- Success message

**SRS-F:** 016  
**Priority:** Medium  
**Estimate:** 3 points  
**Dependencies:** US-3.1  
**Sprint:** Sprint 7

---

**US-3.5: Delete Contact**  
**As a** seniman  
**I want to** delete a contact  
**So that** saya dapat remove outdated/invalid entries  

**Acceptance Criteria:**
- Delete button dalam detail page
- Confirmation modal
- Firebase Firestore deletes document
- Redirect to contact list
- Success message

**SRS-F:** 017  
**Priority:** Low  
**Estimate:** 2 points  
**Dependencies:** US-3.1  
**Sprint:** Sprint 7

---

### Epic 4: Sales Pipeline (Kanban)

**Goal:** Visualize dan manage sales opportunities dalam Kanban board.

**SRS-F:** 018, 019, 020  
**Priority:** High  
**Estimated Effort:** 2-3 sprints (21 story points)

#### User Stories:

**US-4.1: View Pipeline Kanban Board**  
**As a** seniman  
**I want to** view my sales pipeline dalam Kanban format  
**So that** saya dapat track deal stages  

**Acceptance Criteria:**
- Columns: Inquiry, Negotiation, Closed (Won/Lost)
- Cards show: contact name, artwork, value, date
- Drag-and-drop functionality (future)
- Empty state per column

**SRS-F:** 018  
**Priority:** High  
**Estimate:** 8 points  
**Dependencies:** US-3.1 (contacts), US-2.1 (artworks)  
**Sprint:** Sprint 8

---

**US-4.2: Add Sales Opportunity**  
**As a** seniman  
**I want to** create sales opportunity baru  
**So that** saya dapat track potential deals  

**Acceptance Criteria:**
- Form fields: contact (dropdown), artwork (dropdown), stage, value, notes
- Required field validation
- Firebase Firestore stores opportunity
- Card appears dalam correct column
- Success message

**SRS-F:** 019  
**Priority:** High  
**Estimate:** 5 points  
**Dependencies:** US-4.1  
**Sprint:** Sprint 8

---

**US-4.3: Update Opportunity Stage**  
**As a** seniman  
**I want to** move opportunity card antar stages  
**So that** saya dapat reflect deal progress  

**Acceptance Criteria:**
- Drag-and-drop cards antar columns
- Update Firestore document (stage field)
- Timestamp last updated
- Success feedback (visual)

**SRS-F:** 020  
**Priority:** High  
**Estimate:** 8 points  
**Dependencies:** US-4.1, US-4.2  
**Sprint:** Sprint 9

---

**US-4.4: Edit Opportunity**  
**As a** seniman  
**I want to** edit opportunity details  
**So that** saya dapat update value atau notes  

**Acceptance Criteria:**
- Click card → modal or detail page
- Edit form pre-filled
- Firebase Firestore updates document
- Success message

**SRS-F:** 020 (implied)  
**Priority:** Medium  
**Estimate:** 3 points  
**Dependencies:** US-4.2  
**Sprint:** Sprint 9

---

### Epic 5: Analytics & Reporting

**Goal:** Provide insights into revenue, artwork performance, dan conversions.

**SRS-F:** 021, 022, 023, 024, 025  
**Priority:** Medium-Low  
**Estimated Effort:** 2-3 sprints (19 story points)

#### User Stories:

**US-5.1: Revenue Analytics Dashboard**  
**As a** seniman  
**I want to** view revenue charts dan stats  
**So that** saya dapat track my income  

**Acceptance Criteria:**
- Display: total revenue, average sale price, total sales count
- Line chart: revenue over time (monthly)
- Bar chart: revenue by category
- Date range filter

**SRS-F:** 021  
**Priority:** Medium  
**Estimate:** 8 points  
**Dependencies:** US-4.3 (closed won opportunities)  
**Sprint:** Sprint 10

---

**US-5.2: Artwork Performance Metrics**  
**As a** seniman  
**I want to** see which artworks generate most interest  
**So that** saya dapat focus on popular styles  

**Acceptance Criteria:**
- Table: artwork title, views, inquiries, sales
- Sort by each column
- Top 10 artworks by revenue

**SRS-F:** 022  
**Priority:** Medium  
**Estimate:** 5 points  
**Dependencies:** US-2.1, US-4.2  
**Sprint:** Sprint 11

---

**US-5.3: Date Range Filtering**  
**As a** seniman  
**I want to** filter analytics by custom date range  
**So that** saya dapat analyze specific periods  

**Acceptance Criteria:**
- Date range picker (from, to)
- Preset options: This week, This month, This year, All time
- Apply filter updates all charts

**SRS-F:** 023  
**Priority:** Low  
**Estimate:** 3 points  
**Dependencies:** US-5.1  
**Sprint:** Sprint 11

---

**US-5.4: Export Analytics Report**  
**As a** seniman  
**I want to** export analytics to PDF atau CSV  
**So that** saya dapat share dengan stakeholders  

**Acceptance Criteria:**
- Export button dalam analytics page
- Format options: PDF, CSV
- Includes: charts, tables, summary stats
- Downloads to user's device

**SRS-F:** 024  
**Priority:** Low  
**Estimate:** 5 points  
**Dependencies:** US-5.1, US-5.2  
**Sprint:** Sprint 12 (stretch goal)

---

**US-5.5: Sales Conversion Funnel**  
**As a** seniman  
**I want to** view conversion rates antar pipeline stages  
**So that** saya dapat identify bottlenecks  

**Acceptance Criteria:**
- Funnel chart: Inquiry → Negotiation → Closed Won
- Conversion rates displayed (%)
- Filter by date range

**SRS-F:** 025  
**Priority:** Low  
**Estimate:** 5 points  
**Dependencies:** US-4.1  
**Sprint:** Sprint 12 (stretch goal)

---

### Epic 6: Dashboard & Navigation

**Goal:** Provide overview dan quick access ke key features.

**SRS-F:** 005, 006  
**Priority:** Medium  
**Estimated Effort:** 1 sprint (8 story points)

#### User Stories:

**US-6.1: Dashboard Overview**  
**As a** logged-in user  
**I want to** see dashboard dengan key metrics  
**So that** saya dapat quickly assess status  

**Acceptance Criteria:**
- Display: total artworks, total contacts, open opportunities, revenue this month
- Quick links: Add Artwork, Add Contact, View Pipeline
- Recent activity feed (last 5 items)

**SRS-F:** 005  
**Priority:** Medium  
**Estimate:** 5 points  
**Dependencies:** US-2.1, US-3.1, US-4.1  
**Sprint:** Sprint 10

---

**US-6.2: Quick Access Menu**  
**As a** user  
**I want to** navbar dengan navigation links  
**So that** saya dapat easily access features  

**Acceptance Criteria:**
- Navbar links: Dashboard, Artworks, Contacts, Pipeline, Analytics
- Active link highlighted
- Responsive (hamburger menu on mobile)
- User dropdown: Profile, Logout

**SRS-F:** 006  
**Priority:** Low  
**Estimate:** 3 points  
**Dependencies:** None  
**Sprint:** Sprint 2

---

## Priority Matrix

### High Priority (MVP - Sprints 1-9)

**Must-have features untuk launch:**

- ✅ Auth (register, login, logout) - Sprint 1
- ✅ Artwork CRUD dengan image upload - Sprints 3-5
- ✅ Contact management - Sprints 6-7
- ✅ Sales pipeline Kanban - Sprints 8-9

**Total:** ~75 story points (9 sprints)

### Medium Priority (Post-MVP - Sprints 10-12)

**Enhance user experience:**

- Analytics dashboard - Sprint 10
- Artwork performance metrics - Sprint 11
- Profile management improvements - Sprint 2
- Dashboard overview - Sprint 10

**Total:** ~25 story points (3 sprints)

### Low Priority (Future Enhancements)

**Nice-to-have features:**

- Export analytics - Sprint 12+
- Conversion funnel - Sprint 12+
- Advanced search - Future
- Batch operations - Future

---

## Story Point Reference

**Fibonacci Scale:**

| Points | Complexity | Examples | Estimated Time |
|--------|-----------|----------|----------------|
| 1 | Trivial | Simple text change, config update | 1-2 hours |
| 2 | Easy | Simple component, basic CRUD | 2-4 hours |
| 3 | Small | Form dengan validation | 4-8 hours |
| 5 | Medium | Component dengan complex logic | 1-2 days |
| 8 | Large | Feature dengan multiple components | 2-3 days |
| 13 | Very Large | Complex integration, multiple features | 3-5 days |

**Estimation Factors:**
- Complexity of logic
- Number of components/files
- Testing requirements
- Firebase integration complexity
- UI/UX complexity

---

## Dependencies Graph

```
Auth (Sprint 1)
├── Artwork CRUD (Sprints 3-5)
│   ├── Dashboard (Sprint 10)
│   └── Analytics (Sprints 10-12)
├── Contact Management (Sprints 6-7)
│   └── Sales Pipeline (Sprints 8-9)
│       └── Analytics (Sprints 10-12)
└── Profile Management (Sprint 2)
    └── Dashboard (Sprint 10)
```

**Critical Path:** Auth → Artwork → Pipeline → Analytics

---

## Backlog Grooming Schedule

### Weekly Refinement (Wednesday, 1.5 hours)

**Agenda:**
- Review next sprint stories
- Break down large stories (>8 points)
- Clarify acceptance criteria
- Estimate new stories
- Re-prioritize based on learnings

### Pre-Sprint Planning Checklist

- [ ] All stories have clear acceptance criteria
- [ ] Stories estimated dan prioritized
- [ ] Dependencies identified
- [ ] Design mockups ready (UI stories)
- [ ] Technical spikes completed (complex stories)
- [ ] SKPL references documented

---

## Change Management

### Adding New Requirements

1. **Document requirement** dalam SKPL format
2. **Create user story** dengan AC
3. **Estimate story points** dalam backlog refinement
4. **Prioritize** (High/Medium/Low)
5. **Assign to sprint** based on capacity

### Updating Existing Stories

1. **Discuss dalam backlog refinement**
2. **Update AC** jika scope changes
3. **Re-estimate** jika complexity changes
4. **Communicate** changes ke team

### Handling Technical Debt

- Allocate 10-20% of sprint capacity untuk refactoring
- Track technical debt dalam backlog (label: `tech-debt`)
- Prioritize based on impact/risk

---

## Velocity Tracking

### Initial Estimation

**Team Capacity:**
- 5 developers × 6 hours/day × 10 days/sprint = 300 hours/sprint
- Story points capacity: ~30-40 points/sprint (conservative estimate)

### Velocity Adjustment

After Sprint 1-2, measure actual velocity:

```
Sprint 1: Planned 25 pts → Completed 20 pts → Velocity: 20
Sprint 2: Planned 30 pts → Completed 28 pts → Velocity: 28
Sprint 3: Planned 35 pts → Completed 32 pts → Velocity: 32
Average: (20 + 28 + 32) / 3 = 27 points/sprint
```

Use average velocity untuk future sprint planning.

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│  ArtConnect Backlog Quick Reference                 │
├─────────────────────────────────────────────────────┤
│  MVP SCOPE (Sprints 1-9):                           │
│  • Auth (register, login, logout)                   │
│  • Artwork CRUD + image upload                      │
│  • Contact management                               │
│  • Sales pipeline Kanban                            │
│  Total: ~75 story points                            │
│                                                     │
│  POST-MVP (Sprints 10-12):                          │
│  • Analytics dashboard                              │
│  • Artwork performance                              │
│  • Dashboard overview                               │
│  Total: ~25 story points                            │
│                                                     │
│  ESTIMATION SCALE:                                  │
│  1 pt  = Trivial (1-2 hours)                        │
│  2 pts = Easy (2-4 hours)                           │
│  3 pts = Small (4-8 hours)                          │
│  5 pts = Medium (1-2 days)                          │
│  8 pts = Large (2-3 days)                           │
│  13 pts = Very Large (3-5 days)                     │
│                                                     │
│  VELOCITY TARGET:                                   │
│  ~30-40 story points per sprint                     │
│  (Adjust based on actual velocity after Sprint 2)  │
└─────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** Product Owner  
**Review:** Update after each sprint retrospective based on velocity dan priority changes
