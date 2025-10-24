# Development Checklist – ArtConnect

## Overview

Checklist harian untuk developers ArtConnect yang memastikan consistency, quality, dan adherence to best practices dari mulai pick task hingga merge PR.

---

## Pre-Development Checklist

### Before Starting New Task

- [ ] **Sync with main/develop branch**
  ```powershell
  git checkout develop
  git pull origin develop
  ```

- [ ] **Verify DoR met** untuk story/task
  - Acceptance criteria jelas dan testable
  - Design/mockup available (jika UI task)
  - Estimated dan prioritized
  - No unresolved dependencies

- [ ] **Review related SKPL requirements**
  - Identify SRS-F-xxx atau SRS-NF-xxx
  - Understand acceptance criteria alignment

- [ ] **Check current sprint capacity**
  - Tidak over-committed (respect WIP limit)
  - Task fits dalam remaining sprint time

- [ ] **Create feature branch**
  ```powershell
  git checkout -b feature/artwork-upload
  ```

---

## During Development Checklist

### Code Implementation

- [ ] **Follow project structure** (lihat `PROJECT_STRUCTURE.md`)
  - Place files di correct module/folder
  - Use path alias `@` untuk imports
  - Consistent naming conventions

- [ ] **Write clean, readable code**
  - Descriptive variable/function names
  - Single Responsibility Principle
  - Functions <50 lines ideal
  - Extract constants (no magic numbers/strings)

- [ ] **Add inline comments** untuk complex logic
  - "Why" not "what"
  - Document edge cases
  - Note TODOs dengan issue reference

- [ ] **Implement error handling**
  - Try-catch untuk async operations
  - User-friendly error messages
  - Log errors untuk debugging (development only)
  - Graceful degradation

- [ ] **Follow Vue best practices**
  - Composition API (not Options API)
  - Proper reactivity (ref, reactive, computed)
  - Emit events dengan descriptive names
  - Props validation dengan types

- [ ] **Firebase integration best practices**
  - Use environment variables (`.env.local`)
  - Error handling untuk network failures
  - Loading states untuk async operations
  - Firestore query optimization (indexes, limits)

### Testing

- [ ] **Write unit tests** (Vitest)
  - Test utils/helpers/services
  - Minimal: 1 happy path + 1 edge case
  - Mock Firebase SDK (no real API calls)
  - Test file: `*.spec.js` dalam `tests/` folder

- [ ] **Write component tests** (Vue Test Utils)
  - Test component rendering
  - Test user interactions (clicks, inputs)
  - Test props dan emits
  - Use `data-test` attributes untuk selectors

- [ ] **Run tests locally**
  ```powershell
  npm run test
  ```
  - All tests passing ✅
  - No skipped tests (unless justified)
  - Coverage tidak menurun significantly

- [ ] **Manual testing**
  - Test happy path dalam dev environment
  - Test edge cases (empty states, errors)
  - Test responsive (desktop, tablet, mobile)
  - Cross-browser check (Chrome, Firefox)

### Commits

- [ ] **Stage changes logically**
  ```powershell
  git add src/modules/artworks/
  ```

- [ ] **Write conventional commit messages**
  - Format: `type(scope): subject`
  - Example: `feat(artwork): add upload form validation`
  - Reference SKPL: `SRS-F-007`

- [ ] **Commit frequently** (small, atomic commits)
  - One logical change per commit
  - Easier to review dan revert jika needed

### Code Quality

- [ ] **No console.log/debugger** statements left
- [ ] **No commented-out code** blocks
- [ ] **No unused imports** atau variables
- [ ] **No hardcoded values** (use constants/env vars)
- [ ] **No sensitive data** (API keys, passwords)

---

## Pre-PR Checklist

### Local Verification

- [ ] **Rebase with latest develop**
  ```powershell
  git fetch origin
  git rebase origin/develop
  ```
  - Resolve conflicts jika ada
  - Test lagi setelah rebase

- [ ] **Run full test suite**
  ```powershell
  npm run test
  ```
  - All tests passing
  - No new test failures

- [ ] **Build production**
  ```powershell
  npm run build
  ```
  - Build succeeds tanpa errors
  - No critical warnings

- [ ] **Lint check** (jika configured)
  ```powershell
  npm run lint
  ```
  - No lint errors
  - Auto-fix warnings jika possible

