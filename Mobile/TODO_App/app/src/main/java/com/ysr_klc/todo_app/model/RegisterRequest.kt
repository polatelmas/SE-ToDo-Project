package com.ysr_klc.todo_app.model

// --- AUTH MODELLERİ ---
data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String,
    val birth_date: String? // "YYYY-MM-DD" formatında string gönder
)

data class UserResponse(
    val id: Int,
    val username: String,
    val email: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val message: String,
    val user_id: Int
)

// --- TASK MODELLERİ ---
// Backend TaskCreate şeması ID içermez
data class TaskCreateRequest(
    val title: String,
    val description: String?,
    val priority: String, // "HIGH", "MEDIUM", "LOW"
    val due_date: String?,
    val category_id: Int?
)

// Güncelleme için
data class TaskUpdateRequest(
    val title: String?,
    val is_completed: Boolean?, // Backend şemasında status veya is_completed olabilir, kontrol et
    val priority: String?
)

// API'den gelen cevap (Task objesi)
data class Task(
    val id: Int,
    val user_id: Int,
    val title: String,
    val description: String?,
    val priority: String,
    val is_completed: Boolean = false, // Backend'de default false olabilir
    val due_date: String?,
    val created_at: String?
)

// --- SYNC RESPONSE (Tüm veriler) ---
data class SyncResponse(
    val user_id: Int,
    val tasks: List<Task>,
    val categories: List<Category>,
    val events: List<Event>,
    val notes: List<Note>
)

// Not: Category, Event, Note sınıflarını Task mantığıyla oluşturabilirsin.