import { db } from "./index";
import { user, roles } from "./auth-schema";
import { auth } from "@/utils/auth";
import { eq } from "drizzle-orm";
import "dotenv/config";

const seedData = {
  roles: [
    {
      id: "role_1",
      name: "superAdmin" as const,
      description: "Super administrator with full access",
    },
    {
      id: "role_2",
      name: "supervisor" as const,
      description: "Supervisor with management access",
    },
    {
      id: "role_3",
      name: "technician" as const,
      description: "Technical user with limited access",
    },
  ],
  users: [
    {
      email: "superadmin@example.com",
      name: "Super Administrator",
      password: "SuperAdmin123!",
      roleId: "role_1",
    },
    {
      email: "supervisor@example.com",
      name: "Supervisor User",
      password: "Supervisor123!",
      roleId: "role_2",
    },
    {
      email: "technician@example.com",
      name: "Technical User",
      password: "Technical123!",
      roleId: "role_3",
    },
  ],
};

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Insert roles first
    console.log("📝 Inserting roles...");
    for (const roleData of seedData.roles) {
      await db.insert(roles).values(roleData).onConflictDoNothing();
    }
    console.log("✅ Roles inserted successfully");

    // Create users with hashed passwords using Better Auth
    console.log("👥 Creating users...");
    for (const userData of seedData.users) {
      try {
        // Check if user already exists
        const existingUser = await db.select().from(user).where(eq(user.email, userData.email)).limit(1);

        if (existingUser.length === 0) {
          // Use Better Auth to create user with hashed password
          await auth.api.signUpEmail({
            body: {
              email: userData.email,
              password: userData.password,
              name: userData.name,
            },
          });

          // Update the user role since Better Auth creates with default role
          await db.update(user)
            .set({ roleId: userData.roleId })
            .where(eq(user.email, userData.email));

          console.log(`✅ User created: ${userData.email} (${userData.roleId})`);
        } else {
          console.log(`⏭️  User already exists: ${userData.email}`);
        }
      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error);
      }
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Created users:");
    console.log("- superadmin@example.com (password: SuperAdmin123!)");
    console.log("- supervisor@example.com (password: Supervisor123!)");
    console.log("- technician@example.com (password: Technical123!)");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log("✅ Seeding process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding process failed:", error);
      process.exit(1);
    });
}

export { seed };
