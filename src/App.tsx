import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'

// route-level code splitting keeps the initial bundle small
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Discover = lazy(() => import('./pages/Discover'))
const Detail = lazy(() => import('./pages/Detail'))
const Tracker = lazy(() => import('./pages/Tracker'))
const Deadlines = lazy(() => import('./pages/Deadlines'))
const Profile = lazy(() => import('./pages/Profile'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="discover" element={<Discover />} />
        <Route path="s/:id" element={<Detail />} />
        <Route path="tracker" element={<Tracker />} />
        <Route path="deadlines" element={<Deadlines />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}
