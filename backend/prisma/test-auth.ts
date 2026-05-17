import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Test login
  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  });

  if (!user) {
    console.log('User not found');
    return;
  }

  console.log('User found:', user.email, user.role);

  // Test password
  const isValid = await bcrypt.compare('test123', user.password);
  console.log('Password valid:', isValid);

  // Test JWT
  const { JwtService } = await import('@nestjs/jwt');
  const jwt = new JwtService({
    secret: 'your-super-secret-jwt-key-change-in-production',
  });

  const token = jwt.sign({ sub: user.id, email: user.email });
  console.log('Token generated:', token.substring(0, 50) + '...');

  // Verify token
  try {
    const decoded = jwt.verify(token);
    console.log('Token decoded:', decoded);
  } catch (e) {
    console.log('Token verification failed:', e.message);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });