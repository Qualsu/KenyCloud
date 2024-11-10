import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileTypes = v.union(
  v.literal("image"), 
  v.literal("imageother"),
  v.literal("table"),
  v.literal("txt"),
  v.literal("presentation"),
  v.literal("pptx"),
  v.literal("video"),
  v.literal("audio"),
  v.literal("programming"),
  v.literal("exe"),
  v.literal("db"),
)

export const roles = v.union(v.literal("admin"), v.literal("member"))

export default defineSchema({
  files: defineTable({ 
    name: v.string(), 
    orgId: v.string(),
    type: fileTypes,
    fileId: v.id("_storage"),
    userId: v.id("users"),
    shouldDelete: v.optional(v.boolean()),
    linkId: v.optional(v.string())
  }).index("by_orgId", ["orgId"])
    .index("by_shouldDelete", ["shouldDelete"]),

  favorites: defineTable({
    fileId: v.id("files"),
    orgId: v.string(),
    userId: v.id("users")
  }).index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),

  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    orgIds: v.array(v.object({
      orgId: v.string(),
      role: roles
    })),
  }).index("by_tokenIdentifier", ["tokenIdentifier"])
});