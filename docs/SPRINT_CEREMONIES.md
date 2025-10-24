# Sprint Ceremonies – ArtConnect

## Overview

Sprint ceremonies adalah event terstruktur dalam Scrum framework yang memfasilitasi transparency, inspection, dan adaptation. Dokumen ini memberikan panduan detail untuk setiap ceremony dalam konteks pengembangan ArtConnect.

---

## 1. Daily Stand-up (Daily Scrum)

### Purpose
Sinkronisasi harian tim untuk men-inspect progress toward Sprint Goal dan adapt Sprint Backlog as needed.

### Time-box
**15 menit** (sharp)

### Schedule
**Setiap hari kerja, 09:15 - 09:30 WIB**

### Participants
- **Required:** Semua developers
- **Optional:** PO (listen only), SM facilitates

### Format

#### Standard Three Questions (per developer)
1. **What did I complete yesterday?**
   - Specific tasks atau stories
   - Example: "Completed artwork upload form component, PR #42 reviewed"

2. **What will I work on today?**
   - Planned work dari sprint backlog
   - Example: "Implement Firebase Storage integration untuk image upload"

3. **Are there any impediments?**
   - Blockers yang prevent progress
   - Example: "Waiting for design mockup untuk contact form" atau "Stuck on Firestore query optimization"

#### Alternative Format: Walk the Board
- Start dari rightmost column (Done) → leftmost (To Do)
- For each card: Who's working? Status? Blocked?
- More visual, good untuk distributed teams

### Rules & Etiquette

**DO ✅**
- Start exactly on time (09:15)
- Stand up (keep energy, encourage brevity)
- Speak clearly dan concisely (30-60 seconds per person)
- Focus on Sprint Goal progress
- Raise impediments immediately
- Update board before stand-up (move cards, update status)

**DON'T ❌**
- Turn into detailed problem-solving session
- Discuss code implementations (parking lot)
- Report to Scrum Master/PO (talk to team)
- Skip stand-up without notice
- Multi-task (phone, laptop closed)

### Handling Impediments

**Types of Impediments:**
- **Technical:** Bug, library issue, environment problem
- **External:** Waiting for design, API access, third-party
- **Team:** Dependency on another developer's work
- **Personal:** Sick, appointment, other commitment

**Impediment Resolution:**
1. **Raise in stand-up** (briefly state problem)
2. **SM takes note** dan follows up
3. **After stand-up**: SM coordinates resolution
   - Quick fix: Pair with another developer
   - External: Escalate to PO atau stakeholder
   - Blocker: Re-prioritize work, start different task

### Remote Stand-up Best Practices

**Tools:** Zoom/Google Meet (video ON)

**Process:**
- Use "raise hand" feature untuk order
- SM shares sprint board screen
- Timer visible (15 minute countdown)
- Record untuk async team members (optional)

### Stand-up Anti-Patterns to Avoid

❌ **Status Report Meeting**
- Symptom: Everyone reports to SM/PO, not discussing dengan team
- Fix: Remind team to talk TO each other, not ABOUT work

❌ **Problem-Solving Session**
- Symptom: Stand-up runs 30+ minutes discussing solutions
- Fix: Use parking lot, "let's discuss after stand-up"

❌ **Late Start**
- Symptom: Waiting for latecomers, starts 09:20
- Fix: Start on time regardless, latecomers listen and catch up

❌ **Silent Stand-up**
- Symptom: No energy, robotic updates
- Fix: Vary format, celebrate wins, SM inject humor

---

## 2. Sprint Planning

### Purpose
Definisikan Sprint Goal, pilih work dari Product Backlog, dan create plan untuk delivering Increment.

### Time-box
**4 jam untuk 4-week sprint** (scale: 2 jam untuk 2-week sprint dalam praktik ArtConnect: 3 jam)

### Schedule
**Sprint Day 1 (Monday), 09:00 - 12:00**

### Participants
- **Required:** Entire Scrum Team (PO, SM, All Developers)

### Agenda

#### Part 1: Why & What (1.5 jam)

**1. PO Presents Product Backlog (15 menit)**
- Review prioritized backlog
- Highlight high-priority items untuk sprint
- Provide context: user feedback, business value, SKPL alignment

**2. Team Reviews Sprint Capacity (15 menit)**
- Calculate available hours/SP
  - Days in sprint × developers
  - Subtract holidays, planned absences
  - Apply velocity from past 3 sprints
- Declare capacity (example: "We have capacity untuk 35 SP")

