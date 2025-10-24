# Definition of Ready & Definition of Done – ArtConnect

## Overview

Dokumen ini mendefinisikan kriteria yang harus dipenuhi untuk memulai pekerjaan (Definition of Ready) dan menyelesaikan pekerjaan (Definition of Done) dalam pengembangan ArtConnect. Standar ini memastikan konsistensi kualitas dan kelancaran alur kerja tim.

---

## Definition of Ready (DoR)

**Definition of Ready** adalah checklist yang harus dipenuhi sebelum sebuah work item (user story, task, bug) dapat dipindahkan ke sprint dan mulai dikerjakan oleh developer.

### General DoR Checklist

Setiap item backlog harus memenuhi kriteria berikut:

- [ ] **Tujuan Jelas**: Deskripsi user story menggunakan format "As a [seniman], I want [feature], so that [value]"
- [ ] **Acceptance Criteria (AC) Tertulis**: Minimal 3 acceptance criteria spesifik dan terukur
- [ ] **SKPL Mapping**: Terhubung ke requirement ID dari SKPL (SRS-F-xxx, SRS-NF-xxx)
- [ ] **Estimasi Story Points**: Tim telah melakukan planning poker dan sepakat estimasi (1, 2, 3, 5, 8, 13)
- [ ] **Scope Jelas**: Tidak ada ambiguitas tentang apa yang termasuk dan tidak termasuk
- [ ] **Dependencies Identified**: Semua dependencies teknis dan bisnis tercatat
- [ ] **No Blockers**: Tidak ada blocker yang mencegah pekerjaan dimulai
- [ ] **Design/Mockup Ready**: UI/UX mockup atau wireframe tersedia (untuk task UI)
- [ ] **API Contract Defined**: Struktur request/response documented (untuk integration task)
- [ ] **Test Strategy Defined**: Jelas bagaimana fitur ini akan ditest
- [ ] **Prioritas Clear**: PO telah menetapkan prioritas (High/Medium/Low)
- [ ] **Small Enough**: Story bisa diselesaikan dalam 1 sprint (jika >8 SP, pecah menjadi subtask)

### DoR per Tipe Task

#### Feature Development

- [ ] User story format complete dengan value proposition
- [ ] UI mockup/wireframe approved oleh PO
- [ ] Acceptance criteria mencakup happy path dan edge cases
- [ ] Data model changes documented (jika ada)
- [ ] Performance requirements defined (jika applicable)
- [ ] Security considerations noted
- [ ] Accessibility requirements specified

**Example**: 
```
User Story: Artwork Upload
As a seniman visual, I want to upload karya seni dengan foto dan metadata, 
so that saya dapat mendokumentasikan portofolio digital secara terorganisir.

AC:
1. User dapat upload JPEG/PNG/WebP max 10MB
2. System generate 4 thumbnail sizes (150, 400, 800, original)
3. Required fields: title, medium, year, dimensions
4. Upload progress indicator visible untuk file >2MB
5. Error handling untuk invalid format, size exceeded
6. Success confirmation dengan preview thumbnail

SKPL: SRS-F-007, SRS-F-011
Estimated: 5 SP
Dependencies: Firebase Storage configured
Design: Figma link [URL]
```

#### Bug Fix

- [ ] Bug dapat direproduce dengan langkah jelas
- [ ] Expected vs Actual behavior documented
- [ ] Screenshots/video bukti bug tersedia
- [ ] Environment info (browser, OS, version)
- [ ] Severity level assigned (Critical/High/Medium/Low)
- [ ] Impact scope analyzed (berapa user affected)
- [ ] Root cause hypothesis (jika sudah diketahui)

**Example**:
```
Bug: Kanban Drag & Drop Not Working on Firefox
Steps to Reproduce:
1. Login sebagai seniman
2. Navigate ke Pipeline page
3. Try drag artwork card dari "WIP" ke "Completed"
4. Card tidak pindah, console error: "dragenter handler undefined"

Expected: Card berpindah kolom dengan smooth animation
Actual: Card stuck, no movement

Environment: Firefox 115, Windows 11
Severity: High (affects core feature)
SKPL: SRS-F-018
Estimated: 3 SP
```

#### Technical Debt / Refactoring

- [ ] Current problem clearly explained dengan contoh
- [ ] Proposed solution documented dengan pros/cons
- [ ] Impact analysis: scope of changes, risk level
- [ ] Backward compatibility ensured (jika applicable)
- [ ] Performance/quality metrics: before vs after target
- [ ] Test coverage plan untuk refactored code

