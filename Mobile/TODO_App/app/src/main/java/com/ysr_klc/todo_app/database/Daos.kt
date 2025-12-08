package com.ysr_klc.todo_app.database


import androidx.room.*
import com.ysr_klc.todo_app.model.TaskStatus
import kotlinx.coroutines.flow.Flow

@Dao
interface TaskDao {
    // --- CREATE & FULL UPDATE (API Sync İçin) ---
    // API'dan gelen veriyi basmak için en pratik yöntem budur. Varsa ezer, yoksa yazar.
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTask(task: TaskEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAllTasks(tasks: List<TaskEntity>)

    // --- LOCAL UPDATE (Kullanıcı Etkileşimi İçin) ---
    // Kullanıcı bir görevi düzenlediğinde bunu kullanabilirsin
    @Update
    suspend fun updateTask(task: TaskEntity)

    // PERFORMANS İÇİN: Sadece durumu değiştirmek için tüm task'ı yazmaya gerek yok.
    // Kullanıcı checkbox'a bastığında sadece bu çalışsın.
    @Query("UPDATE tasks SET status = :status WHERE id = :taskId")
    suspend fun updateTaskStatus(taskId: Int, status: TaskStatus)

    // --- DELETE ---
    @Delete
    suspend fun deleteTask(task: TaskEntity)

    // Kullanıcı logout olduğunda veya temiz kurulum gerektiğinde tüm tabloyu siler
    @Query("DELETE FROM tasks")
    suspend fun deleteAllTasks()

    // --- READ ---
    @Query("SELECT * FROM tasks WHERE user_id = :userId ORDER BY created_at DESC")
    fun getTasksFlow(userId: Int): Flow<List<TaskEntity>>

    @Query("SELECT * FROM tasks WHERE id = :taskId")
    suspend fun getTaskById(taskId: Int): TaskEntity?
}

@Dao
interface SubTaskDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSubTasks(subTasks: List<SubTaskEntity>)

    // Alt görev tamamlandı/tamamlanmadı yapmak için hızlı güncelleme
    @Query("UPDATE sub_tasks SET is_completed = :isCompleted WHERE id = :subTaskId")
    suspend fun updateSubTaskStatus(subTaskId: Int, isCompleted: Boolean)

    @Query("SELECT * FROM sub_tasks WHERE task_id = :taskId")
    fun getSubTasksForTask(taskId: Int): Flow<List<SubTaskEntity>>

    @Query("DELETE FROM sub_tasks WHERE task_id = :taskId")
    suspend fun deleteSubTasksByTaskId(taskId: Int)

    @Query("DELETE FROM sub_tasks")
    suspend fun deleteAllSubTasks()
}

@Dao
interface CategoryDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAllCategories(categories: List<CategoryEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCategory(category: CategoryEntity)

    @Delete
    suspend fun deleteCategory(category: CategoryEntity)

    @Query("DELETE FROM categories")
    suspend fun deleteAllCategories()

    @Query("SELECT * FROM categories WHERE user_id = :userId")
    fun getCategoriesFlow(userId: Int): Flow<List<CategoryEntity>>
}

@Dao
interface EventDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAllEvents(events: List<EventEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEvent(event: EventEntity)

    @Delete
    suspend fun deleteEvent(event: EventEntity)

    @Query("DELETE FROM events")
    suspend fun deleteAllEvents()

    @Query("SELECT * FROM events WHERE user_id = :userId ORDER BY start_time ASC")
    fun getEventsFlow(userId: Int): Flow<List<EventEntity>>
}

@Dao
interface NoteDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAllNotes(notes: List<NoteEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNote(note: NoteEntity)

    @Delete
    suspend fun deleteNote(note: NoteEntity)

    @Query("DELETE FROM notes")
    suspend fun deleteAllNotes()

    @Query("SELECT * FROM notes WHERE user_id = :userId ORDER BY created_at DESC")
    fun getNotesFlow(userId: Int): Flow<List<NoteEntity>>
}