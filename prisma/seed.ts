import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Contoh: Seed admin user
  const password = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@skillbridge.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@skillbridge.com',
      password,
      role: 'admin',
      emailVerified: true,
    },
  });
}

main()
  .then(() => {
    console.log('Seeding finished.');
    return prisma.$disconnect();
  })
  .catch((e: unknown) => {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error(e);
    }
    return prisma.$disconnect();
  });
