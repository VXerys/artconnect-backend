# Agile Scrum Plan – ArtConnect CRM Platform

## Executive Summary

Dokumen ini adalah blueprint implementasi Agile Scrum untuk pengembangan ArtConnect MVP (v1.0), platform CRM khusus seniman visual independen. Rencana ini mencakup roles, ceremonies, estimasi, backlog management, dan strategy execution berdasarkan SKPL ArtConnect v1.4.

**Project Context:**
- **Duration**: 16 minggu (4 sprint @ 4 minggu OR 8 sprint @ 2 minggu)
- **Team Size**: 5 developers
- **Tech Stack**: Vue 3 + Vite + Firebase (Auth, Firestore, Storage)
- **Target**: MVP dengan fitur High Priority dari SKPL (SRS-F-001 hingga SRS-F-025)

---

## 1. Scrum Roles & Responsibilities

### Product Owner (PO)

**Primary Responsibility:** Maximize value dari product dan development team work

**Key Activities:**
- **Backlog Management**
  - Maintain dan prioritize Product Backlog sesuai dengan business value
  - Write user stories dengan clear acceptance criteria
  - Ensure stories meet Definition of Ready sebelum sprint planning
  - Refine backlog 1-2 sprint ahead (grooming sessions)

- **Stakeholder Management**
  - Represent kebutuhan seniman visual (target user) dalam product decisions
  - Communicate project progress ke stakeholders eksternal (dosen, pemilik galeri, dll)
  - Collect dan incorporate feedback dari user testing

- **Sprint Activities**
  - Attend semua sprint ceremonies (planning, review, retro)
  - Clarify requirements saat daily stand-up jika ada blocker
  - Accept atau reject completed work di sprint review

**Skills Required:**
- Deep understanding dari domain seni visual dan kebutuhan seniman
- Familiarity dengan SKPL ArtConnect (requirement IDs, priorities)
- Basic technical knowledge (Firestore data model, Firebase capabilities)

**Time Commitment:** 20-30% time untuk aktivitas Scrum

---

### Scrum Master (SM)

**Primary Responsibility:** Facilitate Scrum process dan remove impediments

**Key Activities:**
- **Process Facilitation**
  - Organize dan facilitate sprint ceremonies
  - Ensure ceremonies stay time-boxed dan productive
  - Track dan enforce DoR/DoD compliance
  - Monitor team velocity dan burndown

- **Impediment Removal**
  - Identify blockers dalam daily stand-up
  - Actively work untuk resolve blockers (technical, organizational, external)
  - Escalate ke PO atau management jika needed
  - Track impediment resolution time

- **Team Coaching**
  - Coach team pada Agile/Scrum best practices
  - Help team improve development processes
  - Facilitate conflict resolution
  - Promote self-organization

- **Metrics & Reporting**
  - Track sprint metrics (velocity, burndown, cycle time)
  - Generate sprint reports untuk stakeholders
  - Identify trends dan improvement opportunities
  - Maintain documentation (sprint logs, retro action items)

**Skills Required:**
- Strong understanding Scrum framework dan Agile principles
- Facilitation dan conflict resolution skills
- Basic technical understanding untuk identify technical blockers
- Project management tools (Jira, Trello, GitHub Projects)

**Time Commitment:** 30-40% time untuk aktivitas Scrum (bisa concurrent dengan development)

---

### Development Team

**Primary Responsibility:** Deliver potentially shippable product increment setiap sprint

**Composition:** 5 developers (cross-functional)
- 2 Frontend specialists (Vue, Vite, responsive design)
- 2 Full-stack developers (frontend + Firebase integration)
- 1 Backend/DevOps (Firebase configuration, security rules, deployment)

**Key Activities:**
- **Sprint Execution**
  - Self-organize untuk accomplish Sprint Goal
  - Breakdown user stories menjadi technical tasks
  - Implement, test, dan document features
  - Collaborate through pair programming atau code review

