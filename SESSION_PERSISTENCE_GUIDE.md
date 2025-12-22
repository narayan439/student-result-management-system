# Session Persistence Guide - Student Panel

## Problem: Automatic Logout After Refresh

The student panel is logging out users when they refresh the page.

## Root Causes Addressed

1. **App Initialization** - AppComponent now checks for existing sessions on startup
2. **Component Logging** - Enhanced logging in StudentDashboard and ViewMarks components
3. **Error Handling** - Better try-catch blocks to catch initialization errors
4. **Session Storage** - Auth service now properly saves/retrieves sessions from localStorage

## How to Debug

### Step 1: Check Browser Console
Open DevTools (F12) and go to **Console** tab:

```
✓ Session restored for: student@example.com
📖 ViewMarks: Loading student marks...
🔑 Current user: {email: "student@example.com", role: "STUDENT", loginTime: "..."}
📚 Students loaded: 25
✓ Student found: {name: "John Doe", class: "Class 5"}
```

### Step 2: Check localStorage
In Console, run:
```javascript
// Should show user data
console.log(JSON.parse(localStorage.getItem('currentUser')))

// Output should be:
// {email: "student@example.com", role: "STUDENT", loginTime: "2025-12-21T..."}
```

### Step 3: Session Flow on Refresh

1. User logs in → `currentUser` saved to localStorage
2. Page refreshes → AppComponent `ngOnInit()` runs
3. AppComponent checks for `currentUser` in localStorage
4. If found → Session is restored, user stays on current page
5. StudentDashboard loads and verifies current user
6. ViewMarks loads student marks from backend

### Step 4: If Still Logging Out

Check console for error messages:

- **❌ No current user found** - localStorage is being cleared
  - Check if something else is clearing localStorage
  - Check browser privacy settings

- **❌ User is not a STUDENT** - User role changed
  - Verify role saved correctly during login
  - Check auth service `saveUserSession()` method

- **❌ Student not found for email** - Email mismatch
  - Verify student email in database
  - Check case sensitivity (student@example.com vs Student@Example.com)

- **❌ Error loading students** - Student service error
  - Check if StudentService is initializing properly
  - Verify backend API endpoint

## Key Log Messages to Look For

| Message | Meaning |
|---------|---------|
| ✓ Session restored | Session found and being used |
| ℹ No active session found | User not logged in (normal on first visit) |
| ✓ Session saved | User logged in successfully |
| 🔍 StudentDashboard: Checking current user | Component initializing |
| 📚 Students loaded: X | Students fetched from backend |
| ✓ Student found | Current user matched to student record |
| ❌ No current user found | **CRITICAL** - localStorage empty |
| ❌ User is not a STUDENT | **CRITICAL** - Wrong role |

## Common Solutions

### Solution 1: Clear Browser Cache
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Or clear cache manually in DevTools → Application → Storage → Clear site data

### Solution 2: Check Network Tab
1. Open DevTools → Network tab
2. Refresh page
3. Look for failed requests (red status codes)
4. Check if `/api/students` or `/api/marks` endpoints are failing

### Solution 3: Verify Backend Connection
1. Check if backend is running on `http://localhost:8080`
2. Verify database has student data
3. Check student email matches login email (case-sensitive)

### Solution 4: Check localStorage Limits
If localStorage is being cleared:
```javascript
// Check available space
console.log(localStorage.length)

// Clear and retry (last resort)
localStorage.clear()
// Then login again
```

## Expected Behavior After Fix

1. **Login** → User credentials verified, session saved
2. **Refresh** → Session restored automatically, user stays logged in
3. **Navigate** → All student data loads correctly
4. **Add Marks** → New marks appear immediately (no logout)
5. **Logout** → Session cleared, user redirected to home

## Files Modified

- `src/app/app.component.ts` - Session restoration on app startup
- `src/app/core/services/auth.service.ts` - Enhanced session management
- `src/app/modules/student/student-dashboard.component.ts` - Better logging
- `src/app/modules/student/view-marks/view-marks.component.ts` - Enhanced error handling

## Testing Checklist

- [ ] Login as student
- [ ] Verify console shows "✓ Session restored"
- [ ] Refresh page
- [ ] Should stay logged in
- [ ] Check localStorage has `currentUser`
- [ ] Verify student name/class displays
- [ ] Verify marks load (if added by teacher)
- [ ] Click links and navigate
- [ ] Refresh on different pages
- [ ] Logout and verify session cleared
