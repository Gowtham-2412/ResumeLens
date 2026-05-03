import React from 'react'
import LandingPage from './pages/LandingPage'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import MainPage from './pages/UserSite/MainPage'
import AnalysisPage from './pages/UserSite/AnalysisPage'
import HistoryPage from './pages/UserSite/HistoryPage'
import OAuthSuccessPage from './pages/OAuthSuccessPage'

const App = () => {
  return (
    <div className='min-h-screen bg-app-background text-text-primary'>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/oauth-success' element={<OAuthSuccessPage/>} />
        <Route element={<ProtectedRoute/>}>
          <Route path='/:id' element={<MainPage/>} />
          <Route path='/analyze' element={<AnalysisPage/>}/>
          <Route path='/history' element={<HistoryPage/>}/>
        </Route>

      </Routes>
    </div>
  )
}

export default App
