# Flight Search Engine - Complete Testing Guide

## ✅ Build Status

**Last Build:** SUCCESS (2.49s)
**TypeScript Errors:** 0
**Bundle Size:** 1.13 MB (340 KB gzipped)
**Environment:** Amadeus API credentials configured

---

## 🚀 Starting the Application

```bash
cd "/Users/bruis30/Desktop/spotter assessment/flight-search-engine"
npm run dev
```

The app will start at `http://localhost:5173/` (or next available port)

**Current Status:** Server is running at `http://localhost:5174/`

---

## 📋 Complete User Flow Test

### Step 1: Homepage Load
✅ **URL:** `http://localhost:5174/`

**Expected Behavior:**
- Header with logo and navigation
- Hero section: "Find your next adventure"
- Search form with all fields visible
- Popular destinations section (4 cards)
- Trust badges section (desktop only)
- Smooth fade-in animation

**Desktop Layout:**
- Search form centered, max-width 1152px
- 4-column destination grid
- Trust badges at bottom

**Mobile Layout (< 768px):**
- Hero text: "Find your next" with "adventure" in blue
- Smaller subtitle
- Horizontal scrolling destinations
- No trust badges

### Step 2: Airport Search
✅ **Test Origin Field**

1. Click on "From" field
2. Type "new" (wait 300ms for debounce)
3. See loading spinner appear briefly
4. Dropdown shows New York airports:
   - JFK - John F. Kennedy International
   - LGA - LaGuardia Airport
   - EWR - Newark Liberty International

**Fallback Test:**
- If API fails, still see results from hardcoded list
- Check console for warning: "Airport search API error: ..."

✅ **Test Destination Field**

1. Click on "To" field
2. Type "lon"
3. Dropdown shows London airports:
   - LHR - Heathrow
   - LGW - Gatwick
   - LCY - City Airport
   - STN - Stansted
   - LTN - Luton

### Step 3: Date Selection
✅ **Departure Date**

1. Click departure date field
2. Calendar picker opens
3. Select a future date (e.g., 7 days from now)
4. Date displays in field

✅ **Return Date** (Round-trip only)

1. Return date field enabled after departure selected
2. Click return date
3. Calendar opens with departure date as minimum
4. Select date after departure
5. Date displays in field

### Step 4: Additional Options
✅ **Trip Type Toggle**

- One-way / Round-trip / Multi-city options
- Changes form layout accordingly

✅ **Passengers**

- Click passengers button
- Dropdown shows passenger count options
- Select number (1-9)

✅ **Cabin Class**

- Click cabin class button
- Dropdown shows: Economy, Premium Economy, Business, First
- Select class

### Step 5: Search Submission
✅ **Click "Search" or "Search Flights" Button**

**Expected Navigation:**
```
http://localhost:5174/search?origin=JFK&destination=LHR&departureDate=2024-12-20&returnDate=2024-12-27&passengers=1&cabinClass=Economy&tripType=round-trip
```

**Loading State:**
- URL changes immediately
- Loading skeletons show (3 skeleton cards)
- Price chart shows loading placeholder
- Filter sidebar visible (desktop) or FAB visible (mobile)

### Step 6: Results Display
✅ **After API Response** (3-5 seconds)

**Header Section:**
- Shows "X flights found" count
- Sort tabs: Cheapest / Fastest / Best

**Price Trend Chart:**
- Desktop: Full card with price graph
- Mobile: Collapsible accordion
- Shows lowest price highlighted
- Date range labels
- "View Full Calendar" button (desktop)

**Flight Cards:**
- Shows 10 flights initially
- Each card displays:
  - Airline logo + name
  - Flight number
  - Departure/arrival times and airports
  - Duration and stops
  - Timeline visualization
  - Price
  - "Select" button
- First result may have "BEST VALUE" badge (green)

**"Show more flights" Button:**
- Appears if > 10 results
- Loads 10 more on click
- Updates count

### Step 7: Desktop Filter Testing
✅ **Filter Sidebar (Desktop only, left side)**

**Stops Filter:**
1. Check "Direct"
   - Only non-stop flights show
   - Flight count updates
   - Chart updates
   - Active filter badge shows "1"
2. Check "1 Stop"
   - Direct + 1-stop flights show
   - Count updates instantly
3. Check "2+ Stops"
   - All flights show (all 3 checked)
4. Uncheck all
   - All flights show (default behavior)

**Price Range Slider:**
1. Drag left handle (min price)
   - Flights below that price disappear
   - Chart updates
   - Count updates
2. Drag right handle (max price)
   - Flights above that price disappear
   - Both updates instantly
3. Reset: Drag handles back to extremes

**Departure Time Filter:**
1. Click "Morning" (06:00-12:00)
   - Only morning flights show
   - Count updates
2. Click "Afternoon" (12:00-18:00)
   - Morning + afternoon flights show
3. Click "Evening" (18:00-06:00)
   - All time slots selected
4. Unclick all
   - All flights show

