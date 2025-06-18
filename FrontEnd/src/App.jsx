import { React, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbarcomponent from './Components/Navbarcomponent';
import Loginpage from './Components/User/Loginpage';
import Createaccountpage from './Components/User/Createaccountpage';
import HomeLandingpage from './Components/User/HomeLandingpage';
import Sidebar from './Components/Sidebar';
import Admindashboard from './Components/Admin/Admindashboard';
import Adminuserdetails from './Components/Admin/Adminuserdetails';
import Adminblogdetails from './Components/Admin/Adminblogdetails';
import Adminsettings from './Components/Admin/Adminsettings';
import Myblogspage from './Components/User/Myblogspage';
import Favoritespage from './Components/User/Favoritespage';
import Addblogspage from './Components/User/Addblogspage';
import ProfilePage from './Components/User/Profilepage';
import Blogdetailpage from './Components/User/Blogdetailspage';
import Editaddedblogs from './Components/User/Editaddedblogs';
import Adminuserblogexpansion from './Components/Admin/Adminuserblogexpansion';



function App() {
 const [searchTerm, setSearchTerm] = useState("");

  return (
    <BrowserRouter>


      <Routes>
         <Route path='/' element={<Loginpage/>}></Route> 
        <Route path='/loginpage' element={<Loginpage/>}></Route>
        <Route path='/signup' element={<Createaccountpage/>}></Route>
<Route
  path="/homelanding"
  element={
    <>
      <Navbarcomponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <HomeLandingpage searchTerm={searchTerm} />
    </>
  }
/>
         <Route path='/myblogs' element={[<Myblogspage/>]}></Route>
        <Route path='/addblogs' element={[<Addblogspage/>]}></Route>
        <Route path='/favorites' element={[<Favoritespage/>]}></Route>
        <Route path='/profile/:id' element={[<ProfilePage/>]}></Route>
        <Route path='/blog/:id' element={[<Blogdetailpage/>]}></Route>
        <Route path='/editOwnBlog/:id' element={[<Editaddedblogs/>]}></Route>


 

        <Route path='/admindashboard' element={[<Admindashboard/>]}></Route>
        <Route path='/adminuserdetails' element={[<Adminuserdetails/>]}></Route>
        <Route path='/adminblogdetails' element={[<Adminblogdetails/>]}></Route>
        <Route path='/adminsettings' element={[<Sidebar/>,<Adminsettings/>]}></Route>
        <Route path='/adminuserblogdetails/:id' element={[<Adminuserblogexpansion/>]}></Route>
      </Routes>

    </BrowserRouter>
  )
}

export default App