- **Technical Excellence**
  - Maintain code quality (clean code, refactoring)
  - Write automated tests (unit, component, integration)
  - Ensure codebase remains maintainable
  - Follow coding standards dan best practices

- **Collaboration**
  - Participate actively dalam semua ceremonies
  - Update task status real-time di sprint board
  - Help teammates when blocked atau struggling
  - Share knowledge (knowledge transfer sessions)

**Skills Required:**
- Proficient in Vue 3 (Composition API, reactivity, components)
- Experience dengan Firebase (Firestore queries, Storage, Auth)
- Testing dengan Vitest dan Vue Test Utils
- Git workflow dan PR review process
- Basic UX/UI principles untuk seniman-focused interface

**Time Commitment:** Full-time dedicated ke sprint work

---

## 2. Sprint Structure

### Sprint Duration: 2 Weeks (Recommended)

**Rationale:**
- Balance antara flexibility dan predictability
- Cukup waktu untuk complete meaningful features (5-8 SP per developer)
- Frequent feedback loops (review setiap 2 minggu)
- Easier untuk adjust priority jika ada perubahan

**Alternative:** 4-week sprints jika team memerlukan longer cycles untuk complex features

### Sprint Calendar (2-Week Sprint)

**Week 1:**
- **Monday**: Sprint Planning (3 jam pagi)
- **Tuesday-Friday**: Development + Daily Stand-up (15 menit pagi)
- **Wednesday**: Backlog Refinement (1.5 jam sore)

**Week 2:**
- **Monday-Thursday**: Development + Daily Stand-up
- **Thursday Evening**: Code freeze, final testing
- **Friday Morning**: Sprint Review (1 jam)
- **Friday Afternoon**: Sprint Retrospective (1 jam)
- **Friday End**: Sprint Planning untuk next sprint (opsional start)

### Working Hours & Availability

- **Core Hours**: 09:00 - 17:00 WIB (8 jam/hari)
- **Daily Stand-up**: 09:15 - 09:30 (15 menit)
- **Flexible Work**: Developer bisa adjust jam (inform team)
- **No Meeting Afternoons**: Tuesday & Thursday sore (focused development time)

---

## 3. Story Point Estimation

### Modified Fibonacci Scale

**Story Points:** 1, 2, 3, 5, 8, 13

**Guidelines:**

**1 SP - Trivial (2-4 jam)**
- Fix typo atau minor UI adjustment
- Update documentation
- Simple configuration change
- Example: "Change button color", "Update footer text"

**2 SP - Simple (4-8 jam, ~1 hari)**
- Small feature dengan minimal complexity
- Single component dengan basic logic
- Straightforward bug fix
- Example: "Add validation error message", "Create empty state component"

**3 SP - Medium (1-2 hari)**
- Feature dengan moderate complexity
- Multiple components atau integration dengan 1 service
- Requires testing dan documentation
- Example: "Implement artwork search by title", "Add pagination ke artwork list"

**5 SP - Complex (2-3 hari)**
- Full feature dengan multiple acceptance criteria
- Multiple components + Firebase integration
- Requires comprehensive testing
- Example: "Implement artwork CRUD operations", "Build contact form dengan categories"

**8 SP - Large (3-5 hari)**
- Complex feature dengan many moving parts
- Multiple integrations, state management
- High test coverage requirement
- Example: "Build Kanban pipeline dengan drag-and-drop", "Implement analytics dashboard dengan charts"

**13 SP - Too Large (>5 hari)**
- Epic, harus dipecah menjadi smaller stories
- Don't commit 13 SP story dalam 2-week sprint
- Use untuk high-level planning, breakdown sebelum sprint

### Estimation Process: Planning Poker

**Steps:**
1. PO reads user story dan acceptance criteria
2. Team asks clarifying questions
3. Each developer privately picks estimate (1, 2, 3, 5, 8, 13)
4. Everyone reveals simultaneously
5. Jika ada perbedaan besar (>1 level), discuss reasoning
6. Re-vote hingga consensus (or majority)
7. SM records final estimate

