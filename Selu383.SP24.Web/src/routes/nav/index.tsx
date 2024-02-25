import { Link, Outlet } from "react-router-dom"
import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { Button, Navbar } from 'react-bootstrap'


interface UserDto {
	userName?: string;
	id?: number;
}

export default function NavbarLayout(){
    const [user, setUser] = useState<UserDto | null>(null);

    function handleSignout(){
        return fetch("/api/authentication/logout",{method: "POST"}).then(async x => setUser(null));
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
                <span className="navbar-brand mb-0 h1">Enstay</span>
                 <ul className="navbar-nav ml-auto"> 
                    <li className="nav-item"> 
                    {user !== null ? <div><Button className="btn-light" onClick = {handleSignout}>Logout</Button></div>  : 
                        <div>
                            <Link to={'/Login'}><Button className="btn-light">Login</Button></Link>
                        </div>
                    }
                    </li> 
                 </ul>
            </Navbar>
            
            <Outlet /></>
        </> 
    )
}

