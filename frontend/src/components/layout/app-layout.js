import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material"
import { useUser } from "../../context/user-context"
import { Route, Routes, Navigate, Link } from "react-router-dom"
import AdbIcon from "@mui/icons-material/Adb"
import { BooksList } from "../books-list/books-list"
import { LoginDialog } from "../login/login-dialog"
import { BookForm } from "../book-form/book-form"
import { Book } from "../book/book"
import { WithLoginProtector } from "../access-control/login-protector"
import { WithAdminProtector } from "../access-control/admin-protector"
import { RegisterDialog } from "../register/regsiter-dialog"

export const AppLayout = () => {
  const [openLoginDialog, setOpenLoginDialog] = useState(false)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const { user, loginUser, registerUser, logoutUser, isAdmin, isUser } = useUser()
  const navigate = useNavigate()

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleLoginSubmit = (username, password) => {
    loginUser(username, password)
    setOpenLoginDialog(false)
  }

  const handleRegisterSubmit = (username, password) => {
    registerUser(username, password)
    setOpenLoginDialog(false)
  }

  const handleLoginClose = () => {
    setOpenLoginDialog(false)
  }

  const handleLogout = () => {
    logoutUser()
    handleCloseUserMenu()
  }

  useEffect(() => {
    if (!user) {
      navigate("/")
    } else if (isAdmin) {
      navigate("/books")
    }else if (isUser){
      navigate("/books")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin])

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link to="/" style={{ textDecoration: "none", flexGrow: 1 }}>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: "flex",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "white",
                }}
              >
                Library Management System
              </Typography>
            </Link>
            <Box
              sx={{
                flexGrow: 0,
              }}
            >
              {user ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar> {user.username.charAt(0).toUpperCase()} </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                ""
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Routes>
        <Route path="/books" exact element={<BooksList />} />
        <Route
          path="/register"
          element={
            <RegisterDialog
              open={openLoginDialog}
              handleSubmit={handleRegisterSubmit}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginDialog
              open={openLoginDialog}
              handleSubmit={handleLoginSubmit}
            />
          }
        />
        <Route
          path="/books/:bookIsbn"
          element={
            <WithLoginProtector>
              <Book />
            </WithLoginProtector>
          }
        />
        <Route
          path="/admin/books/add"
          element={
            <WithLoginProtector>
              <WithAdminProtector>
                <BookForm />
              </WithAdminProtector>
            </WithLoginProtector>
          }
          exact
        />
        <Route
          path="/admin/books/:bookIsbn/edit"
          element={
            <WithLoginProtector>
              <WithAdminProtector>
                <BookForm />
              </WithAdminProtector>
            </WithLoginProtector>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}