**Tips:**
- Estimate berdasarkan effort, not time
- Consider complexity, risk, uncertainty
- Use reference stories ("similar to story X yang 5 SP")
- Don't overthink, estimation improves over time

---

## 4. Sprint Capacity Planning

### Team Velocity Calculation

**Formula:**
```
Velocity = Total SP completed dalam past 3 sprints / 3
```

**Initial Sprint (Sprint 0):**
- No historical data, use conservative estimate
- Assume 50-60% capacity (setup, learning curve)
- Target: 20-25 SP total team (4-5 SP per developer)

**Sprint 1-2:**
- Velocity akan stabilize
- Track actual vs planned, adjust next sprint
- Target: 30-35 SP total team (6-7 SP per developer)

**Sprint 3+:**
- Use rolling average dari past 3 sprints
- Mature team: 35-40 SP per 2-week sprint (7-8 SP per developer)

### Capacity Adjustments

**Factors yang reduce capacity:**
- Public holidays: -20% untuk hari affected
- Training/workshops: -planned hours
- Team member absence: -20% per person
- Technical debt sprint: reserve 20-30% untuk debt cleanup

**Example Capacity Calculation:**

```
Sprint 10 (2 minggu):
- 5 developers × 8 jam/hari × 10 hari kerja = 400 jam total
- 1 public holiday (-16 jam, 4%)
- 1 developer cuti 2 hari (-16 jam, 4%)
- Daily stand-up 10× 15 menit × 5 = 12.5 jam (3%)
- Ceremonies (planning, review, retro): 5 jam (1.25%)
- Buffer untuk unexpected: 5% (20 jam)

Effective capacity: 400 - 68.5 = 331.5 jam (~83% dari total)

If average: 1 SP = 4 jam
Sprint capacity: 331.5 / 4 ≈ 83 SP / 5 developers ≈ 16-17 SP per person

Adjust down untuk safety: Plan untuk 70-75 SP total (~15 SP per person)
```

---

## 5. Product Backlog Management

### Backlog Structure

**Epic → Feature → User Story → Task**

**Example Hierarchy:**

```
Epic: Artwork Management (SRS-F-007 to SRS-F-011)
├── Feature: Artwork CRUD
│   ├── User Story: Upload artwork dengan metadata
│   │   ├── Task: Design upload form UI
│   │   ├── Task: Implement Firebase Storage upload
│   │   ├── Task: Generate thumbnails (4 sizes)
│   │   ├── Task: Save metadata ke Firestore
│   │   └── Task: Write tests untuk upload flow
│   ├── User Story: View artwork gallery
│   ├── User Story: Edit artwork metadata
│   └── User Story: Delete artwork (soft delete)
└── Feature: Artwork Search & Filter
    ├── User Story: Search by title/medium
    └── User Story: Filter by status/year
```

### Backlog Prioritization (MoSCoW)

**Must Have (MVP High Priority - Sprint 1-4)**
- [x] Authentication (SRS-F-001 to SRS-F-004)
- [x] Artwork CRUD (SRS-F-007 to SRS-F-011)
- [x] Contact CRUD (SRS-F-012 to SRS-F-015)
- [x] Basic Dashboard (SRS-F-005, SRS-F-020 minimal)

**Should Have (MVP Medium Priority - Sprint 5-6)**
- [ ] Kanban Pipeline (SRS-F-018, SRS-F-019)
- [ ] Activity Logging (SRS-F-016, SRS-F-017)
- [ ] Search & Filter (SRS-F-022, SRS-F-023)

**Could Have (Post-MVP or Low Priority - Sprint 7-8)**
- [ ] Export functionality (SRS-F-021)
- [ ] Backup/Restore (SRS-F-024, SRS-F-025)
- [ ] Advanced Analytics

**Won't Have (Out of Scope untuk MVP)**
- Payment integration
- Mobile native app
- Multi-language support
- AI-powered features

### Backlog Refinement Process

