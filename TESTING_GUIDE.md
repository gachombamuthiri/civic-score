# CivicScore - Comprehensive Testing Guide for Presentation

**Presentation Date**: June 29, 2026  
**Test Environment**: https://civic-score-vercel-url (your Vercel deployment)  
**Last Updated**: June 16, 2026

---

## 🎯 Pre-Testing Checklist

- [ ] Test environment deployed and accessible
- [ ] Firestore database populated with test data
- [ ] Clerk authentication configured
- [ ] Admin ID set in `.env.local`: `NEXT_PUBLIC_ADMIN_CLERK_ID`
- [ ] All environment variables correct
- [ ] Browser console cleared of errors

---

## 📋 Test Flows (Manual Testing)

### FLOW 1: CITIZEN USER JOURNEY
**Goal**: Sign up → Select Citizen role → View dashboard → Enroll in event → Earn points → Check tier

#### Steps:
1. **Sign Up as New User**
   - [ ] Go to home page
   - [ ] Click "Sign Up"
   - [ ] Create account with email/password (or social login)
   - [ ] Complete Clerk onboarding
   - [ ] Should redirect to `/role-select`

2. **Select Citizen Role**
   - [ ] Page shows Citizen (🧑) and Organization (🏛️) options
   - [ ] Click "Citizen" card
   - [ ] "Selected" badge appears
   - [ ] Click "Continue as Citizen"
   - [ ] Loading message: "Setting up your account..."
   - [ ] Should redirect to `/dashboard` (NOT redirect loop)

3. **View Dashboard**
   - [ ] Dashboard loads without infinite redirects ✓
   - [ ] Shows: Points (0), Tier (Buffalo), Recent Activity, Rewards
   - [ ] Navigation bar visible with profile option
   - [ ] "Upcoming Events" section shows test events (if data exists)

4. **Browse & Enroll in Activity**
   - [ ] Click "Activities" or "Browse Activities"
   - [ ] See list of civic events
   - [ ] Click on an event to enroll
   - [ ] Enrollment modal/form appears
   - [ ] Enter: ID Number, Phone Number
   - [ ] Click "Enroll" button
   - [ ] Success message: "Successfully enrolled!"
   - [ ] Event appears in "Recent Activity"

5. **Check Points & Tier Update**
   - [ ] Go to Activities page
   - [ ] Find the event you enrolled in
   - [ ] (Only org can mark you as attended)
   - **Note**: For demo, admin can manually award points

6. **View Achievements**
   - [ ] On dashboard, achievements section should show unlocked badges
   - [ ] Check achievement logic works for current points

---

### FLOW 2: ORGANIZATION USER JOURNEY
**Goal**: Sign up → Select Org role → Create event → Enroll citizen → Mark attendance → Points awarded

#### Steps:
1. **Sign Up as Organization**
   - [ ] Go to home page, Sign Up
   - [ ] Create new account (different email from Citizen test)
   - [ ] Redirects to `/role-select`

2. **Select Organization Role**
   - [ ] Click "Organization" (🏛️) card
   - [ ] Selected badge appears
   - [ ] Click "Continue as Organization"
   - [ ] Should redirect to `/organization` (NOT redirect loop)

3. **Access Organization Portal**
   - [ ] Portal loads without errors ✓
   - [ ] Shows tabs: Events, Attendance, Analytics, Users, Settings
   - [ ] "Events" tab active by default
   - [ ] No Clerk Organization selector (uses Firestore role) ✓

4. **Create a Civic Event**
   - [ ] Click "Create Event" button
   - [ ] Modal opens with form
   - [ ] Fill in:
     - Title: "Community Cleanup Drive"
     - Description: "Join us cleaning up the park"
     - Category: Select (e.g., "Environmental")
     - Location: "Karura Forest"
     - Date: Pick future date
     - Points: 100
   - [ ] Click "Create"
   - [ ] Success message: "Event created successfully!"
   - [ ] Event appears in events list

5. **View Event Enrollments**
   - [ ] Event shows in list
   - [ ] Click on event
   - [ ] See enrollments from citizens
   - [ ] (Need citizen to have enrolled first)

6. **Mark Attendance & Award Points**
   - [ ] In Attendance tab (or Enrollments), see citizen list
   - [ ] Click "Mark Attended" for a citizen
   - [ ] Confirm success message
   - [ ] Check that citizen's points increased in admin panel

7. **View Analytics**
   - [ ] Analytics tab shows event metrics
   - [ ] Charts/stats for participation

---

### FLOW 3: ADMIN PANEL ACCESS & MANAGEMENT
**Goal**: Access admin panel → Verify organization → Manage user points → Award achievements

#### Steps:
1. **Access Admin Panel**
   - [ ] Direct URL: `/admin`
   - [ ] Should require authentication
   - [ ] If not admin ID, should redirect to `/dashboard`
   - [ ] Admin panel loads with tabs: Overview, Users, Organizations, Events, System

2. **Overview Tab**
   - [ ] Shows: Total Citizens, Verified Orgs, Active Events, Points Issued
   - [ ] Pending organization verification section
   - [ ] Flagged activities section

3. **Organizations Tab**
   - [ ] Lists all organizations
   - [ ] Shows: Name, Contact Email, Status (pending/verified/suspended)
   - [ ] Can click "Verify" to approve new organizations
   - [ ] Can click "Suspend" to suspend organizations

4. **Users Tab**
   - [ ] Lists all users
   - [ ] Shows: Name, Email, Role, Points, Tier
   - [ ] Search bar filters users
   - [ ] "Edit" button opens points modal
   - [ ] Can adjust points and see tier update

