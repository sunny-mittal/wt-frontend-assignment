import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
} from "@mui/material"
import {
  CreateMemberSchema,
  UpdateMemberSchema,
  type CreateMemberDTO,
  type Member,
  type UpdateMemberDTO,
} from "../api/types"
import { useForm, Controller } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ApiClient } from "../api/client"
import React, { useState } from "react"
import { getFullName } from "../utils/string"
import { useSnackbar } from "notistack"
import { zodResolver } from "@hookform/resolvers/zod"

type Props = {
  initial?: Member
}

export function MemberForm({ initial }: Props) {
  const navigate = useNavigate()
  const client = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const isEdit = !!initial
  const { control, handleSubmit, formState } = useForm<
    CreateMemberDTO | UpdateMemberDTO
  >({
    mode: "onTouched",
    defaultValues: {
      firstName: initial?.firstName ?? "",
      lastName: initial?.lastName ?? "",
      dateOfBirth: initial?.dateOfBirth ?? "",
      sex: initial?.sex ?? "male",
      status: initial?.status ?? "ACTIVE",
    },
    resolver: zodResolver(isEdit ? UpdateMemberSchema : CreateMemberSchema),
  })

  const updateMutation = useMutation({
    mutationFn(data: { id: string; member: UpdateMemberDTO }) {
      return ApiClient.updateMember(data.id, data.member)
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["member", initial!.id] })
      client.invalidateQueries({ queryKey: ["members"] })
      enqueueSnackbar("Member updated successfully!", { variant: "success" })
      navigate("/")
    },
    onError() {
      enqueueSnackbar("Unable to update member, please try again", {
        variant: "error",
      })
    },
  })

  const createMutation = useMutation({
    mutationFn(data: CreateMemberDTO) {
      return ApiClient.createMember(data)
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["members"] })
      enqueueSnackbar("Member created successfully!", { variant: "success" })
      navigate("/")
    },
    onError() {
      enqueueSnackbar("Unable to create member, please try again", {
        variant: "error",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn(id: string) {
      return ApiClient.deleteMember(id)
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["members"] })
      enqueueSnackbar("Member deleted successfully!", { variant: "error" })
      navigate("/")
    },
    onError() {
      enqueueSnackbar("Unable to delete member, please try again", {
        variant: "error",
      })
    },
  })

  const upsertFunction = handleSubmit((values) => {
    if (initial) {
      return updateMutation.mutate({ id: initial.id, member: values })
    }

    return createMutation.mutate(values as CreateMemberDTO)
  })

  const uploadMemberPhoto = useMutation({
    mutationFn(data: { memberId: string; file: File }) {
      return ApiClient.uploadMemberPhoto(data.memberId, data.file)
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["member", initial!.id] })
      enqueueSnackbar("Photo updated successfully!", { variant: "success" })
    },
    onError() {
      enqueueSnackbar(
        "Unable to upload photo, please check that the size is below 3 MB",
        { variant: "error" },
      )
    },
  })

  const onUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      uploadMemberPhoto.mutate({
        file: e.target.files[0],
        memberId: initial!.id,
      })
    }
  }

  const canSave = formState.isDirty && formState.isValid

  return (
    <>
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

        {isEdit && (
          <Stack direction="column" spacing={2} alignItems="center" mb={4}>
            <Avatar
              src={initial.photoUrl ?? undefined}
              sx={{ width: 100, height: 100 }}
            />
            <Button component="label">
              Upload Photo
              <input
                hidden
                type="file"
                accept="image/png,image/webp,image/jpeg"
                onChange={onUploadPhoto}
              />
            </Button>
          </Stack>
        )}

        <Box onSubmit={upsertFunction} component="form" minWidth={640}>
          <Stack direction="column" spacing={3}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => {
                  return (
                    <TextField
                      fullWidth
                      {...field}
                      label="First Name"
                      required
                    />
                  )
                }}
              />
              <Controller
                control={control}
                name="lastName"
                render={({ field }) => {
                  return (
                    <TextField
                      fullWidth
                      {...field}
                      label="Last Name"
                      required
                    />
                  )
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
            {isEdit && (
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="contained"
                color="error"
              >
                Delete Member
              </Button>
            )}
            <Button
              disabled={!canSave}
              type="submit"
              variant="contained"
              color="primary"
            >
              {initial ? "Update" : "Create"} Member
            </Button>
          </Box>
        </Box>
      </Box>
      {isEdit && (
        <Dialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        >
          <DialogTitle>Delete {getFullName(initial)}?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Deletion is irreversible. Make sure this is what you want to do!
            </DialogContentText>
            <DialogActions>
              <Button
                color="secondary"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteMutation.mutate(initial.id)
                }}
                color="primary"
              >
                Confirm
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
