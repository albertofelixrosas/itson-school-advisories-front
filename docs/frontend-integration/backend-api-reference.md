# Backend API Reference - School Advisories System

## 🔗 Backend Information
- **Repository**: https://github.com/albertofelixrosas/school-advisories-back
- **Development URL**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api (Swagger)
- **Technology Stack**: NestJS + TypeScript + PostgreSQL + Redis + Bull Queue

## 🔐 Authentication System

### JWT Authentication
All protected endpoints require JWT token in Authorization header:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Login Endpoint
```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response**:
```typescript
{
  access_token: string;
  refresh_token: string;
  user: {
    user_id: number;
    username: string;
    email: string;
    name: string;
    last_name: string;
    role: 'student' | 'professor' | 'admin';
    photo_url?: string;
  };
  dashboard_data: {
    stats: object;
    recent_activity: object[];
    notifications_count: number;
  };
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "string"
}
```

### User Profile
```http
GET /auth/profile
Authorization: Bearer {token}
```

## 👥 User Roles & Permissions

### STUDENT Role
- ✅ Create advisory requests
- ✅ View their own requests and sessions
- ✅ Configure notification preferences
- ✅ View available professors and subjects

### PROFESSOR Role
- ✅ All student permissions
- ✅ View and manage pending requests
- ✅ Approve/reject advisory requests
- ✅ Create direct advisory sessions
- ✅ Manage their availability schedule
- ✅ Invite students to sessions
- ✅ Register session attendance

### ADMIN Role
- ✅ All professor permissions
- ✅ Manage users (create, update, deactivate)
- ✅ Manage subjects and subject details
- ✅ Access system reports and statistics
- ✅ Configure email templates
- ✅ System-wide configuration

## 📋 Core API Endpoints

### 🎓 Advisory Requests (Primary Flow)

#### Create Advisory Request (Student)
```http
POST /advisory-requests
Authorization: Bearer {token}
Content-Type: application/json

{
  "subject_detail_id": number,
  "student_message": string, // optional
  "preferred_schedule": string // optional
}
```

#### Get My Requests (Student)
```http
GET /advisory-requests/my-requests?status=PENDING|APPROVED|REJECTED|CANCELLED
Authorization: Bearer {token}
```

#### Get Pending Requests (Professor)
```http
GET /advisory-requests/pending
Authorization: Bearer {token}
```

#### Approve/Reject Request (Professor)
```http
PATCH /advisory-requests/:id/approve
Authorization: Bearer {token}
Content-Type: application/json

{
  "professor_response": string // optional message
}

PATCH /advisory-requests/:id/reject
Authorization: Bearer {token}
Content-Type: application/json

{
  "rejection_reason": string
}
```

#### Cancel Request (Student or Professor)
```http
PATCH /advisory-requests/:id/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "cancellation_reason": string
}
```

### 📚 Subjects & Subject Details

#### Get All Subjects
```http
GET /subjects
Authorization: Bearer {token}
```

#### Get Subject Details by Professor
```http
GET /subject-details/professor/:professorId
Authorization: Bearer {token}
```

#### Get Professor's Own Subject Details
```http
GET /subject-details/my-subjects
Authorization: Bearer {token}
```

### 🎯 Advisory Management

#### Create Direct Session (Professor)
```http
POST /advisories/direct-session
Authorization: Bearer {token}
Content-Type: application/json

{
  "subject_detail_id": number,
  "venue_id": number,
  "session_date": string, // ISO date
  "topic": string,
  "notes": string, // optional
  "session_link": string, // optional
  "max_students": number // optional, default from advisory
}
```

#### Get Advisories by Professor
```http
GET /advisories/professor/:professorId
Authorization: Bearer {token}
```

#### Invite Students to Session
```http
POST /advisories/sessions/:sessionId/invite
Authorization: Bearer {token}
Content-Type: application/json

{
  "student_ids": number[],
  "invitation_message": string // optional
}
```

### ⏰ Professor Availability

#### Create Availability Slot
```http
POST /professor-availability/slots
Authorization: Bearer {token}
Content-Type: application/json

