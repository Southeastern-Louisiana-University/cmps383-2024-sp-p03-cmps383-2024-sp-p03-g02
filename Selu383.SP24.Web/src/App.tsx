import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface UserDto {
	userName?: string;
	id?: number;
}


function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<UserDto | null>(null);

  function handleUserNameChange(e: ChangeEvent<HTMLInputElement>){
    setUsername(e.target.value);
  }

  function handleSignout(){
    return fetch("/api/authentication/logout",{method: "POST"}).then(async () => setUser(null));
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
        setUser(userResp);
    });
}

  useEffect(() => {
    fetch("/api/authentication/me").then(async (x) =>{
      x.json().then((userResp) => setUser(userResp))
    });
  }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {user !== null ? <div>Hello {user.userName}<button onClick = {handleSignout}>Logout</button></div>  :
      <div className="card">
        <form action="/api/authentication/login" method="POST" 
        style ={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
          <label htmlFor='username'>Username</label>
          <input type = "text" name = "username" id = "username" value = {username} onChange = {handleUserNameChange}/>
          <label htmlFor='password'>Password</label>
          <input type = "password" name = "password" id = "password" value = {password} onChange = {handlePasswordChange}/>
          <button type="submit">Log in</button>
        </form>
      </div>
}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}


export default App

