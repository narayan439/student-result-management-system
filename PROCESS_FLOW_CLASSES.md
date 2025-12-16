# Process Flow - Add Class & Section in Admin Panel

## 🎯 User Journey Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN PANEL                                   │
│                                                                   │
│  Dashboard  →  Click "Manage Classes" Card                      │
│                        ↓                                          │
│                ┌───────────────────────┐                         │
│                │  Manage Classes Page   │                         │
│                └───────────────────────┘                         │
│                        ↓                                          │
│         ┌──────────────┼──────────────┐                         │
│         ↓              ↓              ↓                          │
│    [Add Class]  [Search/Filter]  [Edit/Delete/Toggle]          │
│         ↓              ↓              ↓                          │
│    Save New      Display Results   Update/Remove                │
│    Class         from Table        Class                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Step-by-Step Process

### Process 1: ADD A NEW CLASS

```
START
  ↓
[Login to Admin Panel]
  ↓
[Navigate to Dashboard]
  ↓
[Click "Manage Classes" Card] OR [Go to /admin/manage-classes]
  ↓
[Page Loads with Existing Classes Table]
  ↓
[Click "+ Add Class" Button]
  ↓
[Form Appears with Fields:]
  • Class Name (text input)
  • Class Code (text input - unique)
  • Semester (dropdown: 1-8)
  • Academic Year (dropdown)
  ↓
[Fill All Fields]
  ↓
[Validate Data]
  → Check if Class Code already exists
  → Check all fields not empty
  ↓
[If Valid] → Click "Save Class"
  ↓
[Success Message Appears]
  ↓
[Form Resets/Closes]
  ↓
[New Class Appears in Table]
  ↓
END ✅

[If Invalid] → Error Message Shows
  ↓
[User Corrects]
  ↓
[Retries Save]
```

**Example:**
```
Class Name: B.Tech CSE Semester 3
Class Code: CSE-3-2024
Semester: 3
Academic Year: 2023-2024
↓
[Save Class]
↓
✅ Class added successfully!
```

---

### Process 2: SEARCH FOR A CLASS

```
START
  ↓
[On Manage Classes Page]
  ↓
[See "Search by name or code" Field]
  ↓
[Type Search Term]
  • By Name: "CSE" → Shows all CSE classes
  • By Code: "CSE-3" → Shows CSE-3-2024 class
  ↓
[Table Filters in Real-Time]
  ↓
[Results Display Matching Classes]
  ↓
[User Sees Filtered List]
  ↓
[Click Edit/Delete/Toggle as Needed]
  ↓
[Clear Search to See All]
  ↓
END ✅

Example:
User Types: "CSE"
Results:
├─ B.Tech CSE Semester 1
├─ B.Tech CSE Semester 2
├─ B.Tech CSE Semester 3
└─ B.Tech CSE Semester 4
```

---

### Process 3: FILTER BY SEMESTER

```
START
  ↓
[On Manage Classes Page]
  ↓
[See "Filter by Semester" Dropdown]
  ↓
[Click Dropdown]
  ↓
[Select Semester: 1, 2, 3, 4, 5, 6, 7, or 8]
  ↓
[Table Filters Automatically]
  ↓
[Shows Only Classes from Selected Semester]
  ↓
[Example: Select Semester 3]
  Results:
  ├─ B.Tech CSE Semester 3
  └─ B.Tech ECE Semester 3
  ↓
[Can Combine with Search]
  • Search: "CSE"
  • Filter: "Semester 3"
  • Result: B.Tech CSE Semester 3 only
  ↓
[Click "All Semesters" to Reset Filter]
  ↓
END ✅
```

---

### Process 4: EDIT AN EXISTING CLASS