#### Documentation Task

- [ ] Audience identified (developer, PO, end-user)
- [ ] Outline/structure approved
- [ ] Reference materials available
- [ ] Review process defined
- [ ] Target completion date

---

## Definition of Done (DoD)

**Definition of Done** adalah checklist yang harus dipenuhi sebelum sebuah work item dapat dianggap selesai dan siap untuk deployment atau release.

### General DoD Checklist

Setiap work item harus memenuhi kriteria berikut sebelum di-mark sebagai Done:

- [ ] **Acceptance Criteria Met**: Semua AC dari DoR terpenuhi dan dapat didemo
- [ ] **Code Complete**: Implementasi sesuai dengan design/requirement, no TODO/FIXME left
- [ ] **Tests Written & Passing**: Minimal 1 happy path + 1 edge case test, all tests green
- [ ] **Build Success**: `npm run build` sukses tanpa error atau warning critical
- [ ] **Code Reviewed**: Minimal 1 approval dari team member, feedback addressed
- [ ] **No Regression**: Existing features tidak broken, all tests masih passing
- [ ] **Documentation Updated**: README, API docs, inline comments untuk logic kompleks
- [ ] **SKPL Mapping Verified**: Requirement dari SKPL terpenuhi dan tercatat
- [ ] **Branch Merged**: PR merged ke target branch (develop/main), branch deleted
- [ ] **Manual Testing**: Developer melakukan smoke test manual sebelum PR
- [ ] **Performance Acceptable**: No obvious performance regression (load time, memory)
- [ ] **Security Check**: No sensitive data exposed, no security vulnerabilities introduced
- [ ] **Accessibility**: Keyboard navigable, basic ARIA attributes (untuk UI features)

### DoD per Tipe Task

#### Feature Development - Full DoD

- [ ] **Functionality**
  - [ ] All acceptance criteria implemented dan verified
  - [ ] Happy path berfungsi sempurna
  - [ ] Edge cases ditangani dengan graceful error messages
  - [ ] Loading states implemented (spinner, skeleton)
  - [ ] Empty states designed (no data scenarios)
  - [ ] Error states handled (network failure, validation errors)

- [ ] **Testing**
  - [ ] Unit tests untuk utils/helpers/services (coverage >80%)
  - [ ] Component tests untuk Vue components (key interactions tested)
  - [ ] Integration test untuk critical flows (opsional untuk MVP)
  - [ ] Manual testing di Chrome, Firefox, Safari (desktop)
  - [ ] Manual testing responsive (tablet 768px, mobile 375px)
  - [ ] Tested dengan data volume realistic (100+ artworks, 50+ contacts)

- [ ] **Code Quality**
  - [ ] No console.log/debugger statements left
  - [ ] No commented-out code blocks
  - [ ] Proper error handling dengan try-catch atau error boundaries
  - [ ] Constants extracted (no magic numbers/strings)
  - [ ] Functions small dan focused (< 50 lines ideal)
  - [ ] Proper naming (descriptive, consistent dengan codebase)

- [ ] **Performance**
  - [ ] Images optimized/compressed (lazy loading jika banyak)
  - [ ] No unnecessary re-renders (Vue reactivity optimized)
  - [ ] Pagination implemented untuk large lists (>50 items)
  - [ ] Debounce/throttle pada search/filter inputs
  - [ ] Bundle size check (no huge dependencies added)

- [ ] **Security**
  - [ ] Input validation client-side (tidak trust user input)
  - [ ] Firestore security rules updated (jika ada schema changes)
  - [ ] No API keys atau secrets di code (use .env.local)
  - [ ] XSS prevention (sanitize user-generated content)

- [ ] **Accessibility**
  - [ ] Semantic HTML (header, nav, main, section)
  - [ ] Proper heading hierarchy (h1 → h2 → h3)
  - [ ] Alt text untuk images
  - [ ] Focus indicators visible (outline tidak di-remove)
  - [ ] Keyboard navigation works (Tab, Enter, Escape)
  - [ ] ARIA labels untuk icon-only buttons
  - [ ] Color contrast sufficient (WCAG AA minimum)

- [ ] **Documentation**
  - [ ] JSDoc comments untuk public functions/components
  - [ ] README updated jika ada setup baru (env vars, scripts)
  - [ ] Component usage examples di storybook (opsional)
  - [ ] API integration documented (Firebase calls, data shape)
  - [ ] Known limitations/todos documented

