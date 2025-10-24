# Git Workflow & Branch Strategy – ArtConnect

## Overview
Strategi branching dan workflow Git untuk proyek ArtConnect yang mendukung kolaborasi tim, continuous integration, dan deployment yang aman sesuai dengan kebutuhan pengembangan platform CRM seniman visual.

---

## Branch Model

### Protected Branches

#### 1. `main` (Production)
- **Purpose**: Branch produksi yang selalu stabil dan siap deploy
- **Protection Rules**:
  - Tidak boleh push langsung
  - Require PR review (minimal 1 approval)
  - Require status checks pass (build, test)
  - Require linear history (no merge commits)
- **Deploy Target**: Production environment (Vercel/Netlify)
- **Merge Strategy**: Squash and merge
- **Release**: Tagged dengan semantic versioning (v1.0.0)

#### 2. `develop` (Integration - Opsional)
- **Purpose**: Branch integrasi untuk sprint berjalan
- **Usage**: Opsional untuk tim >3 orang, skip jika tim kecil
- **Protection Rules**:
  - Require PR review
  - Require CI pass
- **Deploy Target**: Staging environment (opsional)
- **Note**: Untuk tim ArtConnect (5 orang), gunakan develop sebagai integration branch

### Working Branches

Semua working branch dibuat dari `develop` (atau `main` jika skip develop).

#### Feature Branches: `feature/<short-description>`
- **Purpose**: Pengembangan fitur baru dari backlog
- **Naming Convention**: 
  - `feature/auth-login` - Implementasi login Firebase
  - `feature/artwork-crud` - CRUD karya seni
  - `feature/contact-management` - Manajemen kontak profesional
  - `feature/kanban-pipeline` - Visualisasi pipeline Kanban
  - `feature/dashboard-analytics` - Dashboard analytics
- **Lifecycle**: Branch → Development → PR → Review → Merge → Delete
- **Link to SKPL**: Cantumkan ID SRS dalam commit/PR (contoh: `SRS-F-001`)

#### Fix Branches: `fix/<short-description>`
- **Purpose**: Perbaikan bug dari testing atau production
- **Naming Convention**:
  - `fix/upload-validation` - Perbaiki validasi upload gambar
  - `fix/kanban-drag-drop` - Fix bug drag & drop Kanban
  - `fix/search-performance` - Optimasi performa pencarian
- **Priority**: Tergantung severity (critical fix bisa langsung ke main)

#### Hotfix Branches: `hotfix/<version>`
- **Purpose**: Perbaikan urgent di production
- **Naming Convention**: `hotfix/v1.0.1`
- **Source**: Dibuat dari `main`
- **Target**: Merge ke `main` dan `develop`
- **Process**: Fast-track review, immediate deploy

#### Chore Branches: `chore/<short-description>`
- **Purpose**: Maintenance, refactoring, dependency updates
- **Naming Convention**:
  - `chore/update-deps` - Update dependencies
  - `chore/eslint-config` - Setup ESLint configuration
  - `chore/ci-pipeline` - CI/CD pipeline setup

#### Docs Branches: `docs/<short-description>`
- **Purpose**: Dokumentasi tanpa perubahan kode
- **Naming Convention**:
  - `docs/api-documentation` - Dokumentasi API
  - `docs/setup-guide` - Panduan setup development

---

## Commit Convention

### Format: Conventional Commits
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types
- **feat**: Fitur baru (SRS-F dari SKPL)
- **fix**: Bug fix
- **docs**: Perubahan dokumentasi
- **style**: Format kode (whitespace, semicolon)
- **refactor**: Refactoring tanpa perubahan fungsional
- **perf**: Performance improvement
- **test**: Menambah atau memperbaiki test
- **build**: Perubahan build system atau dependencies
- **ci**: Perubahan CI configuration
- **chore**: Maintenance task lainnya
- **revert**: Revert commit sebelumnya