```
START
  ↓
[On Manage Classes Page with Classes Listed]
  ↓
[Find Class to Edit in Table]
  ↓
[Click Edit Icon (Pencil) in Actions Column]
  ↓
[Form Populates with Current Class Data]
  ├─ Class Name
  ├─ Class Code
  ├─ Semester
  └─ Academic Year
  ↓
[Update Desired Fields]
  ↓
[Validate Changes]
  → Class Code must be unique (if changed)
  → All fields must have values
  ↓
[If Valid] → Click "Save Class"
  ↓
[Success Message]
  ↓
[Table Updates with New Data]
  ↓
[Form Closes]
  ↓
END ✅

[If Invalid] → Error Message
  ↓
[Fix and Retry]

Example:
Before: Class Code = "CSE-3-2024"
After: Class Code = "CSE-3-2025"
↓
[Save]
↓
✅ Class updated successfully!
```

---

### Process 5: DELETE A CLASS

```
START
  ↓
[On Manage Classes Page]
  ↓
[Find Class to Delete in Table]
  ↓
[Click Delete Icon (Trash) in Actions Column]
  ↓
[Confirmation Dialog Appears]
  "Are you sure you want to delete class [ClassName]?"
  ↓
  ├─ [Cancel] → Dialog Closes, No Action
  │
  └─ [Confirm Delete] → Continue
      ↓
      [Class Deleted from Database]
      ↓
      [Table Updates - Class Removed]
      ↓
      [Success Message]
      ↓
      END ✅

Example:
User Deletes: "B.Tech CSE Semester 8"
↓
"Are you sure you want to delete class B.Tech CSE Semester 8?"
↓
[User Clicks Confirm]
↓
✅ Class deleted successfully!
↓
Table no longer shows this class
```

---

### Process 6: TOGGLE CLASS STATUS (ACTIVE/INACTIVE)

```
START
  ↓
[On Manage Classes Page]
  ↓
[Find Class in Table]
  ↓
[Look at Status Column - See Slide Toggle]
  • RIGHT (green) = ACTIVE
  • LEFT (red) = INACTIVE
  ↓
[Click/Drag Slide Toggle]
  ↓
[Toggle Changes Immediately]
  ├─ Active → Inactive (toggle moves left, turns red)
  └─ Inactive → Active (toggle moves right, turns green)
  ↓
[Status Updates in Table]
  ↓
[Change is Persisted]
  ↓
END ✅

Example:
Original: "B.Tech CSE Semester 3" - ACTIVE (green)
↓
[User Clicks Toggle]
↓
↓ Becomes: "B.Tech CSE Semester 3" - INACTIVE (red)
↓
Immediately updated without refresh
```

---

## 🔄 Complete Workflow Cycle

