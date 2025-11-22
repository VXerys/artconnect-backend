import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create Mock User
  const uid = 'seed-user-uid-123';
  const user = await prisma.user.upsert({
    where: { email: 'artist@example.com' },
    update: {},
    create: {
      id: uid, // Explicit ID as it is now the PK
      email: 'artist@example.com',
      name: 'Picasso Junior',
      role: 'USER',
      photoUrl: 'https://ui-avatars.com/api/?name=Picasso+Junior',
    },
  });

  console.log(`Created User: ${user.name}`);

  // 2. Create Artworks
  const artworksData = [
    {
      title: 'Sunset Over Mountains',
      artist: 'Picasso Junior',
      price: 5000000,
      category: 'Landscape',
      status: 'AVAILABLE',
      userId: user.id,
      description: 'A beautiful sunset captured in oil.',
    },
    {
      title: 'Urban Chaos',
      artist: 'Picasso Junior',
      price: 7500000,
      category: 'Abstract',
      status: 'SOLD',
      userId: user.id,
      description: 'City life abstract representation.',
    },
    {
      title: 'Portrait of a Stranger',
      artist: 'Picasso Junior',
      price: 3000000,
      category: 'Portrait',
      status: 'RESERVED',
      userId: user.id,
    },
  ] as const;

  for (const art of artworksData) {
    const artwork = await prisma.artwork.create({
        data: {
            title: art.title,
            artist: art.artist,
            price: art.price,
            category: art.category,
            status: art.status as any,
            userId: art.userId,
            description: 'description' in art ? art.description : undefined
        }
    });
    console.log(`Created Artwork: ${artwork.title}`);
  }

  // 3. Create Contacts
  const contact = await prisma.contact.create({
    data: {
      name: 'The Great Gallery',
      type: 'GALLERY',
      email: 'contact@greatgallery.com',
      phone: '+1234567890',
      userId: user.id,
      status: 'ACTIVE',
    },
  });
  console.log(`Created Contact: ${contact.name}`);

  const collector = await prisma.contact.create({
    data: {
      name: 'John Collector',
      type: 'COLLECTOR',
      email: 'john@collector.com',
      userId: user.id,
      status: 'ACTIVE',
    },
  });
  console.log(`Created Contact: ${collector.name}`);

  // 4. Create Sales Deals
  await prisma.salesDeal.create({
    data: {
      title: 'Potential Gallery Exhibition',
      amount: 50000000,
      stage: 'NEGOTIATION',
      probability: 70,
      contactId: contact.id,
      userId: user.id,
    },
  });

  await prisma.salesDeal.create({
    data: {
      title: 'Private Commission',
      amount: 10000000,
      stage: 'CLOSED_WON',
      probability: 100,
      closedDate: new Date(),
      contactId: collector.id,
      userId: user.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
