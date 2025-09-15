import { withRoleAuth } from "@/lib/auth-utils";

// Example: API route that requires supervisor role or higher
async function handler(request: Request, { user }: any) {
  return Response.json({
    message: "This is a protected route",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}

export const GET = withRoleAuth("supervisor")(handler);

// Example: API route that requires super admin
async function adminHandler(request: Request, { user }: any) {
  return Response.json({
    message: "Super admin only content",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}

export const POST = withRoleAuth("superAdmin")(adminHandler);