### Scope Examples (Domain ArtConnect)
- **auth**: Otentikasi dan manajemen user
- **artwork**: Inventaris karya seni
- **contact**: Manajemen kontak profesional
- **activity**: Logging aktivitas dan interaksi
- **pipeline**: Visualisasi pipeline Kanban
- **analytics**: Dashboard dan reporting
- **ui**: Komponen UI reusable
- **api**: Integrasi Firebase services
- **store**: State management (Pinia)

### Subject Guidelines
- Gunakan imperative mood: "add feature" bukan "added feature"
- Lowercase, tanpa titik di akhir
- Maksimal 50 karakter
- Jelas dan deskriptif

### Body Guidelines (Opsional)
- Jelaskan "what" dan "why", bukan "how"
- Wrap di 72 karakter
- Reference issue/task ID jika ada

### Footer (Opsional)
- Breaking changes: `BREAKING CHANGE: <description>`
- Reference: `Refs: #123`, `Closes: #456`
- SKPL mapping: `SRS-F-007`

### Commit Examples

#### Feature Commit
```bash
feat(auth): implement Firebase email/password authentication

- Add Firebase Auth SDK integration
- Create login and register forms with validation
- Implement session management with token refresh
- Add protected route guards

Refs: SRS-F-001, SRS-F-002, SRS-F-003, SRS-F-004
```

#### Fix Commit
```bash
fix(artwork): resolve image upload size validation

Image validation was rejecting files under 10MB due to
incorrect byte calculation. Updated to proper size check.

Closes: #42
```

#### Chore Commit
```bash
chore(deps): update Firebase SDK to v9.23.0

Update to latest stable version for security patches
and performance improvements.
```

---

## Workflow Process

### 1. Starting New Work

```powershell
# Sync dengan branch utama
git checkout develop
git pull origin develop

# Buat branch baru
git checkout -b feature/artwork-upload

# Atau dari main jika tidak pakai develop
git checkout main
git pull origin main
git checkout -b feature/artwork-upload
```

### 2. During Development

```powershell
# Commit kecil dan sering
git add src/modules/artworks/
git commit -m "feat(artwork): add artwork upload form component"

# Push ke remote secara berkala
git push origin feature/artwork-upload

# Rebase jika develop/main sudah maju
git checkout develop
git pull origin develop
git checkout feature/artwork-upload
git rebase develop
```

### 3. Before Opening PR

```powershell
# Ensure tests pass
npm run test

# Ensure build works
npm run build

# Clean up commits (opsional, gunakan dengan hati-hati)
git rebase -i develop

# Final push
git push origin feature/artwork-upload --force-with-lease
```

### 4. Pull Request Process

1. **Buka PR** dari branch feature ke `develop` (atau `main`)
2. **Fill PR Template**:
   - Deskripsi perubahan
   - Link ke SKPL requirement (SRS-F-xxx)
   - Screenshot/video jika UI changes
   - Testing notes
   - Checklist DoD
3. **Request Review** dari minimal 1 team member
4. **Address Feedback** dan push changes
5. **Merge** setelah approval (Squash and Merge)
6. **Delete** branch setelah merge

### 5. After Merge

```powershell
# Kembali ke develop dan update
git checkout develop
git pull origin develop

# Hapus branch lokal
git branch -d feature/artwork-upload

# Hapus branch remote (otomatis jika setting GitHub)
git push origin --delete feature/artwork-upload
```

---

## Branch Naming Best Practices

### DO ✅
- `feature/artwork-crud` - Jelas dan deskriptif
- `fix/upload-size-validation` - Spesifik masalah
- `chore/vitest-setup` - Task yang jelas
- Gunakan kebab-case (lowercase dengan dash)
- Maksimal 3-4 kata
- Hindari singkatan yang tidak jelas

### DON'T ❌
- `feature/new-stuff` - Terlalu umum
- `fix-bug` - Tidak deskriptif
- `Feature/ArtworkUpload` - Mixed case
- `feature/implement-the-artwork-upload-feature-with-image-validation` - Terlalu panjang
- `temp`, `test`, `wip` - Tidak profesional

---

## Merge Strategy

