package com.ysr_klc.todo_app.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.ysr_klc.todo_app.model.Priority
import com.ysr_klc.todo_app.model.RecurrenceType
import com.ysr_klc.todo_app.model.TaskStatus



@Database(
    entities = [
        TaskEntity::class,
        SubTaskEntity::class,
        CategoryEntity::class,
        EventEntity::class,
        NoteEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class TodoDatabase : RoomDatabase() {
    abstract fun taskDao(): TaskDao
    abstract fun subTaskDao(): SubTaskDao
    abstract fun categoryDao(): CategoryDao
    abstract fun eventDao(): EventDao
    abstract fun noteDao(): NoteDao

    companion object{

        private var instance: TodoDatabase? =null

        private val lock = Any()

        operator fun invoke(context: Context) = instance?: synchronized(lock){
            instance?:roomDbCreate(context).also {
                instance=it
            }
        }

        private fun roomDbCreate(context: Context) = Room.databaseBuilder(
            context.applicationContext,
            TodoDatabase::class.java,
            "TodoLocalDB"
        ).build()
    }

}

class Converters {
    @TypeConverter
    fun fromPriority(priority: Priority): String {
        return priority.name
    }

    @TypeConverter
    fun toPriority(priority: String): Priority {
        return try {
            Priority.valueOf(priority)
        } catch (e: Exception) {
            Priority.LOW // Varsayılan değer
        }
    }

    @TypeConverter
    fun fromStatus(status: TaskStatus): String {
        return status.name
    }

    @TypeConverter
    fun toStatus(status: String): TaskStatus {
        return try {
            TaskStatus.valueOf(status)
        } catch (e: Exception) {
            TaskStatus.PENDING
        }
    }

    @TypeConverter
    fun fromRecurrence(recurrence: RecurrenceType?): String? {
        return recurrence?.name
    }

    @TypeConverter
    fun toRecurrence(recurrence: String?): RecurrenceType? {
        return recurrence?.let {
            try {
                RecurrenceType.valueOf(it)
            } catch (e: Exception) {
                RecurrenceType.NONE
            }
        }
    }
}