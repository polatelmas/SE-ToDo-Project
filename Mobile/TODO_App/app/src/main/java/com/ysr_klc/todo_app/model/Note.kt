package com.ysr_klc.todo_app.model

import com.google.gson.annotations.SerializedName

data class Note(
    @SerializedName("id") val id: Int,
    @SerializedName("user_id") val userId: Int,
    @SerializedName("category_id") val categoryId: Int?,
    @SerializedName("event_id") val eventId: Int?,

    @SerializedName("title") val title: String,
    @SerializedName("content") val content: String,

    @SerializedName("color_code") val colorCode: String?,
    @SerializedName("created_at") val createdAt: String?
)