# Deployment Guide - Issue 12 Fixes

## Critical: Firebase Configuration Required

The Women's Fashion Gallery images are returning **403 Forbidden** errors because Firebase Storage rules and Firestore indexes need to be deployed.

## Step 1: Deploy Firebase Storage Rules

The storage.rules file is correctly configured to allow public read access for gallery images, but it needs to be deployed:

```bash
# Deploy storage rules
npx firebase deploy --only storage

# Or deploy all Firebase rules at once
npx firebase deploy --only storage,firestore
```

**What this does:**
- Allows public read access to `women-fashion/*`, `men-fashion/*`, `kids-fashion/*`, and `products/*` paths
- Without this, all Firebase Storage URLs return 403 errors

**Verify it worked:**
1. Open: https://firebasestorage.googleapis.com/v0/b/apparel-online-store.firebasestorage.app/o/women-fashion%2F1.png?alt=media
2. You should see an image, not a 403 error

## Step 2: Deploy Firestore Indexes

The products query requires a composite index that needs to be deployed:

```bash
# Deploy Firestore indexes
npx firebase deploy --only firestore:indexes
```

**What this does:**
- Creates the required composite indexes for product queries (category + createdAt, category + price, etc.)
- Without this, category pages will throw index errors

**Alternative:** Click the link in the error message to create the index via Firebase Console

## Step 3: Verify Gallery Images Load

After deploying storage rules:

1. **Clear browser cache** or use Incognito mode
2. Navigate to: http://localhost:3000/en/category/women
3. Scroll to "Women's Fashion Gallery"
4. **Expected:** You should see 13 fashion images (not blank placeholders)

## Step 4: Test API Response

```bash
# Test the API directly
curl http://localhost:3000/api/gallery/women
```

Should return JSON with 13 items, each having an `imageUrl` pointing to Firebase Storage.

## Troubleshooting

### Images still show 403

1. **Verify storage rules are deployed:**
   ```bash
   npx firebase deploy --only storage
   ```

2. **Check Firebase Console:**
   - Go to: https://console.firebase.google.com/project/apparel-online-store/storage
   - Click on "Rules" tab
   - Verify the rules allow `read: if true` for women-fashion path

3. **Test a direct image URL:**
   Open in browser: https://firebasestorage.googleapis.com/v0/b/apparel-online-store.firebasestorage.app/o/women-fashion%2F1.png?alt=media
   - If this returns 403, storage rules aren't deployed
   - If this works, the issue is elsewhere

### Firestore index errors persist

1. **Deploy indexes:**
   ```bash
   npx firebase deploy --only firestore:indexes
   ```

2. **Or use the console link:** Click the URL in the error message to create the index manually

3. **Wait a few minutes:** Index creation can take time for large datasets

### Not-found page still crashes

The fix for `not-found.tsx` handles undefined params. Make sure to:
1. Restart the dev server
2. Clear Next.js build cache: `rm -rf .next`
3. Restart: `npm run dev`

## Summary of Changes

### Files Modified:
1. `app/[locale]/not-found.tsx` - Fixed undefined params error
2. `app/api/gallery/women/route.ts` - Already has fallback images (commit 03b8963)
3. `components/category/WomenFashionGallery.tsx` - Already has validation (commit bf6ff1f)

### Firebase Configuration Required:
1. Deploy `storage.rules` - **CRITICAL for gallery images**
2. Deploy `firestore.indexes.json` - **CRITICAL for product queries**

## Test Page Note

`public/test-gallery.html` returns 404 because Next.js App Router handles all routes. To test:
- Use http://localhost:3000/api/gallery/women directly
- Or check /en/category/women after deploying storage rules

The test page is not needed once storage rules are deployed.

## Quick Verification Checklist

- [ ] Deployed storage rules: `npx firebase deploy --only storage`
- [ ] Deployed Firestore indexes: `npx firebase deploy --only firestore:indexes`
- [ ] Restarted dev server
- [ ] Cleared browser cache
- [ ] Verified /en/category/women shows images
- [ ] Verified no 403 errors in browser Network tab
- [ ] Verified products pages load without index errors