**Frequency:** 1-2 kali per sprint (1-1.5 jam)

**Activities:**
1. **Review upcoming stories** (2-3 sprint ahead)
2. **Breakdown epics** menjadi user stories
3. **Write/refine acceptance criteria**
4. **Estimate stories** (planning poker)
5. **Identify dependencies** dan blockers
6. **Technical spike** planning jika needed

**Participants:** PO, SM, Development Team (3-4 representatives)

**Output:**
- Stories untuk next 2 sprints fully refined (DoR met)
- Rough estimates untuk 3rd sprint
- Identified risks atau technical uncertainties

---

## 6. Sprint Goal Setting

### Sprint Goal Format

**Template:**
```
Sprint [N] Goal: [Outcome-focused statement]

Key Deliverables:
- [Feature 1 with SRS reference]
- [Feature 2 with SRS reference]
- [Improvement/Fix]

Success Metrics:
- [Measurable outcome 1]
- [Measurable outcome 2]
```

**Example:**

```
Sprint 3 Goal: Complete core artwork management untuk enable portfolio building

Key Deliverables:
- Artwork CRUD operations functional (SRS-F-007 to SRS-F-010)
- Image upload dengan thumbnail generation (SRS-F-011)
- Artwork list dengan pagination dan basic search (SRS-F-022)

Success Metrics:
- Seniman dapat upload 10 artworks dalam <5 minutes
- Artwork list loads <2 seconds dengan 100+ artworks
- Zero critical bugs dalam upload flow
```

### Sprint Goal Principles

- **Outcome-focused**, not output-focused
  - Bad: "Complete 35 story points"
  - Good: "Enable seniman to fully manage artwork inventory"

- **Aligned dengan product vision** dan SKPL priorities

- **Achievable** within sprint capacity

- **Provides focus** - team bisa de-prioritize non-goal work

- **Valuable** - delivers demonstrable user value

---

## 7. Definition of Ready & Done

*Lihat dokumen terpisah: `DEFINITION_OF_DONE.md`*

**Quick Reference:**

**DoR Checklist (Before Sprint Planning):**
- [ ] Clear user story dengan acceptance criteria
- [ ] SKPL mapped (SRS-F-xxx)
- [ ] Estimated (1, 2, 3, 5, 8 SP)
- [ ] No blockers
- [ ] Design/mockup ready (jika UI)

**DoD Checklist (Before Mark as Done):**
- [ ] AC met & demoable
- [ ] Tests passing
- [ ] Code reviewed & merged
- [ ] Documentation updated
- [ ] No regression

---

## 8. Risk Management

### Common Risks & Mitigation

**Risk 1: Firebase Quota Exceeded**
- **Likelihood:** Medium
- **Impact:** High (block development)
- **Mitigation:**
  - Monitor Firebase usage weekly
  - Set up billing alerts (80% threshold)
  - Optimize queries untuk reduce reads
  - Use emulators untuk development
- **Contingency:** Upgrade ke Blaze plan jika needed (max budget approved)

**Risk 2: Team Member Unavailability**
- **Likelihood:** Medium
- **Impact:** Medium
- **Mitigation:**
  - Knowledge sharing sessions setiap sprint
  - Pair programming untuk critical features
  - Documentation (inline comments, README)
  - Cross-training dalam different domains
- **Contingency:** Re-distribute work, reduce sprint commitment

**Risk 3: Scope Creep dari Stakeholders**
- **Likelihood:** High (common di project mahasiswa)
- **Impact:** High (delays MVP)
- **Mitigation:**
  - PO strictly manage backlog priority
  - Defer non-MVP requests ke "Future Backlog"
  - Communicate MVP scope clearly
  - Show progress regularly (sprint reviews)
- **Contingency:** PO negotiates trade-offs (add feature X, remove feature Y)

**Risk 4: Technical Debt Accumulation**
- **Likelihood:** High
- **Impact:** High (long-term maintainability)
- **Mitigation:**
  - Reserve 15-20% capacity untuk refactoring setiap sprint
  - Code review enforce quality standards
  - Track tech debt items dalam backlog
  - Address critical debt immediately
