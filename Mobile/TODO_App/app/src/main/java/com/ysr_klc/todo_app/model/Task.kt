package com.ysr_klc.todo_app.model

import com.google.gson.annotations.SerializedName

data class Task(
    @SerializedName("id") val id: Int,
    @SerializedName("user_id") val userId: Int,
    @SerializedName("category_id") val categoryId: Int?, // Null olabilir (Kategorisiz görev)

    @SerializedName("title") val title: String,
    @SerializedName("description") val description: String?,

    @SerializedName("priority") val priority: Priority, // Enum (Aşağıda tanımlı)
    @SerializedName("status") val status: TaskStatus,   // Enum (Aşağıda tanımlı)

    @SerializedName("due_date") val dueDate: String?, // "2025-12-01 15:00:00"

    @SerializedName("recurrence_type") val recurrenceType: RecurrenceType?,
    @SerializedName("recurrence_end_date") val recurrenceEndDate: String?,

    @SerializedName("color_code") val colorCode: String?, // "#FF5733" gibi
    @SerializedName("created_at") val createdAt: String?,

    // Backend join yapıp gönderirse diye opsiyonel liste:
    @SerializedName("sub_tasks") val subTasks: List<SubTask> = emptyList()
)


data class TaskCreateUpdateRequest(
    @SerializedName("category_id") val categoryId: Int?, // Null olabilir (Kategorisiz görev)

    @SerializedName("title") val title: String,
    @SerializedName("description") val description: String?,

    @SerializedName("priority") val priority: Priority, // Enum (Aşağıda tanımlı)
    @SerializedName("status") val status: TaskStatus,   // Enum (Aşağıda tanımlı)

    @SerializedName("due_date") val dueDate: String?, // "2025-12-01 15:00:00"

    @SerializedName("recurrence_type") val recurrenceType: RecurrenceType?,
    @SerializedName("recurrence_end_date") val recurrenceEndDate: String?,

    @SerializedName("color_code") val colorCode: String?, // "#FF5733" gibi

    // Backend join yapıp gönderirse diye opsiyonel liste:
    @SerializedName("sub_tasks") val subTasks: List<SubTask> = emptyList()
)



// Enumlar (Veritabanındaki ENUM değerleriyle BİREBİR aynı olmalı - BÜYÜK HARF)
enum class Priority {
    @SerializedName("LOW") LOW,
    @SerializedName("MEDIUM") MEDIUM,
    @SerializedName("HIGH") HIGH
}

enum class TaskStatus {
    @SerializedName("PENDING") PENDING,
    @SerializedName("COMPLETED") COMPLETED
    // Eğer görseldeki 'task_status' enum değerleri farklıysa burayı güncelle
}

enum class RecurrenceType {
    @SerializedName("NONE") NONE,
    @SerializedName("DAILY") DAILY,
    @SerializedName("WEEKLY") WEEKLY,
    @SerializedName("WEEKDAYS") WEEKDAYS,
    @SerializedName("WEEKENDS") WEEKENDS
}
