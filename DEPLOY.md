# GitHub Pages Deployment Guide

The HMI site at `https://teslasolar.github.io/hmi/` is showing 403 errors because GitHub Pages needs to be enabled.

## Enable GitHub Pages

### Option 1: Via GitHub Web UI (Recommended)

1. Go to https://github.com/teslasolar/hmi/settings/pages
2. Under "Source", select:
   - Branch: `claude/github-setup-01NUiCmJ7ZVRUeAUc5FcLHKg`
   - Folder: `/ (root)`
3. Click "Save"
4. Wait 1-2 minutes for deployment
5. Visit: https://teslasolar.github.io/hmi/

### Option 2: Create gh-pages Branch

```bash
# Create and push gh-pages branch from current work
git checkout -b gh-pages
git push -u origin gh-pages

# GitHub will auto-publish gh-pages branch
```

Then visit: https://teslasolar.github.io/hmi/

### Option 3: Merge to Main and Publish

```bash
# Merge feature branch to main
git checkout main
git merge claude/github-setup-01NUiCmJ7ZVRUeAUc5FcLHKg
git push origin main
```

Then enable Pages from `main` branch in settings.

## Verify Deployment

After enabling Pages, check:
1. https://github.com/teslasolar/hmi/deployments
2. Should see "github-pages" deployment
3. Site will be live at https://teslasolar.github.io/hmi/

## Test Locally While Waiting

The local server is still running:
```bash
http://localhost:8888/index.html
```

This is the exact same code that will be deployed!

## Current Status

- Code: ✅ Ready and pushed
- Branch: `claude/github-setup-01NUiCmJ7ZVRUeAUc5FcLHKg`
- Pages: ❌ Not enabled yet (403 error)

Once you enable GitHub Pages in the repository settings, the site will work immediately.