- **Contingency:** Technical debt sprint (1 sprint every 4-6 sprints)

**Risk 5: Integration Issues dengan Firebase**
- **Likelihood:** Medium
- **Impact:** Medium-High
- **Mitigation:**
  - Technical spikes untuk uncertain integrations
  - Use Firebase emulators untuk testing
  - Prototype critical paths early (Sprint 0-1)
  - Consult Firebase documentation/community
- **Contingency:** Pivot to alternative approaches (denormalize data, change query patterns)

---

## 9. Communication Plan

### Daily Stand-up (15 menit)

**Time:** 09:15 - 09:30 WIB (setiap hari kerja)

**Format (per developer):**
1. **Yesterday:** Apa yang accomplished? (30 detik)
2. **Today:** Apa yang akan dikerjakan? (30 detik)
3. **Blockers:** Any impediments? (30 detik jika ada)

**Rules:**
- Time-boxed: 15 menit total (3 menit per person)
- Stand-up (tidak duduk) untuk keep energy
- Focus on work, not status report
- Parking lot untuk detailed discussions (after stand-up)

**SM Role:**
- Facilitate, keep time
- Note blockers untuk follow-up
- Ensure everyone participates

**Output:**
- Updated sprint board (move tasks)
- Blocker list untuk SM resolution

---

### Sprint Planning (3 jam untuk 2-week sprint)

**Part 1: Sprint Goal & Commitment (1.5 jam)**
- PO presents prioritized backlog
- Team reviews capacity (velocity, availability)
- Team commits ke Sprint Goal dan selected stories
- Confirm all committed stories meet DoR

**Part 2: Task Breakdown (1.5 jam)**
- Team breaks down stories menjadi tasks (2-8 jam tasks)
- Identify dependencies antar tasks
- Assign ownership (self-select)
- Create sprint backlog dalam board

**Participants:** Entire team (PO, SM, Developers)

**Output:**
- Sprint Goal defined
- Sprint Backlog (stories + tasks)
- Initial task assignments
- Updated sprint board

---

### Backlog Refinement (1.5 jam, mid-sprint)

**Activities:**
- PO presents stories untuk upcoming sprints
- Team asks clarifying questions
- Breakdown large stories (>8 SP)
- Estimate refined stories (planning poker)
- Identify technical spikes atau research needs

**Participants:** PO, SM, 3-4 developers (rotating)

**Output:**
- 2 sprints worth of refined stories (meet DoR)
- Updated estimates dalam backlog
- Spike stories created jika needed

---

### Sprint Review (1 jam)

**Agenda:**
1. **Sprint Goal Recap** (5 menit)
2. **Demo Completed Features** (30 menit)
   - Each developer demos their work
   - Live demo dalam staging environment
   - Showcase tests passing
3. **PO Acceptance** (10 menit)
   - PO verifies AC met
   - Accept atau request changes
4. **Metrics Review** (10 menit)
   - Velocity, burndown, completion rate
   - Compare planned vs actual
5. **Stakeholder Feedback** (5 menit)
   - Q&A dengan observers (dosen, user testers)
   - Collect improvement suggestions

**Participants:** Entire team + stakeholders (opsional)

**Output:**
- Accepted stories (officially Done)
- Feedback untuk PO backlog refinement
- Updated product increment

---

### Sprint Retrospective (1 jam)

**Agenda:**
1. **Set the Stage** (5 menit)
   - Recap sprint, create safe space
2. **Gather Data** (15 menit)
   - What went well? (keep doing)
   - What didn't go well? (stop doing)
   - What should we try? (start doing)
3. **Generate Insights** (20 menit)
   - Group similar themes
   - Vote on top issues (dot voting)
4. **Decide Actions** (15 menit)
   - Select 1-3 actionable improvements
   - Assign owner untuk each action
   - Define success criteria