**3. Craft Sprint Goal (30 menit)**
- Collaborative discussion: what outcome untuk sprint?
- Examples:
  - Bad: "Complete 10 stories"
  - Good: "Enable seniman to fully manage artwork inventory"
- Write Sprint Goal di board (visible to all)
- PO confirms alignment dengan product vision

**4. Select Sprint Backlog Items (30 menit)**
- PO proposes stories (top priority first)
- Team asks clarifying questions
- Team verifies DoR met
- Team commits atau declines each story
- Continue until capacity reached
- Final confirmation: "Can we achieve Sprint Goal dengan these stories?"

**Output Part 1:**
- Sprint Goal documented
- Sprint Backlog selected (stories committed)

---

#### Part 2: How (1.5 jam)

**5. Task Breakdown (60 menit)**
- For each story in Sprint Backlog:
  - Break down into technical tasks (2-8 jam each)
  - Examples:
    - "Design upload form UI" (4h)
    - "Implement Firebase upload" (6h)
    - "Write unit tests" (4h)
    - "Create documentation" (2h)
- Create task cards dalam sprint board
- Identify dependencies antar tasks

**6. Task Assignment (20 menit)**
- Developers self-select tasks
- Aim untuk balanced workload
- Consider skill match dan learning opportunities
- Mark initial assignments (flexible during sprint)

**7. Risks & Dependencies (10 menit)**
- Identify technical risks (unknown libraries, complex integration)
- Note external dependencies (design, PO clarification)
- Plan mitigation (spike stories, research time)

**Output Part 2:**
- Sprint Backlog dengan tasks detailed
- Initial task assignments
- Risk register updated

---

### Sprint Planning Preparation

**PO Preparation (1 day before):**
- [ ] Ensure top N stories (for sprint capacity) meet DoR
- [ ] Prepare to explain business value dan acceptance criteria
- [ ] Review past sprint performance (velocity, completion rate)
- [ ] Anticipate questions developers might ask

**SM Preparation (1 day before):**
- [ ] Calculate team capacity (days, velocity, absences)
- [ ] Prepare sprint planning board (template)
- [ ] Reserve meeting room/zoom link
- [ ] Send calendar invite dengan agenda

**Developers Preparation (day of):**
- [ ] Review prioritized backlog beforehand
- [ ] Identify stories dengan questions untuk PO
- [ ] Come prepared to commit

---

### Sprint Planning Tips

**For PO:**
- Know your top priority - don't waffle
- Be prepared to negotiate scope vs value
- Trust team estimate, don't pressure lower SP

**For SM:**
- Timebox each section strictly
- Use timer visible to all
- Parking lot untuk off-topic discussions
- Keep energy up (breaks, movement)

