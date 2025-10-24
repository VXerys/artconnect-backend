# Sprint Tracking & Progress Monitoring – ArtConnect

## Overview

Dokumen ini menjelaskan sistem tracking sprint, tools, metrics, dan board management untuk memantau progress dan mengidentifikasi bottlenecks dalam pengembangan ArtConnect.

---

## 1. Sprint Board Structure

### Recommended Tool

**Primary:** GitHub Projects (integrated dengan repository)  
**Alternative:** Trello, Jira, or Asana

### Board Columns (Kanban Style)

```
┌─────────────┬─────────┬──────────────┬─────────────┬─────────┬──────┐
│  Backlog    │  Ready  │ In Progress  │ In Review   │ Testing │ Done │
│             │         │              │             │         │      │
│ (No Limit)  │ (Ready) │  WIP: 2/dev  │  WIP: 4     │ (Flow)  │      │
└─────────────┴─────────┴──────────────┴─────────────┴─────────┴──────┘
```

### Column Definitions

#### Backlog
- **Purpose:** All potential work items (not yet committed)
- **Entry Criteria:** Created dan described (basic)
- **Exit Criteria:** Meets Definition of Ready
- **WIP Limit:** None
- **Owner:** Product Owner

#### Ready
- **Purpose:** Refined stories yang ready untuk sprint
- **Entry Criteria:** DoR met (AC written, estimated, dependencies clear)
- **Exit Criteria:** Selected dalam Sprint Planning
- **WIP Limit:** 1-2 sprint capacity (flexible)
- **Owner:** Product Owner + Team

#### In Progress
- **Purpose:** Work actively being developed
- **Entry Criteria:** Committed dalam sprint, developer assigned
- **Exit Criteria:** Code complete, tests written, ready untuk review
- **WIP Limit:** **2 tasks per developer** (prevent context switching)
- **Owner:** Assigned Developer

#### In Review
- **Purpose:** Code awaiting peer review
- **Entry Criteria:** PR opened, CI passing, self-reviewed
- **Exit Criteria:** Approved by reviewer, merge ready
- **WIP Limit:** **4 total** (encourage fast reviews)
- **Owner:** Assigned Reviewer + Original Developer

#### Testing
- **Purpose:** Manual testing / QA verification
- **Entry Criteria:** PR merged ke staging, deployed
- **Exit Criteria:** All acceptance criteria verified, no blockers
- **WIP Limit:** None (fast flow)
- **Owner:** Tester or Developer (pair testing)

#### Done
- **Purpose:** Work completed dan accepted
- **Entry Criteria:** DoD met, PO accepted (dalam Sprint Review)
- **Exit Criteria:** Sprint ends (move ke archive)
- **WIP Limit:** None
- **Owner:** Team

---

## 2. Card Structure (User Story)

### Card Template

```markdown
## [SRS-F-007] Upload Artwork dengan Metadata

**As a** seniman visual  
**I want to** upload karya seni dengan foto dan metadata lengkap  
**So that** saya dapat mendokumentasikan portofolio digital secara terorganisir

### Acceptance Criteria
- [ ] User dapat upload JPEG/PNG/WebP max 10MB
- [ ] System generate 4 thumbnail sizes (150, 400, 800, original)
- [ ] Required fields: title, medium, year, dimensions
- [ ] Upload progress indicator visible untuk file >2MB
- [ ] Error handling untuk invalid format, size exceeded
- [ ] Success confirmation dengan preview thumbnail

### Details
- **Estimate:** 5 SP
- **Sprint:** Sprint 2
- **Priority:** High (Must Have)
- **Assigned:** @developer1, @developer2
- **Dependencies:** Firebase Storage configured
- **Design:** [Figma Link]

### Tasks
- [ ] Design upload form UI (4h) - @dev1
- [ ] Implement Firebase Storage upload (6h) - @dev2
- [ ] Generate thumbnails (4h) - @dev2
- [ ] Form validation (3h) - @dev1
- [ ] Write unit tests (4h) - @dev1
- [ ] Integration testing (3h) - @dev2

### Links
- SKPL: SRS-F-007, SRS-F-011
- PR: #42
- Related: Contact Management (dependency)
```

### Card Labels/Tags

**Priority:**
- 🔴 Critical (blocking other work)
- 🟠 High (MVP essential)
- 🟡 Medium (nice to have)
- 🟢 Low (future enhancement)

