import styled from "styled-components"
import { Container } from "@mui/material"
import { MembersList } from "../components/MembersList"

const StyledContainer = styled(Container)`
  min-height: 100vh;
  margin-top: 16px;
`

export const Home = () => {
  return (
    <StyledContainer maxWidth="md">
      <MembersList />
    </StyledContainer>
  )
}
