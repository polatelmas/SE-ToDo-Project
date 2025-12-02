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




// --- SYNC RESPONSE (Tüm veriler) ---
data class SyncResponse(
    val user_id: Int,
    val tasks: List<Task>,
    val categories: List<Category>,
    val events: List<Event>,
    val notes: List<Note>
)

// Not: Category, Event, Note sınıflarını Task mantığıyla oluşturabilirsin.