**Type:**
- `feature` - New functionality
- `bug` - Fix broken behavior
- `tech-debt` - Refactoring, improvement
- `docs` - Documentation only
- `spike` - Research/investigation

**Domain:**
- `auth` - Authentication
- `artwork` - Inventory management
- `contact` - Contact/CRM
- `pipeline` - Kanban pipeline
- `analytics` - Dashboard/reporting
- `ui` - UI components

**Status Flags:**
- `blocked` - Cannot progress (dependency/blocker)
- `help-wanted` - Need assistance
- `review-needed` - Awaiting review
- `hotfix` - Critical production fix

---

## 3. WIP (Work In Progress) Limits

### Purpose
Limit concurrent work untuk:
- Reduce context switching
- Encourage focus dan completion
- Surface bottlenecks quickly
- Improve flow efficiency

### Recommended Limits (5-person team)

| Column | WIP Limit | Rationale |
|--------|-----------|-----------|
| Backlog | No limit | Collecting ideas |
| Ready | 15-20 stories | 1-2 sprint capacity |
| In Progress | 10 (2 per dev) | Focus on completion |
| In Review | 4 | Fast reviews |
| Testing | No limit | Fast flow |
| Done | No limit | Accumulates during sprint |

### Enforcing WIP Limits

**When WIP limit reached:**
1. **Stop starting, start finishing** - Help complete existing work before pulling new
2. **Swarm:** Multiple developers collaborate untuk unblock
3. **Pair/mob programming:** Work together to finish faster

**Example:**
- In Review column has 4 PRs (at limit)
- Developer finishes their task, ready untuk new work
- **Don't start new:** Instead, review someone's PR first
- **After review:** WIP limit freed, now can start new task

---

## 4. Sprint Burndown Chart

### What is Burndown Chart?

Visualisasi yang menunjukkan **remaining work (SP)** vs **time** dalam sprint.

### Components

**Y-Axis:** Remaining Story Points  
**X-Axis:** Sprint Days (Day 1 → Day 10 untuk 2-week sprint)  
**Ideal Line:** Straight diagonal dari total SP → 0  
**Actual Line:** Real progress (update daily)

### Example Burndown

```
SP
40 │●
   │  ╲
35 │   ●
   │    ╲
30 │     ●───●  [Actual - flat due to clarifications]
   │          ╲
25 │           ●
   │            ╲  [Ideal]
20 │             ●
   │              ╲
15 │               ●
   │                ╲
10 │                 ●
   │                  ╲
 5 │                   ●●
   │                     ╲●
 0 └────────────────────────●─
    1  2  3  4  5  6  7  8  9 10 (Days)
```

### Reading Burndown

**Healthy Patterns:**
- ✅ Actual line tracks close ke ideal (±10%)
- ✅ Steady downward trend
- ✅ Reaches zero or near-zero by end

**Warning Patterns:**
- ⚠️ Flat line (no progress) - blockers, unclear requirements
- ⚠️ Line goes up - scope added mid-sprint
- ⚠️ Steep drop at end - work rushed, quality risk

### Daily Update Process

**Who:** Scrum Master (automated jika tool supports)  
**When:** After daily stand-up (09:30)  
**How:** Sum remaining SP dari "To Do" dan "In Progress" columns

---

## 5. Sprint Burnup Chart (Alternative)

### What is Burnup Chart?

Visualisasi yang menunjukkan **completed work** dan **total scope** over time.

### Components

**Y-Axis:** Story Points  
**X-Axis:** Sprint Days  
**Total Scope Line:** Horizontal (atau naik jika scope added)  
**Completed Line:** Starts at 0, rises as work done

### Advantage over Burndown

- **Scope changes visible:** If scope added, total line moves up
- **Progress clearer:** See what's done, not just what's left
- **Motivating:** Upward trend feels like achievement

---

## 6. Velocity Tracking

### Definition

**Velocity = Total Story Points completed per sprint**

### Calculating Velocity

**Formula:**
```
Velocity = Sum of completed SP dalam sprint
```

**Rolling Average (Recommended):**
```
Average Velocity = (Sprint N + Sprint N-1 + Sprint N-2) / 3
```

### Velocity Chart Example

