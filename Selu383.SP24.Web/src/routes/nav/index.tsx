import { Link, Outlet } from "react-router-dom"
import { useState, useEffect } from 'react'
import { Button, Navbar } from 'react-bootstrap'


interface UserDto {
	userName?: string;
	id?: number;
}

export default function NavbarLayout(){
    const [user, setUser] = useState<UserDto | null>(null);

    function handleSignout(){
        return fetch("/api/authentication/logout",{method: "POST"}).then(async () => setUser(null));
        }
    
        useEffect(() => {
            fetch("/api/authentication/me").then(async (x) =>{
              x.json().then((userResp) => setUser(userResp))
            });
          }, [])

    return(
        <>
            <>
            <Navbar className="navbar navbar-light bg-light">
            <Link to={'/'}><span style={{ color: '#FDBA74' }} className="navbar-brand mb-0 h1">EnStay</span></Link>
                 <ul className="navbar-nav ml-auto"> 
                    <li className="nav-item"> 
                    {user !== null ? <div><Button style={{ backgroundColor: '#FDBA74' }} className="btn-light" onClick = {handleSignout}>Logout</Button></div>  : 
                        <div>
                            <Link to={'/Login'}><Button style={{ backgroundColor: '#FDBA74' }} className="btn-light">Login</Button></Link>
                        </div>
                    }
                    </li> 
                 </ul>
            </Navbar>
            
            <Outlet /></>
        </> 
    )
}

