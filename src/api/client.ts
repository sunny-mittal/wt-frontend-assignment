import type {
  CreateMemberDTO,
  Member,
  PaginationResult,
  UpdateMemberDTO,
} from "./types"

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

const headers = {
  "Content-Type": "application/json",
  "X-Api-Key": API_KEY,
}

export const ApiClient = {
  async fetchMembers(page = 1, limit = 10): Promise<PaginationResult<Member>> {
    const response = await fetch(
      `${API_URL}/members?page=${page}&limit=${limit}`,
      {
        headers,
      },
    )
    return response.json()
  },
  async fetchMember(id: string): Promise<Member> {
    const response = await fetch(`${API_URL}/members/${id}`, {
      headers,
    })
    return response.json()
  },
  async createMember(data: CreateMemberDTO): Promise<Member> {
    const response = await fetch(`${API_URL}/members`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    return response.json()
  },
  async updateMember(id: string, data: UpdateMemberDTO): Promise<Member> {
    const response = await fetch(`${API_URL}/members/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    })

    return response.json()
  },
  async deleteMember(id: string) {
    await fetch(`${API_URL}/members/${id}`, {
      method: "DELETE",
      headers,
    })
  },
  async uploadMemberPhoto(id: string, file: File) {
    const formData = new FormData()
    formData.append("file", file)
    await fetch(`${API_URL}/members/${id}/photo`, {
      method: "PUT",
      headers: {
        "X-Api-Key": API_KEY,
      },
      body: formData,
    })
  },
}