5. **Close** (5 menit)
   - Summarize actions
   - Appreciate team contributions

**Participants:** Entire team (PO opsional)

**Facilitator:** Scrum Master

**Output:**
- Retro action items (1-3)
- Owner assigned
- Target completion: next sprint

**Retro Formats (Rotate):**
- Start-Stop-Continue
- 4Ls (Liked, Learned, Lacked, Longed For)
- Sailboat (Wind, Anchor, Island, Rocks)
- Mad-Sad-Glad

---

## 10. Metrics & Reporting

### Sprint Metrics

**1. Velocity (Story Points)**
- **Calculation:** Sum of completed SP per sprint
- **Target:** Stable velocity ±10% across sprints
- **Use:** Capacity planning untuk future sprints

**2. Burndown Chart**
- **Y-axis:** Remaining SP
- **X-axis:** Sprint days
- **Ideal:** Linear decrease ke zero by end
- **Reality:** Often flat early, steep at end (okay jika trend downward)

**3. Burnup Chart (Alternative)**
- **Y-axis:** Completed SP vs Total SP
- **Advantage:** Shows scope changes clearly

**4. Sprint Completion Rate**
- **Formula:** (Completed SP / Committed SP) × 100%
- **Target:** >85% completion rate
- **Red Flag:** <70% consistently (over-committing atau blockers)

**5. Cycle Time**
- **Definition:** Time dari task start → done
- **Target:** <3 hari untuk 5 SP story
- **Use:** Identify bottlenecks (long review time, testing delays)

**6. Defect Rate**
- **Calculation:** Bugs found post-release / Total stories
- **Target:** <5% defect rate
- **Use:** Quality indicator, improve testing if high

### Dashboard & Reporting

**Weekly Report (SM to Stakeholders):**
- Sprint progress (burndown)
- Completed features (dengan screenshots)
- Upcoming milestones
- Risks & mitigations

**Monthly Report:**
- Velocity trend (last 4 sprints)
- SKPL requirement coverage (% complete)
- Technical debt status
- Team health (retro insights)

**Tools:**
- GitHub Projects (sprint board, burndown)
- Google Sheets (velocity tracking, capacity planning)
- Notion/Confluence (documentation, meeting notes)

---

## 11. Continuous Improvement

### Inspect & Adapt

**Sprint Level:**
- Retrospective action items (1-3 per sprint)
- Track action completion dalam next sprint
- Measure impact (did it improve?)

**Release Level:**
- User feedback from beta testing
- Performance metrics (page load, error rates)
- SKPL requirement coverage review

**Process Level:**
- Review DoR/DoD effectiveness (quarterly)
- Update estimation scale jika needed
- Adjust sprint length jika team consensus

### Knowledge Management

**Documentation:**
- Technical decisions dalam ADR (Architecture Decision Records)
- Lessons learned dalam sprint retros
- Setup guides dan runbooks
- API documentation (Firebase schema, endpoints)

**Knowledge Sharing:**
- Bi-weekly tech talks (30 menit)
- Code review as learning opportunity
- Pair programming untuk complex features
- Wiki or Notion untuk centralized docs

---

## 12. Stakeholder Engagement

### Stakeholder Types

**Primary Stakeholders:**
- Dosen pembimbing (weekly updates)
- Target users - seniman visual (sprint reviews, user testing)

**Secondary Stakeholders:**
- Galeri owners (feedback on contact management)
- Art collectors (perspective on portfolio features)

### Engagement Plan

**Sprint Reviews:**
- Invite select stakeholders (rotating)
- Demo dalam staging environment
- Collect structured feedback (survey or Q&A)

**User Testing Sessions:**
- Sprint 2, 4, 6: Beta test dengan 3-5 seniman
- Task-based testing (complete workflow scenarios)
- Record feedback untuk backlog refinement

**Milestone Demos:**
- End of phase (after Sprint 4, Sprint 8)
- Formal presentation to all stakeholders
- Showcase MVP readiness

---