### Self-Review

- [ ] **Review your own code**
  - Read through diffs line-by-line
  - Check untuk typos, inconsistencies
  - Ensure naming is clear
  - Remove debug code

- [ ] **Verify acceptance criteria met**
  - All ACs dari story completed
  - Edge cases handled
  - No partial implementation

- [ ] **Check file changes scope**
  - Only changed files relevant ke task
  - No accidental changes (formatting, unrelated files)
  - PR size reasonable (<300 LOC ideal)

---

## Opening PR Checklist

### PR Preparation

- [ ] **Push branch to remote**
  ```powershell
  git push origin feature/artwork-upload
  ```

- [ ] **Open Pull Request** (GitHub/GitLab)
  - Target branch: `develop` (or `main`)
  - Source branch: your feature branch

### PR Description

- [ ] **Write clear PR title**
  - Follow conventional commit format
  - Example: `feat(artwork): implement upload with metadata`

- [ ] **Complete PR description template**
  ```markdown
  ## Description
  Implements artwork upload functionality dengan metadata form.
  
  ## Changes
  - Add ArtworkUploadForm component
  - Integrate Firebase Storage untuk image upload
  - Generate 4 thumbnail sizes (150, 400, 800, original)
  - Add form validation (file type, size, required fields)
  - Implement progress indicator untuk large uploads
  
  ## SKPL Reference
  - SRS-F-007: Add new artwork
  - SRS-F-011: Upload artwork image
  
  ## Testing
  - [x] Unit tests untuk validation logic
  - [x] Component tests untuk form interactions
  - [x] Manual testing: upload 5MB JPEG success
  - [x] Manual testing: reject 15MB file (size validation)
  - [x] Cross-browser: Chrome, Firefox (desktop)
  
  ## Screenshots
  [Attach screenshots of UI changes]
  
  ## Checklist
  - [x] Tests passing
  - [x] Build succeeds
  - [x] Self-reviewed
  - [x] Documentation updated (if needed)
  - [x] No console.log/debugger left
  ```

- [ ] **Add labels/tags**
  - Type: `feature`, `bug`, `docs`, etc.
  - Priority: `high`, `medium`, `low`
  - SKPL reference dalam description

- [ ] **Link related issues**
  - Reference story ID dari sprint board
  - Use keywords: `Closes #42`, `Refs #43`

- [ ] **Request reviewers**
  - Tag specific team members (1-2 reviewers)
  - Rotate reviewers untuk knowledge sharing

### PR Quality Checks

- [ ] **CI/CD checks passing** (jika configured)
  - Build status: ✅
  - Test status: ✅
  - Coverage status: ✅ (or acceptable decrease dengan reason)

- [ ] **PR size reasonable**
  - <300 LOC ideal (easier to review)
  - If >500 LOC, consider splitting

---

## During Code Review Checklist

### Responding to Feedback

- [ ] **Read feedback carefully**
  - Understand reviewer's concern
  - Ask clarifying questions jika unclear

- [ ] **Address all comments**
  - Make requested changes or
  - Explain reasoning jika disagree (politely)
  - Mark conversations as resolved setelah addressed

- [ ] **Push updates**
  ```powershell
  git add <changed-files>
  git commit -m "fix: address review feedback - improve validation"
  git push origin feature/artwork-upload
  ```

- [ ] **Re-request review** setelah significant changes
  - Comment: "Ready for re-review @reviewer"
  - Summarize changes made

### Handling Requested Changes

- [ ] **Prioritize critical feedback** first
  - Security issues
  - Logic errors
  - Breaking changes

- [ ] **Refactor jika needed**
  - Don't defend bad code
  - Embrace improvements
  - Learn from feedback

- [ ] **Run tests lagi** after changes
  - Ensure fixes didn't break anything
  - Add tests jika reviewer identified gap

---

## Pre-Merge Checklist

### Final Verification

- [ ] **All review comments resolved**
  - No pending "Request Changes"
  - At least 1 "Approval" from reviewer

- [ ] **CI/CD checks passing** (final)
  - Re-run jika stale (after recent pushes)

- [ ] **Rebase dengan latest develop** (if needed)
  ```powershell
  git fetch origin
  git rebase origin/develop
  git push origin feature/artwork-upload --force-with-lease
  ```

