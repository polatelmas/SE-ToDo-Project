package com.ysr_klc.todo_app.model


    import com.google.gson.annotations.SerializedName
    data class SubTask(
        @SerializedName("id") val id: Int,
        @SerializedName("task_id") val taskId: Int,
        @SerializedName("title") val title: String,

        @SerializedName("is_completed") val isCompleted: Boolean,

        @SerializedName("created_at") val createdAt: String?
    )