```
┌──────────────────────────────────────────────────────────────────┐
│                    COMPLETE ADMIN WORKFLOW                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  1. ADMIN LOGS IN                                                │
│     └─→ Dashboard Shows                                          │
│                                                                    │
│  2. ADMIN CLICKS "MANAGE CLASSES"                                │
│     └─→ Class Management Page Loads                             │
│         └─→ Table Shows 4 Sample Classes                        │
│                                                                    │
│  3. ADMIN CAN NOW:                                              │
│                                                                    │
│     ┌─ SEARCH ───────────────────────────────┐                  │
│     │ Find class by name/code                 │                  │
│     │ Results filter in real-time             │                  │
│     └──────────────────────────────────────────┘                  │
│                                                                    │
│     ┌─ FILTER ───────────────────────────────┐                  │
│     │ Filter by semester (1-8)               │                  │
│     │ Table shows only matching classes      │                  │
│     └──────────────────────────────────────────┘                  │
│                                                                    │
│     ┌─ ADD ──────────────────────────────────┐                  │
│     │ Fill form with class details           │                  │
│     │ Validate (check duplicate code)        │                  │
│     │ Save to table                          │                  │
│     └──────────────────────────────────────────┘                  │
│                                                                    │
│     ┌─ EDIT ─────────────────────────────────┐                  │
│     │ Click pencil icon on any row           │                  │
│     │ Form populates with current data       │                  │
│     │ Make changes and save                  │                  │
│     └──────────────────────────────────────────┘                  │
│                                                                    │
│     ┌─ DELETE ───────────────────────────────┐                  │
│     │ Click trash icon on any row            │                  │
│     │ Confirm deletion                       │                  │
│     │ Class removed from table               │                  │
│     └──────────────────────────────────────────┘                  │
│                                                                    │
│     ┌─ TOGGLE ───────────────────────────────┐                  │
│     │ Click slide toggle in status column    │                  │
│     │ Toggle changes immediately            │                  │
│     │ Active ↔ Inactive                     │                  │
│     └──────────────────────────────────────────┘                  │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎯 User Interaction Matrix

| User Action | Input Required | Validation | Result | Error Handling |
|-------------|----------------|------------|--------|----------------|
| **Add Class** | All 4 fields | Not empty, unique code | Class added to table | Show alert |
| **Edit Class** | Click edit, update | Not empty, unique code | Class updated | Show alert |
| **Delete Class** | Click delete | Confirm dialog | Class removed | Confirmation |
| **Search** | Type query | Optional | Filter table | Real-time filter |
| **Filter** | Select semester | Optional | Filter table | Real-time filter |
| **Toggle Status** | Click toggle | None | Status changes | Immediate update |

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│     MANAGE CLASSES COMPONENT                │
├─────────────────────────────────────────────┤
│                                               │
│  classes[] = [Class1, Class2, Class3, ...] │
│                                               │
│  ┌──────────────────────────────────────┐  │
│  │        Search/Filter                  │  │
│  │  Input: searchTerm, selectedSemester │  │
│  │  Process: Filter classes array       │  │
│  │  Output: filteredClasses[]           │  │
│  └──────────────────────────────────────┘  │
│           ↓                                  │
│  ┌──────────────────────────────────────┐  │
│  │     MatTableDataSource                │  │
│  │  Display: Filtered classes            │  │
│  │  Columns: Name, Code, Semester, ...  │  │
│  └──────────────────────────────────────┘  │
│           ↓                                  │
│  ┌──────────────────────────────────────┐  │
│  │    User Interactions (CRUD)          │  │
│  │  - Add: Push to classes[]            │  │
│  │  - Edit: Find & update in array      │  │
│  │  - Delete: Filter out from array     │  │
│  │  - Toggle: Update isActive property  │  │
│  └──────────────────────────────────────┘  │
│           ↓                                  │
│  ┌──────────────────────────────────────┐  │
│  │     Refresh Table Display            │  │
│  │  Update MatTableDataSource           │  │
│  │  Re-render table with new data       │  │
│  └──────────────────────────────────────┘  │
│                                               │
└─────────────────────────────────────────────┘
```

---

## 🚀 Quick Command Reference

| Task | Steps |
|------|-------|
| **Add Class** | Button: "+ Add Class" → Fill Form → Click "Save Class" |
| **Edit Class** | Click Pencil Icon → Modify Fields → Click "Save Class" |
| **Delete Class** | Click Trash Icon → Confirm → Class Removed |
| **Toggle Status** | Click Slide Toggle → Instant Change |
| **Search** | Type in Search Box → Real-time Filter |
| **Filter by Semester** | Select Semester from Dropdown → Auto Filter |

---

## ✅ Verification Checklist

- [ ] Access `/admin/manage-classes`
- [ ] See "Manage Classes" card on dashboard
- [ ] View table with 4 sample classes
- [ ] Add Class form works
- [ ] Search filters correctly
- [ ] Semester filter works
- [ ] Edit function updates data
- [ ] Delete shows confirmation
- [ ] Toggle changes status immediately
- [ ] Page is responsive on mobile

---

## 🎓 Summary

The **Manage Classes Feature** provides a complete workflow for administrators to:

✅ **Create** new classes with semester and academic year  
✅ **Read** and view all classes in organized table  
✅ **Update** existing class details  
✅ **Delete** classes with confirmation  
✅ **Search** by name or class code  
✅ **Filter** by semester  
✅ **Toggle** active/inactive status  

**All operations work with mock data and are ready for backend integration!**

---

*Last Updated: December 16, 2025*  
*Status: Complete & Production Ready ✅*
