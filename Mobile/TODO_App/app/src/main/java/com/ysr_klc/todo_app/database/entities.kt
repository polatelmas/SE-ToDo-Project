package com.ysr_klc.todo_app.database


import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey
import com.ysr_klc.todo_app.model.Priority
import com.ysr_klc.todo_app.model.RecurrenceType
import com.ysr_klc.todo_app.model.TaskStatus

// --- TASK ENTITY ---
@Entity(tableName = "tasks")
data class TaskEntity(
    @PrimaryKey(autoGenerate = false) // API'dan gelen ID'yi kullanacağımız için false
    @ColumnInfo(name = "id") val id: Int,
    @ColumnInfo(name = "user_id") val userId: Int,
    @ColumnInfo(name = "category_id") val categoryId: Int?,

    @ColumnInfo(name = "title") val title: String,
    @ColumnInfo(name = "description") val description: String?,

    // Enumlar TypeConverter ile saklanacak
    @ColumnInfo(name = "priority") val priority: Priority,
    @ColumnInfo(name = "status") val status: TaskStatus,

    @ColumnInfo(name = "due_date") val dueDate: String?,
    @ColumnInfo(name = "recurrence_type") val recurrenceType: RecurrenceType?,
    @ColumnInfo(name = "recurrence_end_date") val recurrenceEndDate: String?,
    @ColumnInfo(name = "color_code") val colorCode: String?,
    @ColumnInfo(name = "created_at") val createdAt: String?
)

// --- SUBTASK ENTITY ---
// SubTask'lar Task'a bağlı olduğu için ForeignKey kullanabiliriz (Opsiyonel ama veri bütünlüğü için iyi)
@Entity(
    tableName = "sub_tasks",
    foreignKeys = [
        ForeignKey(
            entity = TaskEntity::class,
            parentColumns = ["id"],
            childColumns = ["task_id"],
            onDelete = ForeignKey.CASCADE // Task silinirse SubTask'lar da silinsin
        )
    ]
)
data class SubTaskEntity(
    @PrimaryKey(autoGenerate = false)
    @ColumnInfo(name = "id") val id: Int,
    @ColumnInfo(name = "task_id") val taskId: Int,
    @ColumnInfo(name = "title") val title: String,
    @ColumnInfo(name = "is_completed") val isCompleted: Boolean,
    @ColumnInfo(name = "created_at") val createdAt: String?
)

// --- CATEGORY ENTITY ---
@Entity(tableName = "categories")
data class CategoryEntity(
    @PrimaryKey(autoGenerate = false)
    @ColumnInfo(name = "id") val id: Int,
    @ColumnInfo(name = "user_id") val userId: Int,
    @ColumnInfo(name = "name") val name: String,
    @ColumnInfo(name = "color_code") val colorCode: String?
)

// --- EVENT ENTITY ---
@Entity(tableName = "events")
data class EventEntity(
    @PrimaryKey(autoGenerate = false)
    @ColumnInfo(name = "id") val id: Int,
    @ColumnInfo(name = "user_id") val userId: Int,
    @ColumnInfo(name = "title") val title: String,
    @ColumnInfo(name = "start_time") val startTime: String,
    @ColumnInfo(name = "end_time") val endTime: String,
    @ColumnInfo(name = "location") val location: String?,
    @ColumnInfo(name = "color_code") val colorCode: String?
)

// --- NOTE ENTITY ---
@Entity(tableName = "notes")
data class NoteEntity(
    @PrimaryKey(autoGenerate = false)
    @ColumnInfo(name = "id") val id: Int,
    @ColumnInfo(name = "user_id") val userId: Int,
    @ColumnInfo(name = "category_id") val categoryId: Int?,
    @ColumnInfo(name = "event_id") val eventId: Int?,
    @ColumnInfo(name = "title") val title: String,
    @ColumnInfo(name = "content") val content: String,
    @ColumnInfo(name = "color_code") val colorCode: String?,
    @ColumnInfo(name = "created_at") val createdAt: String?
)