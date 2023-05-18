import React from 'react'
import WeekDates from './Dates'
import TodoList from './Todos'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import Auth from './Auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './FirebaseConfig';
import TodoFinalComp from './TodoFinalComp';

function App() {
  const [user, loading, error] = useAuthState(auth);
  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }
  if (user) {
    const userData = {
      userName: user.displayName,
      userEmail: user.email,
      userUrl: user.photoURL,
      userId: user.uid
    }
    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div>
          <TodoFinalComp user={userData} />
        </div>
      </LocalizationProvider>
    );
  }
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div>

        <Auth />
      </div>
    </LocalizationProvider>
  )
}

export default App