package com.ysr_klc.todo_app.todoService

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory


class TodoAPISerivce {

    val retrofit = Retrofit.Builder().
            baseUrl("http://10.0.2.2:8000/").
            addConverterFactory(GsonConverterFactory.create()).
            build().
            create(TodoAPI::class.java)


}