- [ ] **Squash commits** (opsional, jika banyak WIP commits)
  - Via GitHub "Squash and Merge"
  - Or locally: `git rebase -i develop`

### Merge Strategy

- [ ] **Use "Squash and Merge"** (recommended)
  - Clean commit history
  - One commit per feature

- [ ] **Write good merge commit message**
  - Descriptive title
  - Include SKPL reference
  - Example: `feat(artwork): implement upload with metadata (SRS-F-007, F-011)`

- [ ] **Delete branch** after merge
  - Automatic via GitHub setting, or
  - Manual: `git push origin --delete feature/artwork-upload`

---

## Post-Merge Checklist

### Immediate After Merge

- [ ] **Verify CI/CD pipeline** untuk develop/main
  - Build passing ✅
  - Tests passing ✅
  - Deployment successful (jika auto-deploy)

- [ ] **Monitor error tracking** (first 1 jam)
  - Check Firebase Console untuk errors
  - Check Sentry/LogRocket jika configured
  - Watch for regressions

- [ ] **Update sprint board**
  - Move story ke "Testing" or "Done"
  - Add comment: PR merged, ready for QA

### Local Cleanup

- [ ] **Switch to develop dan pull**
  ```powershell
  git checkout develop
  git pull origin develop
  ```

- [ ] **Delete local feature branch**
  ```powershell
  git branch -d feature/artwork-upload
  ```

- [ ] **Start next task** (if capacity available)

---

## Daily Routine Checklist

### Morning (Before Stand-up)

- [ ] **Pull latest changes**
  ```powershell
  git checkout develop
  git pull origin develop
  ```

- [ ] **Update sprint board**
  - Move cards to reflect current status
  - Update task checkboxes
  - Add comments untuk progress/blockers

- [ ] **Review assigned PRs** (if any)
  - Prioritize PR reviews
  - Provide feedback within 24 hours

- [ ] **Prepare stand-up update**
  - What completed yesterday?
  - What working on today?
  - Any blockers?

### During Development

