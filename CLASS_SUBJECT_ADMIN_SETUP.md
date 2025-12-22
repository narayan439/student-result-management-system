# Subject List Admin Panel Setup Guide

## Overview
This guide explains the new admin panel feature for managing subjects per class in the Student Result Management System.

## What's New

### Frontend Changes (Angular)

#### 1. **Enhanced Class Management Component** (`manage-classes.component.ts`)
- Added subject selection functionality with checkboxes
- New properties:
  - `selectedSubjectIds: number[]` - Stores selected subject IDs
  - `allSubjects: any[]` - Stores all available subjects from backend
  - `showSubjectSelector: boolean` - Toggle subject selector panel visibility

#### 2. **New Methods**
- `toggleSubjectSelector()` - Show/hide subject selection panel
- `onSubjectChange(subjectId, event)` - Handle checkbox changes
- `isSubjectSelected(subjectId)` - Check if subject is selected
- `updateSubjectListFromSelection()` - Convert selected IDs to comma-separated string
- `parseSubjectListToIds(subjectListString)` - Convert saved subjects back to IDs for editing
- `loadAllSubjects()` - Load all available subjects on component init

#### 3. **Enhanced UI Components** (`manage-classes.component.html`)
- Subject selector button showing count of selected subjects
- Collapsible subject selection panel with checkboxes
- Grid layout for subject options (auto-fit columns)
- Read-only input showing selected subjects as comma-separated string
- Both Add and Edit forms updated with subject selection

#### 4. **Styling** (`manage-classes.component.css`)
- `.subject-selector-btn` - Styled button with purple border
- `.subject-selector-panel` - Collapsible panel with smooth animation
- `.subject-list` - Grid layout for subject checkboxes
- `.subject-checkbox` - Individual checkbox styling
- Hover effects and transitions for better UX

### Backend Changes (Spring Boot)

#### 1. **SchoolClass Entity**
Added new field to [Backend/srms/src/main/java/com/studentresult/entity/SchoolClass.java](Backend/srms/src/main/java/com/studentresult/entity/SchoolClass.java):
```java
@Column(columnDefinition = "TEXT")
private String subjectList;
```

#### 2. **ClassService**
Updated [Backend/srms/src/main/java/com/studentresult/service/ClassService.java](Backend/srms/src/main/java/com/studentresult/service/ClassService.java):
- Modified `updateClass()` method to include `subjectList` field

#### 3. **Database Migration**
Created migration file: [Backend/srms/src/main/resources/ADD_SUBJECT_LIST_COLUMN.sql](Backend/srms/src/main/resources/ADD_SUBJECT_LIST_COLUMN.sql)

## Installation Steps

### Step 1: Update Database
Run the SQL migration to add the `subject_list` column to the classes table:

```sql
ALTER TABLE classes ADD COLUMN subject_list TEXT NULL AFTER is_active;
```

### Step 2: Update Class 1 with Subjects (Example)
```sql
UPDATE classes 
SET subject_list = 'Mathematics, English, Science, Social Studies, Hindi, Physical Education' 
WHERE class_number = 1;
```

### Step 3: Build Backend
```bash
cd Backend/srms
mvn clean build -DskipTests
```

### Step 4: Restart Backend Server
```bash
# The backend will automatically recognize the new column
```

### Step 5: Frontend Already Updated
No additional setup needed - the Angular components are already updated.

## How to Use

### For Admin Users:

1. **Navigate to Admin Dashboard**
   - Go to Admin Panel → Manage Classes

2. **Add a New Class**
   - Click "Add Class" button
   - Enter class name and select class number
   - Click "Click to Show Options" button
   - Select subjects using checkboxes
   - Click "Save Class"

3. **Edit Existing Class**
   - Click edit icon on a class
   - Change class details if needed
   - Click "Click to Show Options" to modify subjects
   - Selected subjects will be pre-checked
   - Click "Update Class"

### For Students/Teachers:
When selecting a class, they will see the predefined subjects assigned to that class.

## Data Format

### Subject Storage
Subjects are stored as comma-separated strings in the database:
```
"Mathematics, English, Science, Social Studies, Hindi, Physical Education"
```

### Sample Data for Different Classes

