import React, { useState } from 'react';

import TodoList from './Todos';

function WeekDates({CDate, setCDate}) {
    const [startDate, setStartDate] = useState(getStartDate());
    const days = ["M", "T", "W", "T", "F", "S", "S"]

    // Function to get the start date (Monday) of the current week
    function getStartDate() {
        const today = new Date();
        const currentDayOfWeek = today.getDay(); // Get the current day of the week (0 - Sunday, 1 - Monday, ..., 6 - Saturday)

        // Calculate the number of days to subtract or add to the current date to get to Monday
        const daysToAdd = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

        // Set the date to Monday of the current week
        const monday = new Date(today);
        monday.setDate(today.getDate() + daysToAdd);

        return monday;
    }

    // Function to navigate to the next week
    function goToNextWeek() {
        const nextMonday = new Date(startDate);
        nextMonday.setDate(startDate.getDate() + 7);
        setStartDate(nextMonday);
    }

    // Function to navigate to the previous week
    function goToPreviousWeek() {
        const previousMonday = new Date(startDate);
        previousMonday.setDate(startDate.getDate() - 7);
        setStartDate(previousMonday);
    }

    function goToCurrentWeek() {
        setStartDate(getStartDate());
    }

    function getCurrentMonthAndYear() {
        const options = { month: 'long', year: 'numeric' };
        return startDate.toLocaleDateString(undefined, options);
    }

    // Function to get the dates for the current week (Monday to Sunday)
    function getWeekDates() {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(date.toDateString());
        }
        return dates;
    }

    return (
        <div style={{
            width: "80vw",
            display: "flex",
            flexDirection: "column"
        }} class="h-auto  w-96 bg-white rounded-lg p-4">
            <div class="mt-3 text-sm text-[#8ea6c8] flex justify-between items-center">
                <p class="set_date">{getCurrentMonthAndYear()}</p>

            </div>
            <p class="text-xl font-semibold mt-2 text-[#063c76]">To-do List</p>
            <div style={{display:"flex" , gap:10}}>
                <button onClick={goToPreviousWeek}>Previous Week</button>
                <button onClick={goToCurrentWeek}>Current Week</button>
                <button onClick={goToNextWeek}>Next Week</button>
            </div>
            <div style={{
                display: "flex",
                alignItems: "center"
            }} class="w-full mt-4 flex text-sm flex-col text-center justify-center ">
                <div style={{ width: "40vw" }}>
                    <div class=" px-[15px] flex justify-between text-center items-center">
                        {
                            days.map((item, index) => <p style={{ color: "darkblue" }} key={index} onClick={(e) => console.log(item)}>{item}</p>)
                        }
                    </div>

                    <div class="w-full pl-1 flex justify-between text-center items-center">
                        {getWeekDates().map((date) => (
                            <span onClick={(e) => setCDate(date)} key={date} class="h-7 w-7 rounded-full cursor-pointer transition-all hover:bg-[#fe0] hover:text-black bg-white flex justify-center items-center"><p style={{ color: "black" }}>{new Date(date).getDate()}</p></span>

                        ))}
                    </div>
                </div>
            </div>

        </div>


    );
}

export default WeekDates;