- [ ] **Review & Merge**
  - [ ] Self-review done (checklist all items above)
  - [ ] PR description complete (what, why, how, screenshots)
  - [ ] Reviewer approved (code, tests, functionality)
  - [ ] CI/CD checks passing (build, test, lint jika ada)
  - [ ] Merge conflicts resolved
  - [ ] Squash and merge done, branch deleted

#### Bug Fix - DoD

- [ ] **Fix Verification**
  - [ ] Bug tidak bisa direproduce lagi dengan langkah original
  - [ ] Root cause identified dan explained dalam PR
  - [ ] Fix minimal dan targeted (tidak over-engineer)

- [ ] **Testing**
  - [ ] Regression test added untuk prevent bug kembali
  - [ ] Related functionality tested (tidak break hal lain)
  - [ ] Tested di environment yang sama dengan bug report

- [ ] **Documentation**
  - [ ] Commit message explains what bug dan how fixed
  - [ ] Comment di code jika fix tidak obvious

#### Refactoring - DoD

- [ ] **Quality Improvement**
  - [ ] Code complexity reduced (cyclomatic complexity lower)
  - [ ] Duplication removed (DRY principle applied)
  - [ ] Naming improved (clearer intent)

- [ ] **Safety**
  - [ ] All existing tests still passing (no functional changes)
  - [ ] Code coverage maintained atau improved
  - [ ] Behavior identical to before (no side effects)

- [ ] **Documentation**
  - [ ] Reasoning for refactoring explained dalam PR
  - [ ] Before vs After comparison (metrics jika ada)

#### Documentation - DoD

- [ ] **Content Quality**
  - [ ] Information accurate dan up-to-date
  - [ ] Examples provided dan tested
  - [ ] Clear structure dengan headings
  - [ ] Grammar dan spelling correct

- [ ] **Review**
  - [ ] Peer reviewed untuk accuracy
  - [ ] Tested by following instructions (walkthrough)

- [ ] **Accessibility**
  - [ ] Markdown formatted properly
  - [ ] Links working
  - [ ] Images have alt text

---

## Acceptance Criteria Guidelines

### Writing Good Acceptance Criteria

#### INVEST Principles
- **I**ndependent: Can be implemented independently
- **N**egotiable: Can discuss implementation details
- **V**aluable: Delivers user value
- **E**stimable: Can estimate effort
- **S**mall: Can complete in 1 sprint
- **T**estable: Can verify completion

#### Format Options

**Given-When-Then (Gherkin Style)**
```
Given [context/precondition]
When [action/event]
Then [expected outcome]

Example:
Given seniman logged in dan di halaman upload artwork
When seniman upload file JPEG 5MB dengan metadata lengkap
Then system save artwork, generate thumbnails, dan tampilkan success confirmation
```

**Checklist Style**
```
✓ User can [action] with [constraint]
✓ System validates [input] and shows [error] when [invalid condition]
✓ Success state shows [confirmation] with [details]

Example:
✓ User dapat drag artwork card antar kolom Kanban
✓ System update status karya di Firestore saat drop
✓ Animation smooth dengan visual feedback
✓ Undo option available untuk 5 detik setelah drop
```

### Bad vs Good AC Examples

#### ❌ Bad AC (Vague)
- "Upload works fine"
- "User can manage artworks"
- "Performance is good"

#### ✅ Good AC (Specific & Measurable)
- "User dapat upload JPEG/PNG max 10MB, system tolak dengan error message jika exceed"
- "User dapat create, view, edit, delete artwork dengan confirmation dialog untuk delete"
- "Artwork list page load <2s dengan 100 artworks, pagination 20 items per page"

---

## SKPL Mapping Examples

### High Priority Features (Sprint 1-2)

**SRS-F-001 to SRS-F-004: Authentication**
- DoR: Firebase project setup, design mockup for login/register
- DoD: Email/password auth works, session persisted, protected routes functional
- AC: User dapat register dengan email valid, login dengan credentials correct, session maintain after refresh

**SRS-F-007 to SRS-F-011: Artwork CRUD**
- DoR: Firestore schema defined, Firebase Storage configured, upload UI designed
- DoD: All CRUD operations work, images stored in cloud, thumbnails generated, list paginated
- AC: Create artwork dengan metadata lengkap, view dalam grid/list, edit metadata, soft delete dengan confirmation, search by title/medium

