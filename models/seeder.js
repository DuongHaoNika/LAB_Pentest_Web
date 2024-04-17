const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const fs = require("fs");

const prisma = new PrismaClient();

async function seedUsers() {
  const users = [];
  const numUsers = 50;

  for (let i = 0; i < numUsers; i++) {
    const passwordSalt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(
      faker.internet.password(),
      passwordSalt
    );
    const data = {
      isAdmin: false,
      credentials: {
        create: {
          username: faker.internet.userName(),
          hasher: "bcrypt",
          passwordHash: passwordHash,
          passwordSalt: passwordSalt,
        },
      },
      userInfo: {
        create: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          avatarLink: faker.image.avatar(),
          emailValidated: faker.datatype.boolean(
            faker.number.int({ min: 0, max: 1 })
          ),
          phoneValidated: faker.datatype.boolean(
            faker.number.int({ min: 0, max: 1 })
          ),
          bio: faker.lorem.paragraph(),
        },
      },
      socialProfiles: {
        create: {
          platform: faker.helpers.arrayElement([
            "facebook",
            "twitter",
            "instagram",
          ]),
          platformUrl: faker.internet.url(),
        },
      },
      vendors: {
        create: {
          slug: faker.helpers.slugify(faker.company.name()),
          name: faker.company.name(),
          vendorBio: faker.lorem.paragraph(),
          avatarUrl: faker.image.avatar(),
        },
      },
    };
    const user = await prisma.user.create({
      data,
    });
    users.push(data);
  }

  console.log(`Seeded ${users.length} users`);
  return users;
}

async function seedCategories() {
  const categories = [];
  const numCategories = 10;

  for (let i = 0; i < numCategories; i++) {
    const name = faker.commerce.productAdjective();
    const data = {
      slug: faker.helpers.slugify(name + "-" + faker.string.uuid()),
      name,
      description: faker.commerce.productMaterial(),
    };
    const category = await prisma.category.create({
      data,
    });
    categories.push(data);
  }
  console.log(`Seeded ${categories.length} categories`);
  return categories;
}

async function seedProducts() {
  const products = [];
  const numProducts = 100;
  const categories = await prisma.category.findMany();
  const vendors = await prisma.vendor.findMany();
  const vouchers = await prisma.voucher.findMany();

  for (let i = 0; i < numProducts; i++) {
    const price = parseFloat(faker.commerce.price());
    const title = faker.commerce.productName();
    const data = {
      categoryId: faker.helpers.arrayElement(categories).id,
      vendorId: faker.helpers.arrayElement(vendors).id,
      title,
      picture: faker.image.url(),
      summary: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      slug: faker.helpers.slugify(title + "-" + faker.string.uuid()),
      price,
      discountType: faker.helpers.arrayElement(["percentage", "fixed"]),
      discountValue: faker.number.int({ min: 10, max: 50 }),
      productVouchers: {
        create: {
          voucherId: faker.helpers.arrayElement(vouchers).id,
        },
      },
    };
    const product = await prisma.product.create({
      data,
    });
    products.push(data);
  }
  console.log(`Seeded ${products.length} products`);
  return products;
}

// seed vouchers
async function seedVouchers() {
  const vouchers = [];
  const numVouchers = 10;

  for (let i = 0; i < numVouchers; i++) {
    const data = {
      code: faker.finance.iban(),
      voucherDescription: faker.lorem.sentence(),
      discountValue: faker.number.int({ min: 10, max: 50 }),
      discountType: faker.helpers.arrayElement(["percentage", "fixed"]),
      maxUsage: faker.number.int({ min: 1, max: 10 }),
      voucherStartDate: faker.date.past(),
      voucherEndDate: faker.date.future(),
    };
    const voucher = await prisma.voucher.create({
      data,
    });
    vouchers.push(data);
  }
  console.log(`Seeded ${vouchers.length} vouchers`);
  return vouchers;
}

// seed order
async function seedOrder() {
  const orders = [];
  const numOrders = 100;
  const products = await prisma.product.findMany();
  const users = await prisma.user.findMany();
  const voucher = await prisma.voucher.findMany();
  for (let i = 0; i < numOrders; i++) {
    const quantity = faker.number.int({ min: 1, max: 5 });
    const data = {
      userId: faker.helpers.arrayElement(users).id,
      voucherId: faker.helpers.arrayElement(voucher).id,
      orderStatus: faker.helpers.arrayElement([
        "pending",
        "completed",
        "cancelled",
      ]),
      orderApprovedAt: faker.date.past(),
      orderDeliveredCarrierDate: faker.date.past(),
      orderDeliveredCustomerDate: faker.date.future(),
      orderDetails: {
        createMany: {
          data: [
            {
              productId: faker.helpers.arrayElement(products).id,
              price: parseFloat(faker.commerce.price()),
              quantity,
            },
          ],
        },
      },
    };
    const order = await prisma.order.create({
      data,
    });
    orders.push(data);
  }
  console.log(`Seeded ${orders.length} orders`);

  return orders;
}

async function seedVulnSettings() {
  const data = [
    {
      name: "XSS",
    },
    {
      name: "CSRF",
    },
    {
      name: "SSRF",
    },
    {
      name: "SQLI",
    },
    {
      name: "SSTI",
    },
    {
      name: "XXE",
    },
    {
      name: "Broken Authentication",
    },
    {
      name: "Path Traversal",
    },
    {
      name: "JWT",
    },
    {
      name: "File upload",
    },
    {
      name: "OS Command Injection",
    },
    {
      name: "Deserialization",
    },
    {
      name: "IDOR",
    },
  ];
  const vulnSettings = await prisma.vulnSetting.createMany({
    data,
  });
  console.log(`Seeded ${vulnSettings.length} vuln settings`);
}

async function seed() {
  // clear all tables
  await prisma.$executeRaw`TRUNCATE TABLE public."User", public."Category", public."Product", public."SocialProfile", public."Cart", public."Review", public."Vendor", public."AdminRole" RESTART IDENTITY CASCADE`;
  await seedVulnSettings();
  // if seed.json exists, load data from it otherwise seed the database
  if (fs.existsSync("./models/seed.json")) {
    const data = JSON.parse(fs.readFileSync("./models/seed.json"));
    await prisma.user.createMany({ data: data.users });
    await prisma.category.createMany({ data: data.categories });
    await prisma.vendor.createMany({ data: data.vendors });
    await prisma.product.createMany({ data: data.products });
    // await prisma.voucher.createMany({ data: data.vouchers });
    await prisma.order.createMany({ data: data.orders });
    return;
  }

  // seed data
  await seedUsers();
  await seedCategories();
  await seedProducts();
  // await seedVouchers();
  await seedOrder();

  const users = await prisma.user.findMany();
  const categories = await prisma.category.findMany();
  // const vouchers = await prisma.voucher.findMany();
  const vendors = await prisma.vendor.findMany();
  const products = await prisma.product.findMany();
  // const orders = await prisma.order.findMany();

  // save to one json file
  const data = {
    users,
    categories,
    products,
    vendors,
    // vouchers,
    // orders,
  };

  fs.writeFileSync("./models/seed.json", JSON.stringify(data));
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
