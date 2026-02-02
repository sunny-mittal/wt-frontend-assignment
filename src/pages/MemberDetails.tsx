import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { ApiClient } from "../api/client"
import { MemberForm } from "../components/MemberForm"
import { Box, CircularProgress } from "@mui/material"

export function MemberDetails() {
  const { id } = useParams<{ id: string }>()

  const { data: member, isLoading } = useQuery({
    queryKey: ["member", id],
    queryFn: () => ApiClient.fetchMember(id!),
  })

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  return <MemberForm initial={member} />
}