**SRS-F-012 to SRS-F-015: Contact Management**
- DoR: Data model untuk contacts defined, categorization system agreed
- DoD: CRUD contacts complete, categories assignable, search functional, duplicate detection works
- AC: Add contact dengan category (collector/gallery/curator), edit info, view list dengan filter, delete dengan warning jika ada related activities

### Medium Priority (Sprint 3-4)

**SRS-F-018 to SRS-F-019: Kanban Pipeline**
- DoR: Status workflow defined (concept→wip→completed→sold), drag-drop library selected
- DoD: Kanban board displays artworks by status, drag-drop updates Firestore, animation smooth
- AC: View artworks grouped by status, drag card ke kolom lain, status update real-time, visual feedback on hover/drag

**SRS-F-020: Analytics Dashboard**
- DoR: Metrics defined (total artworks, sales this month, top medium), chart library chosen
- DoD: Dashboard shows key metrics dengan visualization, data real-time from Firestore
- AC: Display total artworks by status, revenue chart last 6 months, top 5 contacts by interactions

---

## Quality Gates

### Pre-PR Quality Check
Sebelum open PR, developer harus verify:

```powershell
# 1. Tests pass
npm run test

# 2. Build succeeds
npm run build

# 3. No lint errors (jika configured)
npm run lint

# 4. Manual smoke test
npm run dev
# Test key flows manually
```

### Post-PR Merge Quality Check
Setelah merge, pastikan:

- CI/CD pipeline success (jika configured)
- Staging deployment works (jika ada)
- No error reports dari error tracking (Sentry, LogRocket)

---

## Handling Exceptions

### When DoD Cannot Be Fully Met

**Scenario 1: Time Constraint (Sprint Ending)**
- Option A: Extend sprint by 1-2 days (only once per sprint)
- Option B: Move incomplete items ke next sprint, don't merge
- Option C: Split story, merge done part, create new ticket untuk remaining

**Scenario 2: External Dependency Blocked**
- Document blocker clearly
- Workaround with mock/stub jika possible
- Update DoD dengan "Dependent on [X]"
- Schedule follow-up setelah blocker resolved

**Scenario 3: Critical Bug Fix Needed Urgently**
- Hotfix can bypass some DoD items (tests, full review)
- But must create follow-up ticket untuk complete DoD
- Document why DoD skipped dalam commit message

### Technical Debt Decision

Jika tidak bisa meet DoD fully karena technical debt, team harus:
1. Discuss dalam daily stand-up
2. Document debt dalam TODO comment + create tech debt ticket
3. PO prioritize tech debt ticket dalam next sprint
4. Don't let debt accumulate >3 sprints

---

## Continuous Improvement

### Retrospective Questions

**DoR Effectiveness:**
- Apakah stories well-defined ketika mulai sprint?
- Berapa banyak stories yang perlu clarification mid-sprint?
- Apakah estimasi accurate?

**DoD Effectiveness:**
- Berapa banyak bugs found after "Done"?
- Apakah code review quality konsisten?
- Apakah documentation adequate?

### Updating DoR/DoD

DoR dan DoD adalah living documents. Update jika:
- Team menemukan gap dalam quality
- New tools/practices adopted (ESLint, Playwright, etc.)
- SKPL requirements berubah
- Team size atau composition berubah

Update process:
1. Propose changes dalam retrospective
2. Team consensus required
3. Update dokumen ini
4. Communicate ke semua team members
5. Apply dari sprint berikutnya

---

## Checklist Summary (Print-Friendly)

### ✅ Definition of Ready Quick Check
- [ ] Story clear dengan AC
- [ ] SKPL mapped
- [ ] Estimated SP
- [ ] No blockers
- [ ] Design ready (UI)
- [ ] Small enough (<1 sprint)

### ✅ Definition of Done Quick Check
- [ ] AC met & demoable
- [ ] Tests written & passing
- [ ] Build success
- [ ] Code reviewed & approved
- [ ] Documentation updated
- [ ] Branch merged & deleted
- [ ] Manual testing done
- [ ] No regression

---

## Referensi

- SKPL ArtConnect v1.4 (requirement IDs)
- Agile Alliance - Definition of Done: https://www.agilealliance.org/glossary/definition-of-done/
- Scrum Guide: https://scrumguides.org/
- INVEST in User Stories: https://xp123.com/articles/invest-in-user-stories/
