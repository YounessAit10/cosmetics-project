import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = '$2b$10$crs7eQ7R6GoPZtVVAnmPY.lu2wMGjjgE//gCt9jTtmHXunitJtWGa';
  
  await prisma.user.update({
    where: { email: 'test@example.com' },
    data: { password: hashedPassword },
  });

  console.log('✅ Password updated!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });