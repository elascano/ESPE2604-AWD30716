import "dotenv/config";
import prisma from "./db";

async function main() {
  const patients = await prisma.patients.findMany({ take: 1 });
  console.log("Connection successful. Sample data:", patients);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Connection failed:", error);
  process.exit(1);
});