| Sprint | Committed SP | Completed SP | Velocity | 3-Sprint Avg |
|--------|-------------|--------------|----------|--------------|
| Sprint 1 | 25 | 22 | 22 | - |
| Sprint 2 | 30 | 28 | 28 | - |
| Sprint 3 | 32 | 30 | 30 | 26.7 |
| Sprint 4 | 35 | 33 | 33 | 30.3 |
| Sprint 5 | 35 | 32 | 32 | 31.7 |
| Sprint 6 | 35 | 34 | 34 | 33.0 |

### Using Velocity for Planning

**Capacity Planning:**
```
Next Sprint Capacity = Average Velocity (last 3 sprints)
```

**Example:**
- Last 3 sprints: 30, 33, 32 SP
- Average: (30+33+32)/3 = 31.7 SP
- Plan Sprint 7 untuk 30-32 SP (slight buffer)

### Velocity Best Practices

**DO ✅**
- Track honestly (don't inflate to look good)
- Use untuk planning, not performance evaluation
- Expect velocity to increase after 3-4 sprints (team learning)
- Factor in holidays, vacations (reduce expected velocity)

**DON'T ❌**
- Compare velocity across teams (different estimation scales)
- Pressure team untuk increase velocity (sacrifices quality)
- Cherry-pick sprints (use consistent rolling average)
- Count partially done stories (only truly Done work)

---

## 7. Cycle Time & Lead Time

### Definitions

**Cycle Time:** Time dari "In Progress" → "Done"  
**Lead Time:** Time dari "Backlog" → "Done"

### Why Track?

- **Identify bottlenecks:** Which column slows work?
- **Predict delivery:** How long untuk similar stories?
- **Process improvement:** Target untuk reduce cycle time

### Target Cycle Times (2-week sprint)

| Story Size | Target Cycle Time | Max Acceptable |
|------------|-------------------|----------------|
| 1-2 SP | 1 day | 2 days |
| 3 SP | 2 days | 3 days |
| 5 SP | 3 days | 5 days |
| 8 SP | 5 days | 8 days |

### Tracking Cycle Time

**Manual Method:**
- Tag card dengan timestamp saat move ke "In Progress"
- Calculate duration saat move ke "Done"
- Average across stories per sprint

**Tool Automation:**
- GitHub Projects: Use Insights (cycle time reports)
- Jira: Built-in cycle time charts

### Using Cycle Time Data

**Example Analysis:**
```
Sprint 3 Cycle Time Breakdown:

Story A (5 SP): 
  In Progress: 2 days
  In Review: 3 days ← Bottleneck!
  Testing: 1 day
  Total: 6 days

Action: Reduce review time
  - Reserve daily PR review slot
  - Smaller PRs (<300 LOC)
  - Pair programming untuk complex features
```

---

## 8. Sprint Completion Rate

### Formula

```
Completion Rate = (Completed SP / Committed SP) × 100%
```

### Target

**Healthy Range:** 85-100%  
**Warning:** <80% consistently (over-committing)  
**Excellent:** 95-100% (realistic planning)

### Example

```
Sprint 4:
  Committed: 35 SP
  Completed: 32 SP
  Completion Rate: (32/35) × 100% = 91.4% ✅

Sprint 5:
  Committed: 35 SP
  Completed: 25 SP
  Completion Rate: (25/35) × 100% = 71.4% ⚠️
  → Investigate: blockers? Over-estimation? Scope creep?
```

### Low Completion Rate Causes

1. **Over-commitment:** Team committed >velocity
2. **Blockers:** External dependencies delayed work
3. **Underestimation:** Stories more complex than estimated
4. **Scope creep:** Stories expanded mid-sprint
5. **Interruptions:** Unplanned work (production bugs, meetings)

### Action Based on Completion Rate

**If <80%:**
- Review estimation accuracy (planning poker calibration)
- Identify blockers earlier (daily stand-up)
- Reduce sprint commitment (plan for 80% velocity)
- Discuss dalam retrospective

---

## 9. Defect Rate

### Formula

```
Defect Rate = (Bugs found / Total stories delivered) × 100%
```

### Target

**Healthy:** <5% defect rate  
**Warning:** 5-10% (testing gaps)  
**Critical:** >10% (quality issues, improve testing)

### Tracking Bugs

**Categories:**
- **Critical:** Breaks core functionality, blocks users
- **High:** Major feature broken, workaround exists
- **Medium:** Minor issue, cosmetic or edge case
- **Low:** Nice-to-fix, low user impact

**Source:**
- **Pre-Release:** Found dalam Testing column (good!)
- **Post-Release:** Found by users/stakeholders (bad!)
- **Production:** Found dalam live environment (critical!)

### Using Defect Rate

**High Defect Rate Actions:**
1. **Improve test coverage:** Add unit/component tests
2. **Better code review:** Enforce checklist
3. **QA earlier:** Test dalam In Progress, not just end
4. **Pair programming:** For complex features
5. **Technical debt:** Address accumulated debt

---

## 10. Dashboard & Reporting

### Real-Time Sprint Dashboard

**Components:**
1. **Sprint Goal** (top, always visible)
2. **Burndown Chart** (primary metric)
3. **Days Remaining** (countdown)
4. **Velocity** (current sprint vs avg)
5. **Completion Rate** (projected)
6. **Blockers** (red flag list)
7. **WIP Status** (column fills)

### Weekly Report to Stakeholders

**Template:**

```markdown
## ArtConnect Sprint 4 - Weekly Update

**Sprint Goal:** Enable seniman to manage artwork inventory

**Progress:**
- Completed: 18 / 35 SP (51%)
- On Track: Yes (Day 5 of 10)
- Blockers: 1 (design mockup for search filters - resolved)

**Completed This Week:**
✅ Artwork upload dengan image (SRS-F-007, F-011)
✅ Artwork list gallery view (SRS-F-010)
✅ Basic search by title (SRS-F-022)

**In Progress:**
🔄 Edit artwork metadata (SRS-F-008) - 80% complete
🔄 Delete artwork (soft delete) (SRS-F-009) - PR in review

**Next Week:**
📅 Complete remaining 17 SP
📅 Sprint Review demo on Friday
📅 Focus: polish UI, comprehensive testing

**Risks:**
⚠️ One developer absent Thu-Fri (planned vacation)
✅ Mitigation: Work redistributed, adjusted commitment

**Metrics:**
- Velocity (last 3): 30 SP avg
- Cycle Time: 2.8 days avg (target: <3)
- Defect Rate: 3% (1 bug / 18 SP delivered)
```

---

## 11. Tools & Automation

### GitHub Projects Setup

**Board View:**
1. Create new Project (Board layout)
2. Add columns: Backlog, Ready, In Progress, In Review, Testing, Done
3. Set field "Story Points" (number)
4. Set field "Priority" (select: High, Medium, Low)
5. Set field "Sprint" (iteration field)

**Automation:**
- Auto-move to "In Progress" saat issue assigned
- Auto-move to "In Review" saat PR opened
- Auto-move to "Done" saat PR merged

**Insights:**
- Burndown chart (built-in untuk Projects Beta)
- Velocity tracking (custom via Actions)
- Cycle time reports (GitHub API)

### Alternative Tools

**Trello:**
- Pros: Simple, visual, free
- Cons: Limited reporting, manual tracking
- Use case: Small teams, simple projects

**Jira:**
- Pros: Powerful reporting, automation, integrations
- Cons: Complex, steep learning curve, cost
- Use case: Large teams, enterprise

**Notion:**
- Pros: All-in-one (docs + board), flexible
- Cons: Not specialized untuk Scrum, manual setup
- Use case: Integrated knowledge base + tracking

---

## 12. Daily Tracking Routine

### Morning Routine (Before Stand-up)

**Each Developer (5 menit):**
1. Update card status (move columns jika changed)
2. Update task checkboxes (mark complete)
3. Add comments jika blocked atau need help
4. Review assigned PRs (prioritize reviews)

**Scrum Master (10 menit):**
1. Review board state (WIP limits, blockers)
2. Update burndown chart (calculate remaining SP)
3. Identify at-risk stories (cycle time long)
4. Prepare stand-up notes (blockers to discuss)

### Stand-up (15 menit)

- Walk the board atau three questions
- Update board real-time (move cards)
- Tag blockers with `blocked` label
- Assign reviewers untuk PRs

### Evening Routine (Optional)

**Scrum Master (5 menit):**
- Final board check (any stuck cards?)
- Send reminders untuk overdue reviews
- Note wins untuk celebrating next day

---

## 13. Handling Common Scenarios

### Scenario 1: Story Blocked Mid-Sprint

**Action:**
1. Tag card dengan `blocked` label (red)
2. Add comment: reason, who can unblock, ETA
3. SM escalates immediately (don't wait)
4. Developer switches ke different story (maintain velocity)
5. Track dalam daily stand-up until resolved

**Example:**
```
Story: Artwork Search Integration
Blocked: Waiting for Firebase index configuration
Blocker Owner: @SM (contact Firebase support)
ETA: 2 days
Workaround: Developer starts Contact Management (next priority)
```

### Scenario 2: Story Grows Mid-Sprint

**Action:**
1. Assess: dapat diselesaikan dalam sprint?
2. **Option A:** Scope down (defer some AC ke new story)
3. **Option B:** Accept delay (might miss Sprint Goal, discuss with PO)
4. **Option C:** Swarm (multiple developers collaborate)
5. Update estimate dalam retro (learning for future)

### Scenario 3: Unplanned Work (Production Bug)

**Action:**
1. Triage severity (Critical = interrupt sprint, Medium = queue)
2. If Critical:
   - Create hotfix card, add ke board
   - Developer pauses current work
   - Fix, test, deploy ASAP
   - Count SP dalam sprint (reduce velocity realistically)
3. If Medium/Low:
   - Add ke Product Backlog
   - PO prioritizes untuk next sprint
   - Don't interrupt current sprint

### Scenario 4: Developer Absent

**Action:**
1. Notify team immediately (daily stand-up atau Slack)
2. SM reassigns their tasks:
   - WIP stories → pair finish dengan another dev
   - Not started → defer or reassign
3. Adjust sprint commitment if multi-day absence
4. Document dalam sprint notes (explain velocity impact)

---

## 14. Sprint Health Metrics

### Green Flags (Healthy Sprint) ✅

- Burndown tracks close ke ideal line (±10%)
- Velocity consistent (±2 SP dari average)
- Completion rate >85%
- Cycle time within targets
- WIP limits respected
- No chronic blockers (>2 days)
- Team morale high (retro feedback positive)

### Yellow Flags (Monitor) ⚠️

- Burndown flat for 2-3 days (clarify requirements)
- Velocity varies 10-20% (estimation calibration needed)
- Completion rate 70-85% (slight over-commitment)
- Cycle time 20% over target (review process)
- WIP limits occasionally exceeded (remind team)
- Some blockers lingering (SM escalate)

### Red Flags (Action Needed) 🚨

- Burndown not moving (>3 days flat)
- Velocity dropped >20% (major blocker or team issue)
- Completion rate <70% (serious over-commitment or problem)
- Cycle time >50% over target (bottleneck in process)
- WIP limits consistently ignored (discipline issue)
- Multiple blockers unresolved (escalation needed)
- Team burnout signals (retro feedback negative)

**Red Flag Response:**
1. **Immediate stand-up:** Discuss as team
2. **SM investigates:** Root cause analysis
3. **PO involved:** Scope adjustment if needed
4. **Action plan:** Concrete steps to resolve
5. **Daily monitoring:** Until back to green

---

## 15. Continuous Improvement

### Sprint Tracking Retrospective Questions

**Process:**
- Are we updating board consistently?
- Is burndown chart useful untuk predictions?
- Are WIP limits helping atau hindering?
- Do metrics drive right behaviors?

**Tools:**
- Is tool easy to use?
- Are automations working?
- Do we need different views/reports?

**Team:**
- Is tracking overhead reasonable (<5% time)?
- Are we using data untuk decisions?
- What metrics should we add/remove?

### Evolving Tracking System

**Sprint 1-2:** Basic board + manual burndown  
**Sprint 3-4:** Add velocity tracking, automate updates  
**Sprint 5-6:** Add cycle time, defect rate  
**Sprint 7+:** Custom dashboards, predictive analytics

---

## Conclusion

Effective sprint tracking provides visibility, enables data-driven decisions, dan surfaces issues early. Balance rigorous tracking dengan practical overhead - tools should serve the team, not vice versa.

**Key Principles:**
- **Transparency:** Everyone sees same data
- **Timeliness:** Real-time updates, not batch
- **Actionable:** Metrics drive improvements
- **Lightweight:** Minimal overhead (<5% time)
- **Inspectable:** Regular review dan adaptation

**Referensi:**
- Kanban Guide: https://kanbanguides.org/
- Scrum Metrics: https://www.scrum.org/resources/blog/myths-and-mistakes-scrum-metrics
- GitHub Projects: https://docs.github.com/en/issues/planning-and-tracking-with-projects
