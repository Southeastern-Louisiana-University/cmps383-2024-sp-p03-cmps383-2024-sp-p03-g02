import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Button, Navbar } from 'react-bootstrap';

interface UserDto {
    userName?: string;
    id?: number;
}

export default function NavbarLayout() {
    const [user, setUser] = useState<UserDto | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    function handleSignout() {
        return fetch("/api/authentication/logout", { method: "POST" })
            .then(async () => setUser(null));
    }

    useEffect(() => {
        fetch("/api/authentication/me").then(async (x) => {
            x.json().then((userResp) => setUser(userResp));
        });
    }, []);

    return (
        <>
            <Navbar className="navbar navbar-light bg-light">

            <Link to={'/'}><span style={{ color: '#FDBA74' }} className="navbar-brand mb-0 h1">EnStay</span></Link>
            
            <Link to={'/Hotels'}><Button style={{ border: "1px solid black"} } className="btn-light">Hotels</Button></Link>
            <div className="d-flex justify-content-center align-items-center flex-grow-1">
                
                <input id="search" name="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value ?? "")} className="form-control mx-2" style={{ maxWidth: '300px' }} />
                
                <Link
                    onClick={(e) => (!searchTerm ? e.preventDefault() : null)}
                    to={`/find-hotel?searchTerm=${encodeURIComponent(searchTerm)}&start=now`}
                    aria-disabled={!searchTerm}
                >
                    <Button style={{ backgroundColor: '#FDBA74'}} className="btn-light">Search</Button>
                </Link>

                <div className="d-flex justify-content-center align-items-center flex-grow-1">
                    <input
                        id="search"
                        name="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value ?? "")}
                        className="form-control mx-2"
                        style={{ maxWidth: '300px' }}
                    />
                    <Link
                        onClick={(e) => (!searchTerm ? e.preventDefault() : null)}
                        to={`/find-hotel?searchTerm=${encodeURIComponent(searchTerm)}&start=now`}
                        aria-disabled={!searchTerm}
                    >
                        <Button style={{ backgroundColor: "#FDBA74", color: "#FFFFFF" }} className="btn-light">Search</Button>
                    </Link>
                </div>

                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        {user !== null ? (
                            <div>
                                <Link to={'/userbooking'}>
                                    <Button style={{ backgroundColor: '#FDBA74', color: "#FFFFFF" }} className="btn-light">Bookings</Button>
                                </Link>
                                <Button style={{ backgroundColor: '#FDBA74', color: "#FFFFFF" }} className="btn-light" onClick={handleSignout}>Logout</Button>
                            </div>
                        ) : (
                            <div>
                                <Link to={'/Login'}>
                                    <Button style={{ backgroundColor: '#FDBA74', color: "#FFFFFF" }} className="btn-light">Login</Button>
                                </Link>
                            </div>
                        )}
                    </li>
                </ul>
            </Navbar>

            <Outlet />
        </>
    );
}