**For Developers:**
- Ask questions early (don't assume)
- Be realistic about capacity (don't over-commit)
- Voice concerns about unclear stories
- Volunteer untuk challenging tasks (growth)

---

## 3. Backlog Refinement (Grooming)

### Purpose
Review dan improve Product Backlog items, ensuring stories are ready untuk upcoming sprints.

### Time-box
**1.5 jam per session**, 1-2 kali per sprint

### Schedule
**Mid-sprint (contoh: Wednesday, 14:00 - 15:30)**

### Participants
- **Required:** PO, SM, 3-4 developers (rotating representation)
- **Optional:** Entire team welcome

### Activities

#### 1. Review Upcoming Stories (30 menit)
- PO presents stories dari backlog (sprint N+1, N+2)
- Discuss business value, user need, SKPL reference
- Team asks clarifying questions
- Identify missing information (design, API spec, etc.)

#### 2. Write/Refine Acceptance Criteria (30 menit)
- Collaborate on clear, testable AC
- Use Given-When-Then atau checklist format
- Example:
  ```
  Story: Upload Artwork
  AC:
  - User dapat select JPEG/PNG file max 10MB
  - System validates format dan size before upload
  - Progress indicator visible untuk file >2MB
  - Success message dengan thumbnail preview
  - Error handling untuk invalid format, size exceeded
  ```
- Ensure AC align dengan SKPL requirements

#### 3. Breakdown Large Stories (20 menit)
- Identify stories >8 SP (too large untuk 2-week sprint)
- Split into smaller, independently valuable stories
- Example:
  ```
  Epic: Artwork Management (20 SP)
  → Story 1: Upload artwork dengan metadata (5 SP)
  → Story 2: View artwork gallery (3 SP)
  → Story 3: Edit artwork details (3 SP)
  → Story 4: Delete artwork (soft delete) (2 SP)
  ```

#### 4. Estimation (Planning Poker) (10 menit)
- Estimate refined stories
- Quick poker rounds (don't overthink)
- Record estimates dalam backlog

### Output
- Stories untuk next 2 sprints fully refined (meet DoR)
- Estimates assigned
- Blocker atau dependencies identified
- Action items untuk PO (get design, clarify with stakeholder)

### Refinement Best Practices

**DO ✅**
- Focus on 2-3 sprints ahead (not too far)
- Refine enough untuk keep Sprint Planning short
- Involve developers early (avoid surprises)
- Keep stories small dan valuable

**DON'T ❌**
- Over-refine backlog (waste jika priorities change)
- Skip refinement (leads to long Sprint Planning)
- Let PO dictate solution (team owns "how")

---

## 4. Sprint Review (Demo)

### Purpose
Inspect Increment dan adapt Product Backlog based on outcome dan feedback.

### Time-box
**2 jam untuk 4-week sprint** (ArtConnect: 1 jam untuk 2-week sprint)

### Schedule
**Sprint Last Day (Friday), 09:00 - 10:00**

### Participants
- **Required:** Scrum Team (PO, SM, Developers)
- **Optional/Invited:** Stakeholders (dosen, beta users, galeri owner)

### Agenda

#### 1. Sprint Goal Recap (5 menit)
- SM reviews Sprint Goal
- Context: what was planned, what was delivered

#### 2. Demo Completed Features (35 menit)
- **Format:** Live demo dalam staging environment
- Each developer demonstrates their completed work
- **Demo Structure (per feature):**
  - Context: User story, acceptance criteria
  - Live walkthrough: Show, don't tell (click through flow)
  - Edge cases: Show error handling, validation
  - Tests: Quick show tests passing (CI/CD green)
  - Invite feedback: "Thoughts? Questions?"

**Example Demo Script:**
```
Story: Upload Artwork dengan Image
- "As seniman, saya login ke dashboard..."
- "Navigate ke Artworks → Add New"
- "Upload file: select photo.jpg (5MB)"
- "Fill metadata: Title, Medium, Year, Dimensions"
- "Submit... system uploads, generates thumbnails"
- "Success! Artwork appears dalam gallery dengan thumbnail"
- "Error case: try upload 15MB → see validation error"
- "Tests passing: unit tests untuk validation, component tests untuk form"
```

#### 3. PO Acceptance (10 menit)
- PO reviews each story against AC
- Accept (move to Done) or Request Changes
- If changes needed: create new story dalam backlog
- Update sprint board real-time

#### 4. Metrics Review (5 menit)
- Velocity: SP planned vs completed
- Burndown chart: Sprint progress
- Defects: Bugs found vs stories completed
- Comparison: This sprint vs past sprints

#### 5. Stakeholder Feedback & Next Steps (5 menit)
- Open floor untuk questions dan suggestions
- PO collects feedback untuk backlog refinement
- Preview: What's coming next sprint (tentative)

### Output
- Accepted stories officially Done
- Feedback captured (PO action items)
- Updated Product Backlog (new stories, re-prioritization)

---

### Sprint Review Best Practices

**For Demo:**
- **Prepare demo data:** Use realistic, production-like data (100 artworks, not 3)
- **Rehearse:** Quick run-through 30 menit before (catch issues)
- **Live demo:** Don't use slides/video unless live demo impossible
- **Show, don't tell:** Let stakeholders see dan interact
- **Celebrate wins:** Acknowledge team effort

**For PO:**
- **Be transparent:** Discuss what didn't get done dan why
- **Gather feedback:** Ask specific questions ("Is this filter useful?")
- **Resist scope creep:** Note suggestions, don't commit immediately

**For Stakeholders:**
- **Constructive feedback:** Specific suggestions, not vague complaints
- **Ask questions:** Understand rationale behind decisions
- **Respect timebox:** Long discussions → offline follow-up

---

### Handling Incomplete Work

**Scenario:** Story not fully done (AC not met)

**Process:**
1. **Don't demo incomplete work** (misleading)
2. **Explain why incomplete:** Blocker, underestimated, dependencies
3. **PO decision:**
   - **Option A:** Return to backlog (re-estimate, re-prioritize)
   - **Option B:** Continue next sprint (if near completion)
4. **Retrospective:** Discuss dalam retro why incomplete

**Story Status:**
- ❌ Don't mark as Done jika AC not met
- ✅ Partial credit: Break story, accept completed part (if independently valuable)

---

## 5. Sprint Retrospective

### Purpose
Inspect how last sprint went regarding people, relationships, process, dan tools; identify improvements.

### Time-box
**1.5 jam untuk 4-week sprint** (ArtConnect: 1 jam untuk 2-week sprint)

### Schedule
**Sprint Last Day (Friday), 10:15 - 11:15** (after Sprint Review)

### Participants
- **Required:** Development Team, SM
- **Optional:** PO (can attend if team agrees, or skip for more openness)

### Agenda (5 Phases)

#### Phase 1: Set the Stage (5 menit)
- **Goal:** Create safe environment untuk open discussion
- **Activities:**
  - SM welcomes team
  - Recap sprint: goal, major events
  - Remind: focus on process, not blame
  - Check-in: "One word to describe sprint?"

#### Phase 2: Gather Data (20 menit)
- **Goal:** Collect facts dan feelings about sprint
- **Method:** Silent brainstorming → grouping

**Prompts:**
1. **What went well?** (Things to keep doing)
   - Example: "Pair programming on Kanban was effective"
   - Example: "Firebase emulator sped up testing"

2. **What didn't go well?** (Things to stop or change)
   - Example: "PR reviews took too long (avg 2 days)"
   - Example: "Too many meetings mid-sprint"

3. **What should we try?** (New ideas)
   - Example: "Dedicated PR review time block each day"
   - Example: "Spike stories untuk technical unknowns"

**Process:**
- Each person writes sticky notes (5-10 menit silent)
- Share one by one, place on board
- Group similar themes

#### Phase 3: Generate Insights (20 menit)
- **Goal:** Understand root causes dan patterns

**Activities:**
- Discuss grouped themes
- Ask "5 Whys" untuk deep issues
  - Example:
    - Problem: "PRs take 2 days"
    - Why? "Reviewers busy dengan own work"
    - Why? "Over-committed dalam sprint"
    - Why? "Velocity estimate inaccurate"
    - Root: "Need better capacity planning"
- Identify systemic issues vs one-off problems
- Vote on top priorities (dot voting: each person 3 votes)

#### Phase 4: Decide What to Do (10 menit)
- **Goal:** Select 1-3 actionable improvements untuk next sprint

**SMART Actions:**
- **S**pecific: Clear what to do
- **M**easurable: Know when successful
- **A**chievable: Realistic untuk next sprint
- **R**elevant: Addresses root cause
- **T**ime-bound: Complete within sprint

**Example Good Actions:**
```
Issue: PR review delays
Action: Reserve 30 menit setiap hari (14:00-14:30) untuk PR reviews
Owner: Entire team (rotating daily "review guardian")
Success: Avg PR review time <24 hours
Measure: Track dalam GitHub metrics
```

**Example Bad Actions:**
```
❌ "Improve communication" (too vague)
❌ "Work harder" (not actionable)
❌ "Rewrite entire codebase" (not achievable)
```

#### Phase 5: Close Retrospective (5 menit)
- **Goal:** End on positive note, commit to actions

**Activities:**
- Recap action items (SM reads aloud)
- Assign owners (volunteer or rotate)
- Add actions ke next sprint backlog (track progress)
- Appreciate contributions: "Shout-outs" untuk team members
- SM thanks team untuk participation

### Output
- 1-3 retrospective action items (SMART)
- Owners assigned
- Action items added ke Sprint Backlog (tracked dalam daily stand-up)

---

### Retrospective Formats (Rotate for Variety)

#### Format 1: Start-Stop-Continue (Classic)
- **Start:** New practices untuk try
- **Stop:** Things dragging us down
- **Continue:** What's working well

#### Format 2: 4Ls
- **Liked:** What brought joy
- **Learned:** New insights atau skills
- **Lacked:** What was missing
- **Longed For:** What we wish we had

#### Format 3: Sailboat
- **Island (Goal):** Sprint goal, vision
- **Wind (Helpers):** Things propelling us forward
- **Anchor (Hindrances):** Things slowing us down
- **Rocks (Risks):** Potential dangers ahead

#### Format 4: Mad-Sad-Glad
- **Mad:** Frustrations (angry about)
- **Sad:** Disappointments (sad about)
- **Glad:** Celebrations (happy about)

#### Format 5: Timeline Retro
- Draw sprint timeline (Day 1 → Day 10)
- Mark significant events (green = good, red = bad)
- Discuss what happened, why, how to improve

---

### Retrospective Best Practices

**For SM (Facilitator):**
- **Neutral facilitator:** Don't dominate discussion
- **Encourage quieter members:** "Anyone who hasn't shared?"
- **Keep time:** Use timer, move things along
- **Action-oriented:** Don't leave retro without concrete actions
- **Follow up:** Track action items, remind dalam daily stand-up

**For Team:**
- **Be honest:** Safe space, no blame
- **Focus on process:** Not individual performance
- **Solutions-oriented:** Don't just complain, suggest improvements
- **Commit to actions:** Take ownership

**For PO (if present):**
- **Listen more than talk:** Team retro primarily
- **Receptive to feedback:** Product/process feedback valuable
- **Support actions:** Commit to enabling improvements

---

### Action Item Tracking

**During Sprint:**
- Action items visible di sprint board (separate swim lane)
- Update progress dalam daily stand-up
- SM monitors completion

**Next Retrospective:**
- Review previous actions: What completed? What worked?
- If action not completed: why? Still relevant?
- Don't carry incomplete actions forever (max 2 sprints)

---

### Retrospective Anti-Patterns

❌ **Same Problems Every Sprint**
- Symptom: Repeating issues, no improvement
- Fix: Actions not specific enough, need stronger commitment

❌ **No Actions Decided**
- Symptom: Good discussion, but "let's just try harder"
- Fix: SM pushes untuk concrete, SMART actions

❌ **Blame Game**
- Symptom: "It's X's fault...", personal attacks
- Fix: Reframe to process/tools, SM intervenes immediately

❌ **Canceled Retrospectives**
- Symptom: "Sprint was fine, skip retro"
- Fix: Always hold retro, continuous improvement even when good

---

## Ceremony Calendar Summary

### 2-Week Sprint Schedule

| Day | Time | Event | Duration | Participants |
|-----|------|-------|----------|-------------|
| **Sprint Day 1 (Mon)** | 09:00-12:00 | Sprint Planning | 3h | All |
| Every Day | 09:15-09:30 | Daily Stand-up | 15min | Developers + SM |
| **Mid-Sprint (Wed)** | 14:00-15:30 | Backlog Refinement | 1.5h | PO + SM + 3-4 Devs |
| **Sprint Day 10 (Fri)** | 09:00-10:00 | Sprint Review | 1h | All + Stakeholders |
| **Sprint Day 10 (Fri)** | 10:15-11:15 | Sprint Retrospective | 1h | Developers + SM (+ PO opt) |

**Total Ceremony Time per Sprint:** 
- Planning: 3h
- Stand-ups: 10 × 15min = 2.5h
- Refinement: 1.5h (or 3h if 2× per sprint)
- Review: 1h
- Retro: 1h
- **Total: ~9 - 10.5 hours** (11-13% dari 80-hour 2-week sprint)

---

## Remote Ceremony Adaptations

### Tools
- **Video:** Zoom, Google Meet, Microsoft Teams (camera ON untuk engagement)
- **Board:** Miro, Mural, or GitHub Projects (shared screen)
- **Timer:** Online timer visible to all (timeanddate.com)
- **Voting:** Miro voting, Mentimeter, or emoji reactions

### Best Practices
- **Stable internet:** Test connection before ceremony
- **Mute when not speaking:** Reduce background noise
- **Video on:** Increases engagement dan accountability
- **Screen share:** Board visible throughout
- **Breakout rooms:** For smaller group discussions (refinement, retro)

---

## Continuous Improvement

### Ceremony Effectiveness Review (Quarterly)

**Questions to Ask:**
- Are ceremonies achieving their purpose?
- Is time-box appropriate (too long/short)?
- Is attendance/engagement good?
- Are outputs actionable dan valuable?
- Should we adjust format atau frequency?

**Process:**
- Discuss dalam retrospective setiap 3-4 sprints
- Survey team anonymously
- Experiment dengan changes (try for 1-2 sprints)
- Inspect dan adapt based on results

---

## Conclusion

Sprint ceremonies adalah heartbeat dari Scrum. Konsistensi dan discipline dalam executing ceremonies memastikan team tetap aligned, blockers resolved quickly, dan continuous improvement happens. Treat ceremonies dengan respect - prepare, participate, dan follow through on actions.

**Referensi:**
- Scrum Guide: https://scrumguides.org/
- Retrospective Formats: https://retromat.org/
- Planning Poker: https://www.mountaingoatsoftware.com/agile/planning-poker
