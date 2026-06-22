const BASE_URL = 'http://localhost:3000';
const CREATED_BY_ID = 'c5f4f507-52fe-4f2a-8af9-981cc02fa193';

const CATEGORIES = {
  furniture: '8c832c33-9957-41e8-b887-131279bf182b',
  weapons: '2bddded7-7868-40e8-99cb-1ac0a51132fb',
  books: '6f04c0aa-795d-4fe7-883e-778de8123d00',
};

const items = [
  // Furniture
  {
    name: 'Victorian Mahogany Writing Desk',
    origin: 'England',
    year: 1875,
    priceEur: 4200,
    description: 'A beautifully crafted Victorian-era mahogany writing desk with brass hardware and leather inlay.',
    categoryId: CATEGORIES.furniture,
  },
  {
    name: 'Louis XVI Gilded Armchair',
    origin: 'France',
    year: 1785,
    priceEur: 8750,
    description: 'Authentic Louis XVI period armchair with original gilded frame and silk upholstery.',
    categoryId: CATEGORIES.furniture,
  },
  {
    name: 'Baroque Oak Dining Table',
    origin: 'Germany',
    year: 1720,
    priceEur: 12500,
    description: 'A massive baroque-style oak dining table with hand-carved legs, seats up to 12 guests.',
    categoryId: CATEGORIES.furniture,
  },
  {
    name: 'Chippendale Tall-Boy Chest',
    origin: 'England',
    year: 1760,
    priceEur: 6300,
    description: 'Six-drawer Chippendale tall-boy chest in walnut with original brass bail pulls.',
    categoryId: CATEGORIES.furniture,
  },
  {
    name: 'Art Nouveau Inlaid Cabinet',
    origin: 'Austria',
    year: 1905,
    priceEur: 5800,
    description: 'Elegant Art Nouveau display cabinet with floral marquetry inlay and bevelled glass doors.',
    categoryId: CATEGORIES.furniture,
  },
  {
    name: 'Georgian Mahogany Four-Poster Bed',
    origin: 'England',
    year: 1810,
    priceEur: 9400,
    description: 'A grand Georgian four-poster bed in solid mahogany with carved canopy and original canopy rails.',
    categoryId: CATEGORIES.furniture,
  },
  {
    name: 'Renaissance Walnut Credenza',
    origin: 'Italy',
    year: 1580,
    priceEur: 22000,
    description: 'Italian Renaissance credenza in walnut with relief-carved panels depicting mythological scenes.',
    categoryId: CATEGORIES.furniture,
  },
  // Weapons & Militaria
  {
    name: '17th-Century Flintlock Pistol',
    origin: 'France',
    year: 1680,
    priceEur: 7600,
    description: 'A fine French flintlock pistol with engraved silver mounts and walnut stock, complete with original ramrod.',
    categoryId: CATEGORIES.weapons,
  },
  {
    name: "Napoleonic Officer's Sabre",
    origin: 'France',
    year: 1805,
    priceEur: 5400,
    description: "Authentic Napoleonic cavalry officer's sabre with gilded brass hilt and scabbard bearing imperial eagle motif.",
    categoryId: CATEGORIES.weapons,
  },
  {
    name: "Medieval Knight's Longsword",
    origin: 'Germany',
    year: 1350,
    priceEur: 18500,
    description: 'A well-preserved medieval longsword with cruciform guard, grip wrapped in original leather and wire.',
    categoryId: CATEGORIES.weapons,
  },
  {
    name: 'WWI German Stahlhelm M16',
    origin: 'Germany',
    year: 1916,
    priceEur: 950,
    description: 'World War I German steel helmet Model 1916 with original liner and chinstrap, lightly worn condition.',
    categoryId: CATEGORIES.weapons,
  },
  {
    name: 'Japanese Edo-Period Katana',
    origin: 'Japan',
    year: 1650,
    priceEur: 32000,
    description: 'Edo-period katana signed by the smith Kunihiro, with original tsuba, menuki, and lacquered saya.',
    categoryId: CATEGORIES.weapons,
  },
  {
    name: "Civil War Union Officer's Sword",
    origin: 'United States',
    year: 1862,
    priceEur: 3200,
    description: "U.S. Model 1850 foot officer's sword with etched blade, wire-wrapped grip and original leather scabbard.",
    categoryId: CATEGORIES.weapons,
  },
  // Books
  {
    name: 'Gutenberg Bible Leaf',
    origin: 'Germany',
    year: 1455,
    priceEur: 95000,
    description: 'A single authenticated leaf from the Gutenberg Bible, printed in Mainz circa 1455, with hand-painted rubrication.',
    categoryId: CATEGORIES.books,
  },
  {
    name: "First Folio of Shakespeare's Works",
    origin: 'England',
    year: 1623,
    priceEur: 5000000,
    description: 'A first folio edition of Mr. William Shakespeares Comedies, Histories & Tragedies, published in 1623.',
    categoryId: CATEGORIES.books,
  },
  {
    name: "Darwin's On the Origin of Species - 1st Ed.",
    origin: 'England',
    year: 1859,
    priceEur: 480000,
    description: "First edition, first issue of Charles Darwin's On the Origin of Species, publisher's original cloth binding.",
    categoryId: CATEGORIES.books,
  },
  {
    name: 'Copernicus De Revolutionibus - 1st Ed.',
    origin: 'Poland',
    year: 1543,
    priceEur: 2200000,
    description: "First edition of Copernicus' De Revolutionibus Orbium Coelestium, the heliocentric theory groundbreaking work.",
    categoryId: CATEGORIES.books,
  },
  {
    name: "Chaucer's Canterbury Tales - Caxton Print",
    origin: 'England',
    year: 1477,
    priceEur: 1100000,
    description: 'Second Caxton printing of Canterbury Tales, one of the most celebrated works of Middle English literature.',
    categoryId: CATEGORIES.books,
  },
  {
    name: "Galileo's Sidereus Nuncius - 1st Ed.",
    origin: 'Italy',
    year: 1610,
    priceEur: 750000,
    description: "First edition of Galileo's Sidereus Nuncius announcing the discovery of Jupiter's moons and lunar mountains.",
    categoryId: CATEGORIES.books,
  },
  {
    name: "Audubon's Birds of America - Double Elephant Folio",
    origin: 'United States',
    year: 1838,
    priceEur: 9500000,
    description: "Complete set of Audubon's Birds of America in double elephant folio format, 435 hand-coloured aquatint engravings.",
    categoryId: CATEGORIES.books,
  },
];

async function seedItems() {
  console.log(`Seeding ${items.length} antique items...\n`);
  let created = 0;
  let failed = 0;

  for (const item of items) {
    const body = JSON.stringify({ ...item, createdById: CREATED_BY_ID });
    try {
      const res = await fetch(`${BASE_URL}/antique-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`✓ Created: ${item.name} (id: ${data.id})`);
        created++;
      } else {
        const error = await res.text();
        console.error(`✗ Failed: ${item.name} — ${res.status} ${error}`);
        failed++;
      }
    } catch (err) {
      console.error(`✗ Error: ${item.name} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Created: ${created}, Failed: ${failed}`);
}

seedItems();
