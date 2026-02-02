import type { Member } from "../api/types"

export function getInitials(member: Member) {
  return `${member.firstName[0]}${member.lastName[0]}`.toUpperCase()
}

export function getFullName(member: Member) {
  return `${member.firstName} ${member.lastName}`
}