### Squash and Merge (Recommended)
- **When**: Feature branches → develop/main
- **Benefit**: Clean linear history, one commit per feature
- **How**: GitHub/GitLab squash merge option
- **Commit Message**: Gunakan PR title sebagai commit message

### Rebase and Merge
- **When**: Hotfix atau small fixes
- **Benefit**: Preserve individual commits
- **Use Case**: Jika commit history penting untuk reference

### Merge Commit (Avoid)
- **When**: Sangat jarang, hanya untuk merge develop → main
- **Downside**: History menjadi kompleks dengan merge commits

---

## Conflict Resolution

### Prevention
- Pull/rebase frequently dari base branch
- Komunikasi jika working pada file yang sama
- Keep PR small (< 300 LOC)

### Resolution Process
```powershell
# Update base branch
git checkout develop
git pull origin develop

# Rebase feature branch
git checkout feature/artwork-upload
git rebase develop

# Jika ada conflict
# 1. Resolve conflicts di editor
# 2. Mark as resolved
git add <resolved-files>
git rebase --continue

# Push dengan force-with-lease
git push origin feature/artwork-upload --force-with-lease
```

---

## Code Review Guidelines

### Reviewer Checklist
- [ ] Kode mengikuti project conventions
- [ ] Logic clear dan mudah dipahami
- [ ] Tidak ada duplikasi unnecessary
- [ ] Tests ada dan passing
- [ ] No sensitive data (API keys, passwords)
- [ ] UI konsisten dengan design system (jika applicable)
- [ ] Performance consideration (untuk query/image handling)
- [ ] Accessibility (keyboard navigation, ARIA)
- [ ] Error handling proper
- [ ] Documentation/comments untuk logic kompleks

### Review Etiquette
- Be respectful dan constructive
- Ask questions untuk clarification
- Suggest alternatives dengan reasoning
- Approve jika minor changes bisa dilakukan post-merge
- Request changes jika ada issues yang harus fixed

---

## Git Aliases (Productivity)

Tambahkan ke `~/.gitconfig`:

```ini
[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --oneline --graph --decorate --all
    amend = commit --amend --no-edit
    force = push --force-with-lease
```

---

## Emergency Procedures

### Accidental Push to Protected Branch
1. Contact team immediately
2. Revert commit jika sudah merged: `git revert <commit-hash>`
3. Force push hanya dengan team agreement

### Lost Work
1. Check reflog: `git reflog`
2. Recover commit: `git checkout <commit-hash>`
3. Create branch: `git checkout -b recovered-work`

### Wrong Branch
```powershell
# Move uncommitted changes ke branch lain
git stash
git checkout correct-branch
git stash pop

# Move committed work
git checkout wrong-branch
git log # Copy commit hash
git checkout correct-branch
git cherry-pick <commit-hash>
```

---

## Repository Maintenance

### Regular Tasks
- Delete merged branches: Weekly
- Update dependencies: Monthly (chore branch)
- Review open PRs: Daily stand-up
- Clean up stale branches: Bi-weekly

### Branch Cleanup
```powershell
# List merged branches
git branch --merged

# Delete merged local branches
git branch -d <branch-name>

# Delete all merged branches except main/develop
git branch --merged | grep -v "\*" | grep -v "main" | grep -v "develop" | xargs -n 1 git branch -d
```

---

## Integration dengan SKPL

### Mapping Branch → Requirement
- Feature branches harus reference SRS-F ID dalam commit/PR
- Sprint planning: identifikasi requirement → create feature branches
- DoD: pastikan semua SRS criteria terpenuhi sebelum merge

### Example Mapping
- `feature/auth-login` → SRS-F-001, SRS-F-002, SRS-F-004
- `feature/artwork-crud` → SRS-F-007, SRS-F-008, SRS-F-009, SRS-F-010
- `feature/contact-management` → SRS-F-012, SRS-F-013, SRS-F-014
- `feature/kanban-pipeline` → SRS-F-018, SRS-F-019

---

## Referensi
- Conventional Commits: https://www.conventionalcommits.org/
- Git Best Practices: https://git-scm.com/book/en/v2
- GitHub Flow: https://guides.github.com/introduction/flow/
