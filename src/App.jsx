import HomePage from './homePage.jsx'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Survey from './survey.jsx';
import DashBoard from './dashBoard.jsx';
import Diary from './diary.jsx';
import Missions from './missions.jsx';
import Ranking from './ranking.jsx';
import Coach from './coach.jsx';
import Achievement from './Achievement.jsx';
import ServicePackage from './ServicePackage.jsx';
import Login from './login.jsx';
import PrivateRoute from './PrivateRoute.jsx';

import Blog from './Blog.jsx';
import ArticleDetail from './ArticleDetail.jsx';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/survey' element={
            
              <Survey />
            
          } />
          <Route path='/' element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } />
          <Route path='/dashboard' element={
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          } />
          <Route path='diary' element={
            <PrivateRoute>
              <Diary />
            </PrivateRoute>
          } />
          <Route path='missions' element={
            <PrivateRoute>
            <Missions />
          </PrivateRoute>} />
          <Route path='ranking' element={
            <PrivateRoute>
              <Ranking />
            </PrivateRoute>
          } />
          <Route path='achievement' element={
            <PrivateRoute>
              <Achievement />
            </PrivateRoute>
          } />
          <Route path='service-package' element={
            <PrivateRoute>
              <ServicePackage />
            </PrivateRoute>
          } />
          <Route path='coach' element={
            <PrivateRoute>
              <Coach />
            </PrivateRoute>
          } />
          <Route path='login' element={<Login />} />
          {/* Cấu trúc route cho Blog */}
          <Route path='blog' element={
            <PrivateRoute>
              <Blog />
            </PrivateRoute>
          } />
          <Route path='blog/:slug' element={
            <PrivateRoute>
              <ArticleDetail />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
