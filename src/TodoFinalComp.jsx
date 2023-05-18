import React, { useState } from 'react';
import WeekDates from './Dates';
import TodoList from './Todos';

function TodoFinalComp({ user }) {
    const [CDate, setCDate] = useState()
    const { userName, userEmail, userUrl, userId } = user
    return (
        <div style={{ width: "100vw" }}>

            <div style={{ flexDirection: "column" }} class="flex justify-center items-center min-h-screen bg-[#cbd7e3]">
                <h2 style={{color:"#063c76" ,fontSize:30 ,  marginBottom:10}}>Hey {userName} , Welcome</h2>
                <WeekDates CDate={CDate} setCDate={setCDate} />
                <TodoList date={CDate} userId={userId} />
            </div>
        </div>
    )
}

export default TodoFinalComp