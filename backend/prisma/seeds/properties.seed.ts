import type { PrismaClient } from "../../generated/prisma/client.js";
import {
  PropertyType,
  ListingType,
  FurnishingStatus,
  Parking,
} from "../../generated/prisma/client.js";

// ---------------------------------------------------------------------------
// Static seed data
// ---------------------------------------------------------------------------

const LOCALITIES = [
  "Anna Nagar",
  "Adyar",
  "Velachery",
  "RS Puram",
  "Thillai Nagar",
  "Gandhipuram",
  "Saravanampatti",
  "Taramani",
];

const FURNISHING_STATUSES: FurnishingStatus[] = [
  FurnishingStatus.full,
  FurnishingStatus.semi,
  FurnishingStatus.none,
];

const PARKINGS: Parking[] = [
  Parking.car,
  Parking.bike,
  Parking.both,
  Parking.none,
];

const FACINGS = ["North", "South", "East", "West"];

const IMAGE_URLS = [
  "/uploads/properties/1.png",
  "/uploads/properties/2.png",
  "/uploads/properties/3.png",
];

// (city, type, listingType, basePrice, count)
type Cluster = {
  city: string;
  type: PropertyType;
  listingType: ListingType;
  basePrice: number;
  count: number;
};

const CLUSTERS: Cluster[] = [
  { city: "Chennai", type: PropertyType.apartment, listingType: ListingType.sale, basePrice: 6_500_000, count: 5 },
  { city: "Chennai", type: PropertyType.apartment, listingType: ListingType.rent, basePrice: 25_000, count: 2 },
  { city: "Chennai", type: PropertyType.villa, listingType: ListingType.sale, basePrice: 15_000_000, count: 4 },
  { city: "Chennai", type: PropertyType.plot, listingType: ListingType.sale, basePrice: 3_500_000, count: 2 },
  { city: "Chennai", type: PropertyType.commercial, listingType: ListingType.sale, basePrice: 12_000_000, count: 2 },
  { city: "Coimbatore", type: PropertyType.apartment, listingType: ListingType.sale, basePrice: 4_500_000, count: 4 },
  { city: "Coimbatore", type: PropertyType.villa, listingType: ListingType.sale, basePrice: 12_000_000, count: 2 },
  { city: "Coimbatore", type: PropertyType.house, listingType: ListingType.rent, basePrice: 18_000, count: 2 },
  { city: "Madurai", type: PropertyType.apartment, listingType: ListingType.sale, basePrice: 3_800_000, count: 4 },
  { city: "Madurai", type: PropertyType.commercial, listingType: ListingType.lease, basePrice: 45_000, count: 2 },
  { city: "Trichy", type: PropertyType.house, listingType: ListingType.sale, basePrice: 5_200_000, count: 3 },
  { city: "Trichy", type: PropertyType.apartment, listingType: ListingType.rent, basePrice: 15_000, count: 2 },
  { city: "Salem", type: PropertyType.plot, listingType: ListingType.sale, basePrice: 2_200_000, count: 2 },
  { city: "Salem", type: PropertyType.villa, listingType: ListingType.sale, basePrice: 9_500_000, count: 2 },
  { city: "Erode", type: PropertyType.apartment, listingType: ListingType.sale, basePrice: 4_000_000, count: 2 },
  { city: "Erode", type: PropertyType.commercial, listingType: ListingType.sale, basePrice: 8_500_000, count: 2 },
  { city: "Tirupur", type: PropertyType.house, listingType: ListingType.sale, basePrice: 4_800_000, count: 2 },
  { city: "Tirupur", type: PropertyType.apartment, listingType: ListingType.sale, basePrice: 3_600_000, count: 2 },
  { city: "Vellore", type: PropertyType.villa, listingType: ListingType.sale, basePrice: 11_000_000, count: 2 },
  { city: "Vellore", type: PropertyType.plot, listingType: ListingType.sale, basePrice: 1_800_000, count: 2 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomChoice<T>(arr: T[]): T {
  const item = arr[Math.floor(Math.random() * arr.length)];
  if (item === undefined) {
    throw new Error("randomChoice: array is empty");
  }
  return item;
}

function randomIntInclusive(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** ±10% variation on basePrice, snapped to a clean round step. */
function roundedPrice(basePrice: number, listingType: ListingType): number {
  const step = listingType === "rent" || listingType === "lease" ? 500 : 50_000;
  const varied = basePrice * (0.9 + Math.random() * 0.2);
  return Math.round(varied / step) * step;
}

type PropertyShape = {
  bedroom: number;
  bathroom: number;
  balcony: number;
  floor: number | null;
  areaSqft: number;
};

function shapeFor(type: PropertyType): PropertyShape {
  if (type === "plot") {
    return {
      bedroom: 0,
      bathroom: 0,
      balcony: 0,
      floor: null,
      areaSqft: Math.round((1000 + Math.random() * 4000) / 50) * 50,
    };
  }

  if (type === "commercial") {
    return {
      bedroom: 0,
      bathroom: randomIntInclusive(1, 2),
      balcony: 0,
      floor: randomIntInclusive(0, 9),
      areaSqft: Math.round((500 + Math.random() * 4500) / 50) * 50,
    };
  }

  return {
    bedroom: randomIntInclusive(1, 4),
    bathroom: randomIntInclusive(1, 4),
    balcony: randomIntInclusive(0, 3),
    floor: type === "apartment" ? randomIntInclusive(0, 14) : randomIntInclusive(0, 2),
    areaSqft: Math.round((500 + Math.random() * 3000) / 50) * 50,
  };
}

// ---------------------------------------------------------------------------
// Seed logic
// ---------------------------------------------------------------------------

/**
 * Seeds 50 properties in city + type + price CLUSTERS, each with
 * propertyDetails and 3 propertyImages, all owned by `ownerId`.
 */
export async function seedProperties(prisma: PrismaClient, ownerId: number) {
  let created = 0;

  for (const cluster of CLUSTERS) {
    for (let i = 0; i < cluster.count; i++) {
      const locality = randomChoice(LOCALITIES);
      const furnishing = randomChoice(FURNISHING_STATUSES);
      const parking = randomChoice(PARKINGS);
      const facing = randomChoice(FACINGS);
      const price = roundedPrice(cluster.basePrice, cluster.listingType);
      const shape = shapeFor(cluster.type);

      await prisma.property.create({
        data: {
          userId: ownerId,
          title: `${shape.bedroom}BHK ${cluster.type} in ${locality}, ${cluster.city}`,
          description: `A well-maintained ${cluster.type} located in ${locality}, ${cluster.city}. Seeded test listing.`,
          city: cluster.city,
          locality,
          state: "Tamil Nadu",
          address: `${locality}, ${cluster.city}`,
          gMapUrl: `https://maps.google.com/?q=${locality.replace(/ /g, "+")},${cluster.city}`,
          type: cluster.type,
          listingType: cluster.listingType,
          price,
          bedroom: shape.bedroom,
          status: "active",
          propertyDetails: {
            create: {
              areaSqft: shape.areaSqft,
              floor: shape.floor,
              bedroom: shape.bedroom,
              bathroom: shape.bathroom,
              balcony: shape.balcony,
              furnishingStatus: furnishing,
              parking,
              facing,
            },
          },
          propertyImages: {
            create: IMAGE_URLS.map((url, idx) => ({
              url,
              order: idx,
              isCover: idx === 0,
            })),
          },
        },
      });

      created += 1;
    }
  }

  console.log(`Seeded ${created} properties (with details + images).`);
}