## 13. Tools & Technology

### Project Management
- **Sprint Board:** GitHub Projects or Trello
- **Documentation:** Notion, Confluence, or GitHub Wiki
- **Communication:** Slack/Discord (daily), Zoom/Meet (ceremonies)

### Development
- **Code Repository:** GitHub
- **CI/CD:** GitHub Actions (jika configured)
- **Error Tracking:** Firebase Crashlytics atau Sentry (opsional)
- **Performance Monitoring:** Firebase Performance (opsional)

### Testing
- **Unit/Component:** Vitest + Vue Test Utils
- **E2E:** Playwright atau Cypress (Sprint 3+)
- **Manual Testing:** Test cases dalam Google Sheets

---

## 14. Sprint 0 (Setup Sprint)

**Goal:** Setup project infrastructure dan align team

**Duration:** 1 week (half sprint)

**Deliverables:**
- [ ] Firebase project created dan configured
- [ ] GitHub repository dengan branch strategy
- [ ] Vite + Vue project bootstrapped
- [ ] Path aliases configured (`@` → `src`)
- [ ] Vitest setup dengan smoke test
- [ ] Documentation structure (docs/ folder)
- [ ] Team roles assigned (PO, SM, Developers)
- [ ] DoR/DoD agreed dan documented
- [ ] Sprint calendar defined
- [ ] Initial backlog created dengan priorities

**No story points counted** (setup overhead)

---

## 15. Success Criteria (MVP Launch)

**Functional Success:**
- [ ] All High Priority SRS requirements met (SRS-F-001 to SRS-F-015, F-020 basic)
- [ ] Core workflows functional: Auth → Upload Artwork → Manage Contacts → View Dashboard
- [ ] 5 beta users tested successfully tanpa critical bugs

**Quality Success:**
- [ ] Test coverage >70% untuk critical paths
- [ ] Build time <30 seconds
- [ ] Page load <2 seconds (Chrome, 3G throttle)
- [ ] Zero unhandled errors dalam production monitoring

**Process Success:**
- [ ] Consistent velocity (±10%) untuk last 3 sprints
- [ ] >85% sprint completion rate average
- [ ] Team satisfaction score >4/5 dalam final retro

**Documentation Success:**
- [ ] All docs folder complete (setup guide, API docs, testing guide)
- [ ] Code comments untuk complex logic
- [ ] Deployment runbook

---

## Appendix A: Sprint Calendar Template

```
SPRINT N: [Start Date] - [End Date]

WEEK 1:
Mon - Sprint Planning (09:00-12:00)
      Development start
Tue - Daily Stand-up (09:15-09:30)
      Development
Wed - Daily Stand-up (09:15-09:30)
      Backlog Refinement (14:00-15:30)
      Development
Thu - Daily Stand-up (09:15-09:30)
      Development (no meeting afternoon)
Fri - Daily Stand-up (09:15-09:30)
      Development

WEEK 2:
Mon - Daily Stand-up (09:15-09:30)
      Development
Tue - Daily Stand-up (09:15-09:30)
      Development (no meeting afternoon)
Wed - Daily Stand-up (09:15-09:30)
      Development
Thu - Daily Stand-up (09:15-09:30)
      Code freeze 17:00
      Final testing
Fri - Sprint Review (09:00-10:00)
      Sprint Retrospective (10:15-11:15)
      (Optional) Next Sprint Planning prep
```

---

## Appendix B: Useful Resources

- Scrum Guide: https://scrumguides.org/
- Atlassian Agile Coach: https://www.atlassian.com/agile
- Mountain Goat Software (Mike Cohn): https://www.mountaingoatsoftware.com/
- Firebase Documentation: https://firebase.google.com/docs
- Vue 3 Best Practices: https://vuejs.org/style-guide/
- SKPL ArtConnect v1.4 (internal dokumen)

---

**Document Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** Scrum Master  
**Review Cycle:** After Sprint 2, Sprint 4, Sprint 6 (adjust as needed)