**Class 1 (Primary):**
```
Mathematics, English, Science, Social Studies, Hindi, Physical Education
```

**Class 2 (Primary):**
```
Mathematics, English, Science, Social Studies, Hindi, Art & Craft
```

**Class 3 (Intermediate):**
```
Mathematics, English, Science, Social Studies, Hindi, Computer Science
```

**Class 10 (Senior):**
```
Mathematics, English, Science, Social Studies, Hindi, Computer Science
```

## Features

✅ **Subject Selection Panel**
- Collapsible UI with smooth animations
- Checkbox-based selection
- Count display of selected subjects
- Multi-column grid layout

✅ **Auto-Population**
- Subjects auto-populate when class is selected
- Display shows comma-separated subject list
- Edit form pre-selects existing subjects

✅ **Data Persistence**
- Subjects saved to database with class
- Changes persist across sessions
- Read-only display prevents accidental edits

✅ **Backend Integration**
- Subject data stored as TEXT in database
- Service layer handles data updates
- All CRUD operations supported

## API Endpoints (No Changes)

All existing endpoints remain the same:
- `GET /api/classes` - Get all classes (now includes subjectList)
- `POST /api/classes` - Create class with subjects
- `PUT /api/classes/{id}` - Update class including subjects
- `DELETE /api/classes/{id}` - Delete class

## Frontend Models

### ClassesService Interface
```typescript
export interface SchoolClass {
  classId: number;
  className: string;
  classNumber: number;
  maxCapacity: number;
  isActive: boolean;
  subjects?: string[];           
  subjectList?: string;          // Comma-separated subjects
  createdAt?: string;
  updatedAt?: string;
}
```

## Testing

### Test Case 1: Add Class with Subjects
1. Go to Admin → Manage Classes
2. Click "Add Class"
3. Enter name: "Class 1", Number: 1
4. Click "Click to Show Options"
5. Select: Mathematics, English, Science, Social Studies, Hindi, Physical Education
6. Click "Save Class"
7. Verify subjects appear in table

### Test Case 2: Edit Class Subjects
1. Click edit on "Class 1"
2. Click "Click to Show Options"
3. Verify subjects are pre-checked
4. Uncheck "Physical Education" and add more if available
5. Click "Update Class"
6. Verify changes saved

### Test Case 3: View Subjects
1. Navigate to class viewing page
2. Verify subjects display correctly with library icon

## Troubleshooting

### Issue: Subjects not appearing in dropdown
**Solution:** 
- Ensure subjects are created in the Manage Subjects section
- Verify backend is running and `/api/subjects/all` endpoint is accessible
- Check browser console for API errors

### Issue: Selected subjects not saving
**Solution:**
- Clear browser cache
- Verify database column was added: `SHOW COLUMNS FROM classes;`
- Check backend logs for validation errors

### Issue: Subjects showing in wrong order
**Solution:**
- Subjects are displayed in the order they appear in the database
- Reorder by deleting and re-selecting in desired order

## Database Schema

After migration, the `classes` table will have:

| Column | Type | Null | Default |
|--------|------|------|---------|
| class_id | BIGINT | NO | (auto) |
| class_name | VARCHAR(50) | NO | |
| class_number | INT | NO | |
| max_capacity | INT | NO | |
| is_active | BOOLEAN | NO | true |
| **subject_list** | **TEXT** | **YES** | **NULL** |
| created_at | DATETIME | NO | (now) |
| updated_at | DATETIME | NO | (now) |

## Next Steps (Future Enhancements)

1. **Class-Subject Relationship Table**
   - Create junction table for many-to-many relationship
   - Add constraints for data validation
   - Enable easier subject management

2. **Subject Ordering**
   - Add display order field
   - Allow drag-and-drop reordering

3. **Subject Validation**
   - Only allow subjects that exist in database
   - Prevent duplicate subject selection

4. **Bulk Operations**
   - Apply same subjects to multiple classes
   - Template-based subject assignment

## Support

For issues or questions, refer to:
- Backend logs: `Backend/srms/target/logs/`
- Frontend console: Browser Developer Tools (F12)
- Database: Check `classes` table structure

---

**Last Updated:** December 21, 2025
**Version:** 1.0
