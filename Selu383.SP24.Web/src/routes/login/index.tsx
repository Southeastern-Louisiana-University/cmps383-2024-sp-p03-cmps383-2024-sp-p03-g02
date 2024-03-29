import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { Button, Card } from 'react-bootstrap'
import { useNavigate } from "react-router-dom"
import '../../styles/login.css';


interface UserDto {
	userName?: string;
	id?: number;
}



export default function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<UserDto | null>(null);
    const navigate = useNavigate();

    function handleUserNameChange(e: ChangeEvent<HTMLInputElement>){
        setUsername(e.target.value);
      }

      function handlePasswordChange(e: ChangeEvent<HTMLInputElement>){
        setPassword(e.target.value);
      }
      
      function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        fetch("/api/authentication/login", {
            method: 'POST',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify({
                userName: username,
                password: password,
            })
        }).then(async x => {
            const userResp = await x.json();
            if(x.status == 200){
              setUser(userResp);
              navigate('/');
              window.location.reload();
            }
        });
        
    }
    
      useEffect(() => {
        fetch("/api/authentication/me").then(async (x) =>{
          x.json().then((userResp) => setUser(userResp))
        });
      }, [])

    return(
    <>
    {user !== null ? <div></div>  :
    <div className="userMenu">
    <Card style={{ width: '18rem',}}>
        <Card.Header style={{ backgroundColor: '#FDBA74' }}>
            Login
        </Card.Header>
        <Card.Body>
        <form action="/api/authentication/login" method="POST" style ={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
            <label htmlFor='username'>Username</label>
            <input type = "text" name = "username" id = "username" value = {username} onChange = {handleUserNameChange}/>
            <label htmlFor='password'>Password</label>
            <input type = "password" name = "password" id = "password" value = {password} onChange = {handlePasswordChange}/>
            <br/>
            <div className="button-container">
                <Button style={{ backgroundColor: '#FDBA74' }} type="submit">Log In</Button>
                <Button onClick={() => navigate('/register')} variant="secondary">Sign Up</Button>
            </div>
        </form>
      </Card.Body>
  </Card>
  </div>
}
    </>
    )
}