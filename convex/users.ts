import { ConvexError, v } from "convex/values";
import { internalMutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { roles } from "./schema";

export async function getUser(ctx: QueryCtx | MutationCtx, tokenIdentifier: string){

    const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", q => 
        q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first()

    if(!user){
        throw new ConvexError("user should have been defined")
    }

    return user
}

export const createUser = internalMutation({
    args: { tokenIdentifier: v.string(), name: v.string(), image: v.string() },
    async handler(ctx, args){
        console.log("Creating user with args:", args);
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            orgIds: [],
            name: args.name,
            image: args.image
        })
        console.log("User created successfully");
    }
})

export const updateUser = internalMutation({
    args: { tokenIdentifier: v.string(), name: v.string(), image: v.string() },
    async handler(ctx, args){
        const user = await ctx.db.query("users").withIndex("by_tokenIdentifier", 
            q => q.eq("tokenIdentifier", args.tokenIdentifier)
        ).first()

        if(!user){
            throw new ConvexError("no user with this token found")
        }

        await ctx.db.patch(user._id, {
            name: args.name,
            image: args.image
        })
    }
})

export const addOrgIdToUser = internalMutation({
    args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
    async handler(ctx, args){
        const user = await getUser(ctx, args.tokenIdentifier)
        
        await ctx.db.patch(user._id, {
            orgIds: [...user.orgIds, {orgId: args.orgId, role: args.role}]
        })
    }
})

export const updateRoleInOrgForUser = internalMutation({
    args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
    async handler(ctx, args){
        const user = await getUser(ctx, args.tokenIdentifier)
        const org = user.orgIds.find(org => org.orgId === args.orgId)

        if(!org){
            throw new ConvexError("expected an org on the user but was not found when updating")
        }
        org.role = args.role
        
        await ctx.db.patch(user._id, {
            orgIds: user.orgIds
        })
    }
})

export const getUserProfile = query({
    args: {userId: v.id("users")},
    async handler(ctx, args){
        const user = await ctx.db.get(args.userId)

        return {
            name: user?.name,
            image: user?.image
        }
    }
})

export const getMe = query({
    args: {},
    async handler(ctx, args){
        const identify = await ctx.auth.getUserIdentity()

        if(!identify) {
            throw new ConvexError("Вы должны быть авторизованы, чтобы загрузить файл!")
        }

        const user = await getUser(ctx, identify.tokenIdentifier)

        if(!user) return null

        return user
    }
})