- [ ] **Commit frequently** (every 1-2 hours)
- [ ] **Push to remote** (end of day minimum)
- [ ] **Update board** real-time (move cards)
- [ ] **Communicate blockers** immediately (don't wait for stand-up)

### End of Day

- [ ] **Push all commits**
  ```powershell
  git push origin feature/artwork-upload
  ```

- [ ] **Update sprint board** (final status)
- [ ] **Add notes** untuk tomorrow's work
- [ ] **Review tomorrow's priorities** (plan next steps)

---

## Weekly Routine Checklist

### Monday (Sprint Start)

- [ ] **Attend Sprint Planning** (3 hours)
- [ ] **Review sprint goal** dan committed stories
- [ ] **Pick first task** (self-assign)
- [ ] **Setup workspace** (branch, tools, mockups)

### Wednesday (Mid-Sprint)

- [ ] **Attend Backlog Refinement** (1.5 hours)
- [ ] **Review sprint progress** (burndown chart)
- [ ] **Help teammates** jika any blockers
- [ ] **Complete at least 50%** of committed work

### Friday (Sprint End)

- [ ] **Complete all tasks** atau communicate risks early
- [ ] **Prepare demo** untuk Sprint Review
  - Working demo dalam staging
  - Screenshots/video jika needed
  - Test demo flow (no surprises)
- [ ] **Attend Sprint Review** (1 hour) - demo work
- [ ] **Attend Retrospective** (1 hour) - provide feedback
- [ ] **Celebrate wins** 🎉

---

## Quality Gates Summary

### Before Commit
✅ Code compiles  
✅ Tests written  
✅ Tests passing locally  
✅ No console.log/debugger  

### Before Push
✅ Rebased dengan develop  
✅ Commit messages follow convention  
✅ No merge conflicts  

### Before Opening PR
✅ Self-reviewed  
✅ Build succeeds  
✅ Tests passing  
✅ AC met  

### Before Merge
✅ Approved by reviewer  
✅ CI checks passing  
✅ No unresolved comments  
✅ Rebased dengan latest develop  

---

## Common Pitfalls to Avoid

❌ **Starting work without reading requirements**  
✅ Review story, AC, design sebelum coding

❌ **Committing untested code**  
✅ Write tests first atau alongside implementation

❌ **Large PRs (>500 LOC)**  
✅ Break into smaller, reviewable chunks

❌ **Ignoring reviewer feedback**  
✅ Address all comments atau discuss concerns

❌ **Merging failing CI**  
✅ Fix issues before merge, no exceptions

❌ **Leaving TODO comments tanpa follow-up**  
✅ Create issue untuk TODOs atau complete immediately

❌ **Not updating sprint board**  
✅ Real-time updates, visible progress

❌ **Working in isolation (no communication)**  
✅ Daily stand-up, ask for help, pair when stuck

---

## Emergency Procedures

### Production Bug Found

1. **Assess severity**
   - Critical: Drop current work
   - High: Finish current task, then address
   - Medium/Low: Add to backlog

2. **Create hotfix branch** (if critical)
   ```powershell
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-bug-fix
   ```

3. **Fix, test, PR, merge quickly**
   - Minimal fix, targeted
   - Fast-track review
   - Deploy immediately

4. **Backport to develop**
   ```powershell
   git checkout develop
   git cherry-pick <hotfix-commit>
   ```

### Accidentally Committed Sensitive Data

1. **Don't push** jika not pushed yet
   ```powershell
   git reset HEAD~1 # Undo last commit
   ```

2. **If already pushed:**
   - Contact team immediately
   - Rotate credentials (API keys, passwords)
   - Force push corrected history (careful!)
   - Use BFG Repo-Cleaner untuk history cleanup

3. **Prevention:**
   - Use `.env.local` (gitignored)
   - Never commit `.env` files
   - Use pre-commit hooks (check for secrets)

---

## Tools & Extensions

### VS Code Extensions

- **ESLint** - Linting untuk code quality
- **Prettier** - Code formatting
- **Volar** - Vue 3 language support
- **GitLens** - Git supercharged
- **Todo Tree** - Highlight TODO comments
- **Error Lens** - Inline error display

### Productivity Tips

- **Code Snippets:** Create snippets untuk common patterns
- **Keyboard Shortcuts:** Learn shortcuts untuk speed
- **Split Editor:** View component + test side-by-side
- **Integrated Terminal:** Run commands tanpa leaving editor

---

## Continuous Learning

### Weekly Learning Goals

- [ ] Read 1 Vue best practice article
- [ ] Review 1 teammate's PR untuk learn different approach
- [ ] Refactor 1 old component (technical debt)
- [ ] Try 1 new Vitest feature atau testing pattern

### Knowledge Sharing

- [ ] Document gotchas dalam code comments
- [ ] Update README jika setup changes
- [ ] Share tips dalam retrospective
- [ ] Pair program with junior developers

---

## Checklist Compliance

**Self-Assessment (Weekly):**
- Berapa PR merged this week? __/__
- Average PR review time? __ hours
- Test coverage maintained? ✅/❌
- Zero critical bugs introduced? ✅/❌
- All DoD criteria met? ✅/❌

**Team Review (Monthly):**
- Discuss checklist effectiveness dalam retro
- Update checklist based on learnings
- Add new items jika gaps identified
- Remove items jika not adding value

---

## Quick Reference Card (Print-Friendly)

```
┌─────────────────────────────────────────────────────┐
│  ArtConnect Development Checklist (Daily)           │
├─────────────────────────────────────────────────────┤
│ BEFORE STARTING:                                    │
│ ☐ Sync develop     ☐ Read requirements             │
│ ☐ Create branch    ☐ Review design                 │
│                                                     │
│ DURING DEVELOPMENT:                                 │
│ ☐ Clean code       ☐ Error handling                │
│ ☐ Write tests      ☐ Run tests locally             │
│ ☐ Commit often     ☐ Conventional commits          │
│                                                     │
│ BEFORE PR:                                          │
│ ☐ Rebase develop   ☐ Tests passing                 │
│ ☐ Build succeeds   ☐ Self-review                   │
│ ☐ AC met           ☐ No debug code                 │
│                                                     │
│ OPEN PR:                                            │
│ ☐ Clear title      ☐ Complete description          │
│ ☐ Screenshots      ☐ Request reviewers             │
│                                                     │
│ AFTER MERGE:                                        │
│ ☐ CI passing       ☐ Update board                  │
│ ☐ Delete branch    ☐ Monitor errors                │
└─────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** Development Team  
**Review:** Update as processes evolve
