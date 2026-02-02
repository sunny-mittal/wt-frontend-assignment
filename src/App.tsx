import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { MainLayout } from "./components/MainLayout"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { Home } from "./pages/Home"
import { CreateMember } from "./pages/CreateMember"
import { MemberDetails } from "./pages/MemberDetails"

const client = new QueryClient()

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/members/new" element={<CreateMember />} />
              <Route path="/members/:id" element={<MemberDetails />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
