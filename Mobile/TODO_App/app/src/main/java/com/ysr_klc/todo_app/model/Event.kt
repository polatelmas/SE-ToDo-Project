package com.ysr_klc.todo_app.model

import com.google.gson.annotations.SerializedName

data class Event(
    @SerializedName("id") val id: Int,
    @SerializedName("user_id") val userId: Int,
    @SerializedName("title") val title: String,

    @SerializedName("start_time") val startTime: String,
    @SerializedName("end_time") val endTime: String,

    @SerializedName("location") val location: String?,
    @SerializedName("color_code") val colorCode: String?
)


data class CreateUpdateEvent(
    @SerializedName("user_id") val userId: Int,
    @SerializedName("title") val title: String,

    @SerializedName("start_time") val startTime: String,
    @SerializedName("end_time") val endTime: String,

    @SerializedName("location") val location: String?,
    @SerializedName("color_code") val colorCode: String?
)