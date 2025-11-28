package com.ysr_klc.todo_app.todoService

import com.ysr_klc.todo_app.model.Category
import com.ysr_klc.todo_app.model.Event
import com.ysr_klc.todo_app.model.LoginRequest
import com.ysr_klc.todo_app.model.LoginResponse
import com.ysr_klc.todo_app.model.RegisterRequest
import com.ysr_klc.todo_app.model.SyncResponse
import com.ysr_klc.todo_app.model.Task
import com.ysr_klc.todo_app.model.TaskCreateRequest
import com.ysr_klc.todo_app.model.TaskUpdateRequest
import com.ysr_klc.todo_app.model.UserResponse
import retrofit2.http.GET
import retrofit2.Call
import retrofit2.http.*

interface TodoAPI {

        // --- AUTH ---
        @POST("auth/register")
        fun register(@Body user: RegisterRequest): Call<UserResponse>

        @POST("auth/login")
        fun login(@Body creds: LoginRequest): Call<LoginResponse>


        // --- SYNC (Eğer eklerlerse bu çalışır) ---
        @GET("sync")
        fun syncData(@Query("user_id") userId: Int): Call<SyncResponse>


        // --- TASKS ---
        @GET("tasks/")
        fun getTasks(@Query("user_id") userId: Int): Call<List<Task>>

        @POST("tasks/")
        fun createTask(
            @Query("user_id") userId: Int,
            @Body task: TaskCreateRequest
        ): Call<Task>

        @PUT("tasks/{id}") // Backend PUT kullanmış
        fun updateTask(
            @Path("id") taskId: Int,
            @Query("user_id") userId: Int,
            @Body task: TaskUpdateRequest
        ): Call<Task>

        @DELETE("tasks/{id}")
        fun deleteTask(
            @Path("id") taskId: Int,
            @Query("user_id") userId: Int
        ): Call<Void>


        // --- CATEGORIES ---
        @GET("categories/")
        fun getCategories(@Query("user_id") userId: Int): Call<List<Category>>

        @POST("categories/")
        fun createCategory(
            @Query("user_id") userId: Int,
            @Body category: Category
        ): Call<Category>


        // --- EVENTS ---
        @GET("events/")
        fun getEvents(@Query("user_id") userId: Int): Call<List<Event>>

        @POST("events/")
        fun createEvent(
            @Query("user_id") userId: Int,
            @Body event: Event
        ): Call<Event>
    }
