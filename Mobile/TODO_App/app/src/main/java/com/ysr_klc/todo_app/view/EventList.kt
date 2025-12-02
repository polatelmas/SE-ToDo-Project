package com.ysr_klc.todo_app.view

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.ysr_klc.todo_app.R
import com.ysr_klc.todo_app.model.LoginRequest
import com.ysr_klc.todo_app.model.RegisterRequest
import com.ysr_klc.todo_app.todoService.TodoAPI
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.await
import retrofit2.converter.gson.GsonConverterFactory

class EventList : Fragment() {

    private var param1: String? = null
    private var param2: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_event_list, container, false)
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val login : LoginRequest = LoginRequest( "user@example.com","string")


        val retrofit = Retrofit.Builder().
        baseUrl("http://10.0.2.2:8000/").
        addConverterFactory(GsonConverterFactory.create()).
        build().
        create(TodoAPI::class.java)

        CoroutineScope(Dispatchers.IO).launch {
            val task = retrofit.login(login)
            println(task.body())
            println("çalıştı mı?")


        }
    }

}