{
  "professor_id": number,
  "subject_detail_id": number,
  "day_of_week": "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY",
  "start_time": "HH:MM", // 24-hour format
  "end_time": "HH:MM",
  "max_students_per_slot": number,
  "slot_duration_minutes": number,
  "is_recurring": boolean,
  "effective_from": "YYYY-MM-DD", // optional
  "effective_until": "YYYY-MM-DD", // optional
  "notes": "string" // optional
}
```

Notas del backend actual:
- `professor_id` sigue siendo requerido por validación global aunque el controller lo sobrescriba con el usuario autenticado.
- La respuesta puede traer `start_time` y `end_time` en formato `HH:mm:ss`.
- `subject_detail` llega aplanado como `{ subject_detail_id, subject_name }`, no como `subject_detail.subject.subject`.
- `PUT /professor-availability/slots/:id` no acepta `is_active`; para desactivar se debe usar `DELETE /professor-availability/slots/:id/deactivate`.

#### Get Available Slots
```http
GET /professor-availability/available-slots/:professorId/:subjectDetailId?date=YYYY-MM-DD
Authorization: Bearer {token}
```

#### Get My Availability
```http
GET /professor-availability/my-availability
Authorization: Bearer {token}
```

### 📨 Invitations Management

#### Get My Invitations (Student)
```http
GET /student-invitations/my-invitations?status=PENDING|ACCEPTED|DECLINED
Authorization: Bearer {token}
```

#### Respond to Invitation
```http
POST /student-invitations/:invitationId/respond
Authorization: Bearer {token}
Content-Type: application/json

{
  "response": "accept" | "decline",
  "response_message": string // optional
}
```

### 👥 User Management

#### Get Users by Role
```http
GET /users/role/:role
Authorization: Bearer {token}
```

#### Get Professors
```http
GET /users/professors
Authorization: Bearer {token}
```

#### Get Students  
```http
GET /users/students
Authorization: Bearer {token}
```

### 🔔 Notifications

#### Get Notification Preferences
```http
GET /notifications/preferences
Authorization: Bearer {token}
```

#### Update Notification Preferences
```http
PATCH /notifications/preferences
Authorization: Bearer {token}
Content-Type: application/json

{
  "email_enabled": boolean,
  "reminder_24h": boolean,
  "reminder_1h": boolean,
  "session_updates": boolean
}
```

#### Get Notification History
```http
GET /notifications/history
Authorization: Bearer {token}
```

### 📊 Session Management

#### Register Attendance (Professor)
```http
POST /advisory-attendance/session/:sessionId/bulk-attendance
Authorization: Bearer {token}
Content-Type: application/json

{
  "attendances": [
    {
      "student_id": number,
      "attendance_status": "PRESENT" | "ABSENT" | "LATE",
      "notes": string // optional
    }
  ]
}
```

#### Complete Session
```http
PATCH /advisory-attendance/session/:sessionId/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "session_notes": string,
  "topics_covered": string[],
  "next_steps": string // optional
}
```

## 🚨 Error Handling

### Standard Error Response Format
```typescript
{
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp?: string;
}
```

### Common HTTP Status Codes
- **200**: Success
- **201**: Created successfully  
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (business rule violation)
- **500**: Internal Server Error

## 🔄 Business Logic & Validation Rules

### Advisory Request Rules
- ✅ Student can only have 1 PENDING request per subject_detail
- ✅ Only assigned professor can approve/reject requests
- ✅ Approved requests automatically create Advisory + AdvisoryDate
- ✅ Email notifications sent automatically on all status changes

### Session Creation Rules
- ✅ Professor can only create sessions for their assigned subjects
- ✅ Venue capacity is validated against max_students
- ✅ Time conflicts are checked automatically
- ✅ Students receive automatic invitations if specified

### Availability Rules
- ✅ Professors can set recurring availability patterns
- ✅ Time slots cannot overlap for same subject
- ✅ Availability can be specific to subject_detail
- ✅ Students can view available slots before requesting

## 📧 Automatic Notifications

The system sends automated emails for:

### For Students:
- ✅ Request approved by professor
- ✅ Request rejected with reason
- ✅ Session cancelled by professor
- ✅ Invitation to direct session
- ✅ Session reminder (24h and 1h before)
- ✅ Session completion summary

### For Professors:
- ✅ New advisory request received
- ✅ Student accepts/declines invitation
- ✅ Student cancels approved request
- ✅ Session reminder notifications

### Email Template Variables
All emails support dynamic content with user data, session information, and custom messages.