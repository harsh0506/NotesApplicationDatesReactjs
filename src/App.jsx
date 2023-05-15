import React from 'react'
import WeekDates from './Dates'
import TodoList from './Todos'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div>
        {/*<WeekDates />*/}
        <TodoList />
      </div>
    </LocalizationProvider>
  )
}

export default App