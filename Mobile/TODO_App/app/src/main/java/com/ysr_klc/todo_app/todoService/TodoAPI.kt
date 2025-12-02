package com.ysr_klc.todo_app.todoService

import com.ysr_klc.todo_app.model.Category
import com.ysr_klc.todo_app.model.CreateCategory
import com.ysr_klc.todo_app.model.CreateUpdateEvent
import com.ysr_klc.todo_app.model.CreateUpdateSubTask
import com.ysr_klc.todo_app.model.Event
import com.ysr_klc.todo_app.model.LoginRequest
import com.ysr_klc.todo_app.model.LoginResponse
import com.ysr_klc.todo_app.model.Note
import com.ysr_klc.todo_app.model.NoteRequest
import com.ysr_klc.todo_app.model.RegisterRequest
import com.ysr_klc.todo_app.model.SubTask
import com.ysr_klc.todo_app.model.SyncResponse
import com.ysr_klc.todo_app.model.Task
import com.ysr_klc.todo_app.model.TaskCreateUpdateRequest
import com.ysr_klc.todo_app.model.UserResponse
import retrofit2.http.GET
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.*

interface TodoAPI {


    // --- SYNC (Eğer eklerlerse bu çalışır) ---
    @GET("sync")
    suspend fun syncData(@Query("user_id") userId: Int): Response<SyncResponse>



        // --- AUTH ---

        @POST("auth/register")
        suspend fun register(@Body user: RegisterRequest): Response<UserResponse>

        @POST("auth/login")
        suspend fun login(@Body creds: LoginRequest): Response<LoginResponse>



        // --- TASKS ---
        @GET("tasks/")
        suspend fun getTasks(@Query("user_id") userId: Int): Response<List<Task>>

        @POST("tasks/")
        suspend fun createTask(
            @Query("user_id") userId: Int,
            @Body task: TaskCreateUpdateRequest
        ): Response<Task>

        @PUT("tasks/{task_id}")
        suspend fun updateTask(
            @Path("task_id") taskId: Int,
            @Query("user_id") userId: Int,
            @Body task: TaskCreateUpdateRequest
        ): Response<Task>

        @DELETE("tasks/{task_id}")
        suspend fun deleteTask(
            @Path("task_id") taskId: Int,
            @Query("user_id") userId: Int
        ): Response<Void>



        //---SUBTASKS---
        @POST("tasks/{task_id}/subtask/")
        suspend fun createSubtask(
            @Path("task_id") taskId: Int,
            @Query("user_id") userId: Int,
            @Body task: CreateUpdateSubTask
        ): Response<Task>


        @PUT("tasks/{task_id}/subtask/")
        suspend fun updateSubtask(
            @Path("task_id") taskId: Int,
          @Query("user_id") userId: Int,
         @Body task: CreateUpdateSubTask
        ): Response<Task>

        @DELETE("tasks/subtasks/{subtask_id}")
        suspend fun deleteSubTask(
            @Path("subtask_id") subtask_id:Int,
            @Query("user_id") userId: Int
        ): Response<Void>



        // --- CATEGORIES ---
        @POST("categories/")
        suspend fun createCategory(
             @Query("user_id") userId: Int,
             @Body category: CreateCategory
        ): Response<Category>

         @POST("categories/{category_id}")
         suspend fun updateCategory(
            @Path("category_id") category_id : Int,
             @Query("user_id") userId: Int,
             @Body category: CreateCategory
         ): Response<Category>

         @DELETE("categories/{category_id}")
         suspend fun deleteCategory(
             @Path("category_id") category_id : Int,
             @Query("user_id") userId: Int,

         ): Response<Void>

         @GET("categories/")
         suspend fun getCategories(@Query("user_id") userId: Int): Response<List<Category>>



        // --- EVENTS ---
        @GET("events/")
        suspend fun getEvents(@Query("user_id") userId: Int): Response<List<Event>>

        @POST("events/")
        suspend fun createEvent(
            @Query("user_id") userId: Int,
            @Body event: CreateUpdateEvent
        ): Response<Event>

        @PUT("events/{event_id}")
        suspend fun updateEvent(
            @Path("event_id") event_id:Int,
            @Query("user_id")user_id: Int,
            @Body event: CreateUpdateEvent
        ): Response<Event>

        @PUT("events/{event_id}")
        suspend fun deleteEvent(
            @Path("event_id") event_id:Int
        ): Response<Void>



        //-- NOTES --
        @GET("notes/")
        suspend fun getNotes(@Query("user_id") userId: Int): Response<List<Note>>

        @POST("notes/")
        suspend fun createNote(@Body note: NoteRequest): Response<Note>

        @PUT("notes/{note_id}")
        suspend fun updateNote(@Path( "note_id") noteId : Int, @Query("user_id") userId: Int): Response<Note>

        @DELETE("notes/{note_id}")
        suspend fun deleteNote(@Path("note_id") id:Int) : Response<String>
    }
