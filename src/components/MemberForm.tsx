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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ApiClient } from "../api/client"

type Props = {
  initial?: Member
}

export function MemberForm({ initial }: Props) {
  const navigate = useNavigate()
  const client = useQueryClient()
  const { control, handleSubmit } = useForm<CreateMemberDTO | UpdateMemberDTO>({
    defaultValues: {
      firstName: initial?.firstName ?? "",
      lastName: initial?.lastName ?? "",
      dateOfBirth: initial?.dateOfBirth ?? "",
      sex: initial?.sex ?? "male",
      status: initial?.status ?? "ACTIVE",
    },
  })

  const updateMutation = useMutation({
    mutationFn(data: { id: string; member: UpdateMemberDTO }) {
      return ApiClient.updateMember(data.id, data.member)
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["member", initial!.id] })
      client.invalidateQueries({ queryKey: ["members"] })
      navigate("/")
    },
    // onError() {},
  })

  const createMutation = useMutation({
    mutationFn(data: CreateMemberDTO) {
      return ApiClient.createMember(data)
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["members"] })
      navigate("/")
    },
    // onError() {},
  })

  const apiFunction = handleSubmit((values) => {
    if (initial) {
      return updateMutation.mutate({ id: initial.id, member: values })
    }

    return createMutation.mutate(values as CreateMemberDTO)
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
          {initial ? "Update" : "Create"} Member
        </Typography>
        <Button onClick={() => navigate("/")}>Back to List</Button>
      </Box>

      <Box onSubmit={apiFunction} component="form" minWidth={640}>
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
        <Box sx={{ mt: 2 }} display="flex" justifyContent="space-between">
          {!!initial && (
            <Button variant="contained" color="error">
              Delete Member
            </Button>
          )}
          <Button type="submit" variant="contained" color="primary">
            {initial ? "Update" : "Create"} Member
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