**Airlines Filter:**
1. Check "Delta" (or any airline)
   - Only that airline's flights show
   - Count updates
2. Check another airline
   - Both airlines' flights show
3. Uncheck all
   - All airlines show

**Reset All Button:**
1. Set some filters
2. Click "Reset all" in sidebar header
3. All filters clear
4. All flights show
5. Badge disappears

### Step 8: Mobile Filter Testing
✅ **Filter FAB** (Mobile only, bottom-right)

**Appearance:**
- Floating button with filter icon
- Shows badge with active filter count (if > 0)
- Red badge color

**Click FAB:**
1. Bottom sheet slides up (90vh height)
2. Drag handle at top
3. Header: "Filters" + "Reset all"
4. Scrollable content with all filters:
   - Stops (checkboxes)
   - Price range (larger thumbs)
   - Departure time (horizontal scroll)
   - Airlines (toggle switches)
5. Gray dividers between sections
6. Sticky footer: "Show X flights" button

**Filter Changes in Bottom Sheet:**
1. Change any filter
   - "Show X flights" count updates instantly
   - Number reflects filtered count
2. Close sheet (click button or swipe down)
   - Returns to results
   - Results reflect filter changes
   - FAB badge shows active count

### Step 9: Sort Testing
✅ **Sort Tabs** (Desktop and Mobile)

**Cheapest:**
- Flights reorder by price (low to high)
- Tab highlights in primary blue
- Instant reordering

**Fastest:**
- Flights reorder by duration (short to long)
- Tab highlights

**Best:**
- Flights reorder by "best value" score
- Mix of price and duration
- Tab highlights

**Desktop:**
- Simple labels: "Cheapest" "Fastest" "Best"
- Inline layout

**Mobile:**
- Shows subtitle with stats:
  - Cheapest: "From $450"
  - Fastest: "7h 30m"
  - Best: "Mix"
- Full-width tabs

### Step 10: Responsive Testing
✅ **Resize Browser Window**

**Breakpoints:**
- Desktop: ≥ 1024px (lg)
- Mobile: < 1024px

**Desktop → Mobile Transition:**
1. Resize to < 1024px width
2. Filter sidebar disappears
3. FilterFAB appears bottom-right
4. Flight cards change to mobile variant
5. Chart becomes collapsible
6. Sort tabs show full width

**Mobile → Desktop Transition:**
1. Resize to ≥ 1024px width
2. FilterFAB disappears
3. Filter sidebar appears on left
4. Flight cards change to desktop variant
5. Chart expands to full card
6. Sort tabs become inline

---

## 🐛 Known Issues / Things to Check

### Critical Checks:
1. ✅ API credentials in `.env` file
2. ✅ All TypeScript types correct
3. ✅ No console errors on page load
4. ✅ API calls working (check Network tab)

### Common Issues:

**If airports don't load:**
- Check console for API error
- Should fallback to hardcoded list
- Verify .env has correct credentials

**If flights don't load:**
- Check Network tab for API call
- Look for 401 (auth error) or 429 (rate limit)
- Check console for error messages

**If filters don't work:**
- Verify SearchContext is wrapping routes
- Check React DevTools for state updates
- Ensure filteredFlights is recalculating

**If navigation fails:**
- Verify BrowserRouter in main.tsx
- Check SearchProvider in App.tsx
- Ensure routes match exactly

---

## 🔍 Developer Tools Checklist

### Console Tab:
- ✅ No red errors
- ✅ API calls log in development
- ⚠️ Warnings OK (e.g., "Airport search API error" if API down)

### Network Tab:
- ✅ OAuth token request: `POST /v1/security/oauth2/token`
- ✅ Airport search: `GET /v2/reference-data/locations?...`
- ✅ Flight search: `GET /v2/shopping/flight-offers?...`

### React DevTools:
- ✅ SearchProvider wraps <Routes>
- ✅ SearchContext has correct state
- ✅ filteredFlights updates on filter change

---

## 📱 Mobile Testing Devices

Test on actual devices or browser DevTools:
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPad (768px)
- iPad Pro (1024px)

---

## ✨ Success Criteria

### Must Work:
1. ✅ Homepage loads without errors
2. ✅ Airport autocomplete shows results
3. ✅ Search navigates to results page
4. ✅ Results display after API call
5. ✅ Filters update results instantly
6. ✅ Sorting reorders flights
7. ✅ Responsive layouts work
8. ✅ No TypeScript errors
9. ✅ No console errors
10. ✅ Mobile filter bottom sheet works

### Nice to Have:
- Smooth animations
- Loading states
- Empty states
- Error states
- Keyboard navigation

---

## 🎯 Final Verification

Run these commands to verify everything:

```bash
# TypeScript check
npx tsc --noEmit

# Build check
npm run build

# Start dev server
npm run dev
```

All should pass with zero errors!

---

## 📞 Support

If you encounter issues:
1. Check console for errors
2. Verify .env credentials
3. Check Network tab for failed requests
4. Review React DevTools for state
5. Check this guide for expected behavior

Happy testing! 🚀
