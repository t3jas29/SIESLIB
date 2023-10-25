import { useState, forwardRef } from "react"
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material"
import "./style.css"
import { useNavigate } from "react-router-dom"


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const RegisterDialog = ({ open, handleClose, handleSubmit }) => {
    const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = (event) => {
    event.preventDefault()
    console.log(username, password)
    handleSubmit(username, password)
  }

  const handleEnterKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmit(event)
    }
  }

  return (
    <div className="login-div">
      <center>
        <img src={require("../../assets/img/sies.png")} alt="sies" width="150" />
      </center>
      <center>
        <h1>Register</h1>
      </center>
      <TextField
        autoFocus
        margin="dense"
        id="username"
        label="Username"
        type="text"
        fullWidth
        variant="standard"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        margin="dense"
        id="password"
        label="Password"
        type="password"
        fullWidth
        variant="standard"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    <div style={{marginTop :  "10px", fontSize: "15px"}}><span className="register-text" onClick={()=>{
        navigate('/login')
      }}>Click Here to Login</span></div>
       
      <div className="action-buttons">
      <Button variant="contained" className="button-login" type="submit" onClick={onSubmit}>
        Register
      </Button>
      </div>
    </div>
  )
}
