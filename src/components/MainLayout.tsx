import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material"
import { Outlet } from "react-router-dom"

export function MainLayout() {
  return (
    <Box maxHeight="100vh" overflow="scroll" pb={4}>
      <AppBar position="static">
        <Toolbar>
          <Typography>Members Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Outlet />
      </Container>
    </Box>
  )
}
