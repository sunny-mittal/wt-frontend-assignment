import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ApiClient } from "../api/client"
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Box,
  Typography,
  Button,
  Chip,
  capitalize,
  Pagination,
} from "@mui/material"
import { getFullName, getInitials } from "../utils/string"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"

export function MembersList() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ["members", page, limit],
    queryFn() {
      return ApiClient.fetchMembers(page, limit)
    },
  })

  return (
    <Box>
      <Box sx={{ justifyContent: "space-between", display: "flex", my: 4 }}>
        <Typography variant="h5" color="primary">
          Members
        </Typography>
        <Button variant="contained">Add Member</Button>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Sex</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((member) => {
              const dateOfBirth = new Date(member.dateOfBirth)
              dateOfBirth.setDate(dateOfBirth.getDate() + 1)
              const isActive = member.status === "ACTIVE"
              return (
                <TableRow
                  key={member.id}
                  component="a"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  href={`/members/${member.id}`}
                >
                  <TableCell>
                    <Avatar
                      src={member.photoUrl ?? undefined}
                      alt={member.firstName}
                    >
                      {getInitials(member)}
                    </Avatar>
                  </TableCell>
                  <TableCell>{getFullName(member)}</TableCell>
                  <TableCell>{format(dateOfBirth, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{capitalize(member.sex)}</TableCell>
                  <TableCell>
                    <Chip
                      label={isActive ? "Active" : "Paused"}
                      variant={isActive ? "filled" : "outlined"}
                      color={isActive ? "primary" : undefined}
                    ></Chip>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 1, justifyContent: "center", display: "flex" }}>
        <Pagination
          count={data?.totalPages ?? 1}
          color="primary"
          page={data?.page ?? 1}
          onChange={(_e, page) => setPage(page)}
        />
      </Box>
    </Box>
  )
}