5. **Points Management**
   - [ ] Click "Edit" on a citizen user
   - [ ] Modal shows current points
   - [ ] Change points to test value (e.g., 1500)
   - [ ] Click "Update"
   - [ ] Check tier changed (1500 = Leopard Bronze)
   - [ ] System list shows updated total points

---

## 🧪 Edge Cases & Error Handling

### Authentication Issues
- [ ] **Unauthenticated access to `/dashboard`**: Should redirect to `/sign-in`
- [ ] **Expired session**: Should show sign-in prompt
- [ ] **Sign out**: Should clear session and redirect to home

### Role-Based Access
- [ ] **Citizen accessing `/organization`**: Should redirect to `/dashboard`
- [ ] **Organization accessing `/dashboard`**: Should redirect to `/organization`
- [ ] **Non-admin accessing `/admin`**: Should redirect to `/dashboard`

### Data Issues
- [ ] **Event with no enrollments**: Should show "No enrollments yet"
- [ ] **User with 0 points**: Should show "Buffalo" tier
- [ ] **Missing event image**: Should show default image
- [ ] **Activity with no description**: Should handle gracefully

### Network/Loading States
- [ ] **Slow network**: Loading spinners should show
- [ ] **Failed data fetch**: Error message should display
- [ ] **Timeout**: Should show appropriate error, not hang

---

## 📱 Mobile/Responsive Testing

Test on actual device or Chrome DevTools (F12 → Device Toggle)

- [ ] **Mobile (375px)**: Layout responsive, text readable
- [ ] **Tablet (768px)**: Grids adjust, navigation works
- [ ] **Touch interactions**: Buttons clickable, forms fillable
- [ ] **Navigation**: Mobile menu works (if implemented)
- [ ] **Forms**: Input fields properly sized for mobile

---

## 🔍 Visual/UX Checks

- [ ] **Logo & Branding**: CivicScore logo visible on key pages
- [ ] **Color Scheme**: Consistent with green theme (#087B90, #064e3b)
- [ ] **Tier Badges**: All 5 tiers display correctly (Buffalo, Rhino, Leopard Bronze, Lion Silver, Elephant Gold)
- [ ] **Typography**: Headings, body text readable
- [ ] **Spacing**: Padding/margin consistent
- [ ] **Loading states**: Spinners show during data fetch
- [ ] **Success/Error messages**: Clear and visible

---

## ✅ Testing Checklist - All Flows

| Feature | Citizen | Org | Admin | Status |
|---------|---------|-----|-------|--------|
| Sign Up | ✓ | ✓ | N/A | |
| Role Select | ✓ | ✓ | N/A | |
| Dashboard Load | ✓ | ✗ | ✗ | |
| Org Portal Load | ✗ | ✓ | ✗ | |
| Admin Panel Access | ✗ | ✗ | ✓ | |
| Browse Events | ✓ | ✓ | N/A | |
| Create Event | ✗ | ✓ | N/A | |
| Enroll in Event | ✓ | ✗ | N/A | |
| Mark Attendance | ✗ | ✓ | N/A | |
| Award Points | ✗ | ✗ | ✓ | |
| View Points | ✓ | ✓ | ✓ | |
| Tier Display | ✓ | ✓ | ✓ | |
| Achievements | ✓ | ✓ | ✓ | |

---

## 🐛 Known Issues & Workarounds

| Issue | Workaround | Status |
|-------|-----------|--------|
| Firestore security rules permissive | Use backend validation in production | KNOWN |
| Image upload not implemented | Use default/predefined images | KNOWN |
| Real-time updates don't sync | Refresh page to see updates | KNOWN |

---

## 📊 Demo Data Setup

To prepare for presentation demo, create test data:

### Test Citizen Account
- Email: `citizen@demo.com`
- Password: `Demo123!`
- Role: Citizen
- Points: 250
- Tier: Rhino

### Test Organization Account
- Email: `org@demo.com`
- Password: `Demo123!`
- Role: Organization
- Events: 2-3 sample events (Environmental, Health, Community)

### Test Events
- Event 1: "Beach Cleanup" - 50 points
- Event 2: "Blood Donation Drive" - 100 points
- Event 3: "Tree Planting" - 75 points

### Admin Account
- Set `NEXT_PUBLIC_ADMIN_CLERK_ID` to your Clerk ID
- Access `/admin` with this account

---

## 🎬 Demo Script (5-minute walkthrough)

**Opening**: "This is CivicScore, a platform that rewards citizen engagement."

1. **(1 min)** Show home page, explain Big Five tier system
2. **(1 min)** Sign in as Citizen → Dashboard → Show points, tier, achievements
3. **(1 min)** Browse activities → Enroll in event → Show recent activity update
4. **(1 min)** Switch to Organization account → Create event → Show dashboard
5. **(1 min)** Show admin panel → Verify org → Adjust points, tier update

**Closing**: "CivicScore gamifies civic engagement, motivating participation through rewards and recognition."

---

## 🚀 Pre-Presentation Deployment Checklist

- [ ] Latest code pushed to GitHub
- [ ] Vercel auto-deploys latest commit
- [ ] All env variables set in Vercel dashboard
- [ ] Firestore rules deployed (simplified version)
- [ ] Test data created in Firestore
- [ ] Admin ID configured
- [ ] All redirect loops fixed
- [ ] Build passes locally: `npm run build`
- [ ] Tests pass: `npm test`
- [ ] No console errors in browser
- [ ] App responsive on mobile
- [ ] All features work as documented

---

## 📞 Support During Testing

If you encounter issues:

1. **Check browser console** (F12) for error messages
2. **Clear Clerk session** (Sign out, clear cache, sign in again)
3. **Check Firestore** if data is present
4. **Verify env variables** are correct
5. **Restart dev server** if testing locally

---

**Good luck with your presentation! 🇰🇪**
