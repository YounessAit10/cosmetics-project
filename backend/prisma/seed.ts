import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const skincare = await prisma.category.create({
    data: {
      nameFr: 'Soins de la peau',
      nameEn: 'Skincare',
      nameAr: 'العناية بالبشرة',
      descriptionFr: 'Produits pour le soin du visage et du corps',
      descriptionEn: 'Face and body care products',
      descriptionAr: 'منتجات العناية بالوجه والجسم',
    },
  });

  const makeup = await prisma.category.create({
    data: {
      nameFr: 'Maquillage',
      nameEn: 'Makeup',
      nameAr: 'المكياج',
      descriptionFr: 'Produits de maquillage professionnel',
      descriptionEn: 'Professional makeup products',
      descriptionAr: 'منتجات المكياج الاحترافي',
    },
  });

  const haircare = await prisma.category.create({
    data: {
      nameFr: 'Soins capillaires',
      nameEn: 'Haircare',
      nameAr: 'العناية بالشعر',
      descriptionFr: 'Shampooings, conditioners et traitements',
      descriptionEn: 'Shampoos, conditioners and treatments',
      descriptionAr: 'الشامبو والبلسم والمعالجات',
    },
  });

  console.log('✅ Categories created');

  // Create products
  const products = [
    {
      nameFr: 'Crème hydratante hydratante',
      nameEn: 'Hydrating Moisturizing Cream',
      nameAr: 'كريم ترطيب',
      descriptionFr: 'Crème hydratante légère pour tous types de peau',
      descriptionEn: 'Light moisturizing cream for all skin types',
      descriptionAr: 'كريم ترطيب خفيف لجميع أنواع البشرة',
      price: 29.99,
      stock: 50,
      imageUrl: 'https://example.com/cream.jpg',
      categoryId: skincare.id,
    },
    {
      nameFr: 'Sérum vitaminé C',
      nameEn: 'Vitamin C Serum',
      nameAr: 'سيروم فيتامين سي',
      descriptionFr: 'Sérum éclaircissant à la vitamine C',
      descriptionEn: 'Brightening vitamin C serum',
      descriptionAr: 'سيروم明亮 dengan vitamin C',
      price: 39.99,
      stock: 30,
      imageUrl: 'https://example.com/serum.jpg',
      categoryId: skincare.id,
    },
    {
      nameFr: 'Rouge à lèvres mat',
      nameEn: 'Matte Lipstick',
      nameAr: 'أحمر شفاه مات',
      descriptionFr: 'Rouge à lèvres longue tenue',
      descriptionEn: 'Long-lasting matte lipstick',
      descriptionAr: 'أحمر شفاه يدوم طويلاً',
      price: 19.99,
      stock: 100,
      imageUrl: 'https://example.com/lipstick.jpg',
      categoryId: makeup.id,
    },
    {
      nameFr: 'Shampooing réparateur',
      nameEn: 'Repair Shampoo',
      nameAr: 'شامبو إصلاح',
      descriptionFr: 'Shampooing réparateur pour cheveux endommagés',
      descriptionEn: 'Repair shampoo for damaged hair',
      descriptionAr: 'شامبو إصلاح للشعر التالف',
      price: 15.99,
      stock: 75,
      imageUrl: 'https://example.com/shampoo.jpg',
      categoryId: haircare.id,
    },
    {
      nameFr: 'Crème solaire SPF 50',
      nameEn: 'SPF 50 Sunscreen',
      nameAr: 'كريم حماية من الشمس SPF 50',
      descriptionFr: 'Protection solaire haute efficacité',
      descriptionEn: 'High effectiveness sun protection',
      descriptionAr: 'حماية فعالة من الشمس',
      price: 24.99,
      stock: 60,
      imageUrl: 'https://example.com/sunscreen.jpg',
      categoryId: skincare.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('✅ Products created');

  // Create a test user
  const hashedPassword = '$2b$10$crs7eQ7R6GoPZtVVAnmPY.lu2wMGjjgE//gCt9jTtmHXunitJtWGa';
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Test user created (email: test@example.com, password: test123)');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });