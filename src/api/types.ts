import { z } from "zod"

export const CreateMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().regex(/\d{4}-\d{2}-\d{2}/),
  sex: z.enum(["male", "female", "other"]),
  status: z.enum(["ACTIVE", "PAUSED"]),
})

export type CreateMemberDTO = z.infer<typeof CreateMemberSchema>

export const UpdateMemberSchema = CreateMemberSchema.partial().refine((obj) => {
  return Object.values(obj).some((value) => value !== undefined)
})

export type UpdateMemberDTO = z.infer<typeof UpdateMemberSchema>

export const MemberSchema = CreateMemberSchema.extend({
  id: z.string(),
  photoUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Member = z.infer<typeof MemberSchema>

export type PaginationResult<T> = {
  data: T[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type ApiError = {
  error: string
}
