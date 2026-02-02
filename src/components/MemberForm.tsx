import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import {
  type CreateMemberDTO,
  type Member,
  type UpdateMemberDTO,
} from "../api/types"
import { useForm, Controller } from "react-hook-form"
import { useNavigate } from "react-router-dom"

type Props = {
  initial?: Member
  isEdit?: boolean
}

export function MemberForm({ initial, isEdit }: Props) {
  const navigate = useNavigate()
  const { control } = useForm<CreateMemberDTO | UpdateMemberDTO>({
    defaultValues: {
      firstName: initial?.firstName ?? "",
      lastName: initial?.lastName ?? "",
      dateOfBirth: initial?.dateOfBirth ?? "",
      sex: initial?.sex ?? "male",
      status: initial?.status ?? "ACTIVE",
    },
  })

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Box display="flex" justifyContent="space-between" minWidth={640}>
        <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
          {isEdit ? "Update" : "Create"} Member
        </Typography>
        <Button onClick={() => navigate("/")}>Back to List</Button>
      </Box>

      <Box component="form" minWidth={640}>
        <Stack direction="column" spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => {
                return <TextField fullWidth {...field} label="First Name" />
              }}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => {
                return <TextField fullWidth {...field} label="Last Name" />
              }}
            />
          </Stack>
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field }) => {
              return <TextField fullWidth {...field} type="date" />
            }}
          />
          <Controller
            control={control}
            name="sex"
            render={({ field }) => {
              return (
                <TextField {...field} select>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              )
            }}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => {
              return (
                <TextField {...field} select>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="PAUSED">Paused</MenuItem>
                </TextField>
              )
            }}
          />
        </Stack>
      </Box>
    </Box>
  )
}
