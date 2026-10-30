import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import hero from "@/assets/hero.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";

export type Property = {
  id: string;
  title: string;
  city: string;
  district: string;
  type: "Villa" | "Apartment" | "Penthouse" | "Townhouse" | "Commercial";
  price: number;
  area: number;
  beds: number;
  baths: number;
  short: string;
  description: string;
  images: string[];
  featured?: boolean;
  investment?: { yield: number; label: string };
  status: "Ready" | "Off-plan";
  year: number;
  amenities: string[];
};

export const CITIES = ["Riyadh", "Jeddah", "Dammam", "Al Khobar", "AlUla"] as const;
export const TYPES = ["Villa", "Apartment", "Penthouse", "Townhouse", "Commercial"] as const;
export const BUDGETS = [
  { label: "Up to 2M SAR", value: "0-2000000" },
  { label: "2M – 5M SAR", value: "2000000-5000000" },
  { label: "5M – 10M SAR", value: "5000000-10000000" },
  { label: "10M+ SAR", value: "10000000-999999999" },
] as const;

export const formatSAR = (n: number) =>
  "SAR " + new Intl.NumberFormat("en-US").format(n);

const amen = ["Private pool", "Smart home", "Maid's room", "Covered parking", "24/7 security", "Gym", "Garden", "Majlis"];

export const PROPERTIES: Property[] = [
  {
    id: "al-noor-villa", title: "Al Noor Signature Villa", city: "Riyadh", district: "Al Malqa",
    type: "Villa", price: 8900000, area: 820, beds: 6, baths: 7,
    short: "A sculpted family villa with infinity pool and private majlis.",
    description: "Set within the quiet avenues of Al Malqa, Al Noor is a contemporary interpretation of Najdi living. Double-height reception halls open onto a cascading infinity pool, while carved mashrabiya screens filter the desert light across cream limestone interiors. A private majlis, guest wing and rooftop terrace complete a home designed for generations.",
    images: [hero, p2, p4], featured: true, status: "Ready", year: 2025, amenities: amen,
  },
  {
    id: "emerald-tower-penthouse", title: "Emerald Tower Penthouse", city: "Riyadh", district: "KAFD",
    type: "Penthouse", price: 12500000, area: 610, beds: 4, baths: 5,
    short: "Sky residence above the financial district with 360° views.",
    description: "Crowning the Emerald Tower, this penthouse offers panoramic views over the King Abdullah Financial District. Floor-to-ceiling glazing, private elevator access and a wraparound terrace define a residence of rare stature.",
    images: [p1, p4, hero], featured: true, investment: { yield: 7.2, label: "Prime rental demand" }, status: "Ready", year: 2024, amenities: amen.slice(1),
  },
  {
    id: "red-sea-shore-villa", title: "Red Sea Shore Villa", city: "Jeddah", district: "Obhur",
    type: "Villa", price: 15800000, area: 940, beds: 5, baths: 6,
    short: "Beachfront living with a private jetty on Obhur creek.",
    description: "A whitewashed coastal retreat with direct beach access, a private jetty and terraces that step down to the water. Every room frames the Red Sea.",
    images: [p3, p2, p4], featured: true, investment: { yield: 6.4, label: "Holiday-let ready" }, status: "Ready", year: 2023, amenities: amen,
  },
  {
    id: "diriyah-courtyard-house", title: "Diriyah Courtyard House", city: "Riyadh", district: "Diriyah",
    type: "Villa", price: 6400000, area: 560, beds: 5, baths: 5,
    short: "Heritage-inspired courtyard home steps from At-Turaif.",
    description: "Built around a shaded central courtyard and pool, this residence reinterprets traditional mud-brick architecture with modern comfort.",
    images: [p2, hero, p4], investment: { yield: 8.1, label: "Tourism growth zone" }, status: "Ready", year: 2024, amenities: amen.slice(0, 6),
  },
  {
    id: "corniche-residence", title: "Corniche Sky Residence", city: "Al Khobar", district: "Corniche",
    type: "Apartment", price: 2350000, area: 210, beds: 3, baths: 3,
    short: "Serene sea-view apartment in a full-service tower.",
    description: "A calm, light-filled apartment overlooking the Arabian Gulf with hotel-grade services, residents' lounge and spa.",
    images: [p4, p1, p3], featured: true, investment: { yield: 7.8, label: "Fully furnished" }, status: "Ready", year: 2025, amenities: amen.slice(1, 7),
  },
  {
    id: "garden-townhouses", title: "Al Rawdah Garden Townhouse", city: "Dammam", district: "Al Rawdah",
    type: "Townhouse", price: 1850000, area: 280, beds: 4, baths: 4,
    short: "Family townhouse in a green, gated community.",
    description: "Part of a landscaped community with schools and parks nearby, these townhouses balance privacy and neighbourhood living.",
    images: [p5, p4, p2], featured: true, investment: { yield: 6.9, label: "Family rental demand" }, status: "Off-plan", year: 2026, amenities: amen.slice(2, 8),
  },
  {
    id: "olaya-business-hub", title: "Olaya Business Hub", city: "Riyadh", district: "Olaya",
    type: "Commercial", price: 21000000, area: 2400, beds: 0, baths: 8,
    short: "Grade-A office building leased to blue-chip tenants.",
    description: "A fully leased Grade-A office building on Olaya Street, offering stable long-term income in Riyadh's commercial heart.",
    images: [p6, p1, p4], investment: { yield: 9.2, label: "Fully leased" }, status: "Ready", year: 2022, amenities: ["Covered parking", "24/7 security", "Smart access", "Rooftop terrace"],
  },
  {
    id: "alula-desert-retreat", title: "AlUla Desert Retreat", city: "AlUla", district: "Ashar Valley",
    type: "Villa", price: 9700000, area: 700, beds: 4, baths: 5,
    short: "Secluded sandstone villa among AlUla's ancient canyons.",
    description: "Carved into the dramatic landscape of Ashar Valley, this retreat offers absolute privacy, a plunge pool and star-gazing terraces.",
    images: [p2, p3, hero], investment: { yield: 8.6, label: "Luxury tourism" }, status: "Off-plan", year: 2026, amenities: amen.slice(0, 5),
  },
  {
    id: "jeddah-marina-apartment", title: "Marina Bay Apartment", city: "Jeddah", district: "Al Shati",
    type: "Apartment", price: 3100000, area: 240, beds: 3, baths: 3,
    short: "Contemporary apartment with marina and sea views.",
    description: "A refined apartment in a boutique marina development with private beach club access.",
    images: [p4, p3, p1], status: "Ready", year: 2024, amenities: amen.slice(1, 6),
  },
];

export const GIGA_PROJECTS = [
  { name: "NEOM — The Line", region: "Tabuk Province", status: "Under construction", deadline: "2030 (phase one)", budget: "SAR 1.9 trillion", text: "A 170 km linear city redefining urban living — zero cars, zero streets, powered entirely by renewable energy.", image: g1 },
  { name: "Red Sea Global", region: "West Coast", status: "Phased opening", deadline: "2030 (full completion)", budget: "SAR 75 billion", text: "A regenerative tourism destination across 90 pristine islands, with ultra-luxury resorts and residences.", image: g2 },
  { name: "Diriyah Gate", region: "Riyadh", status: "Building now", deadline: "2030", budget: "SAR 236 billion", text: "The birthplace of the Kingdom reborn as a world-class cultural, living and hospitality district.", image: g3 },
];
