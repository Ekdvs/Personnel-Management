
import {Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Personnel from './pages/Personnel'
import { Toaster } from 'react-hot-toast'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import ProjectMatching from './pages/ProjectMatching'
import Navbar from './components/Navbar'
import EditPersonnel from './pages/EditPersonnel'

function App() {


  return (
    <><Toaster position="top-right" />
      <div className='w-full'>
        <Navbar />
      <div className="">
        <Routes>
          <Route path="/" element={<Navigate to="/personnel" />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/personnel/edit/:id" element={<EditPersonnel />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/matching" element={<ProjectMatching />} />
           
        </Routes>
      </div>
      </div>
    </>
  )
}

export default App
