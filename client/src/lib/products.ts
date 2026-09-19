export type ProductCategory = "Cabinets" | "Storage" | "Display" | "Pantry";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  eyebrow: string;
  description: string;
  longDescription: string;
  image: string;
  startingPrice: number;
  dimensions: { width: [number, number]; height: [number, number]; depth: [number, number] };
  materials: string[];
  finishes: string[];
  colors: { name: string; value: string }[];
  shelves: [number, number];
  drawers: [number, number];
  doors: string[];
  hardware?: string[];
  pullOuts?: [number, number];
  lighting?: boolean;
  defaultConfig: Configuration;
};

export type Configuration = {
  width: number;
  height: number;
  depth: number;
  material: string;
  finish: string;
  color: string;
  shelves: number;
  drawers: number;
  doors: string;
  hardware: string;
  pullOuts: number;
  lighting: boolean;
};

export const imageFallbacks = {
  hero: "/custom-boxz-hero_bf7548fe.jpg",
  materials: "/custom-boxz-materials_af77a123.jpg",
};

const cabinetImage = "/custom-boxz-base-cabinet_e7ca59d0.jpg";
const wallImage = "/custom-boxz-wall-unit_6daa33c5.jpg";
const pantryImage = "/custom-boxz-pantry_6d3e26c0.jpg";
const displayImage = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85";

export const products: Product[] = [
  {
    id: "base-cabinet",
    name: "Base Cabinet",
    category: "Cabinets",
    eyebrow: "The foundation piece",
    description: "A quietly architectural cabinet for the everyday rituals of home.",
    longDescription: "Designed to anchor a room without competing with it, the Base Cabinet is built around balanced proportions, generous storage and the kind of joinery that rewards a closer look.",
    image: cabinetImage,
    startingPrice: 1840,
    dimensions: { width: [12, 48], height: [30, 42], depth: [12, 30] },
    materials: ["Oak", "Maple", "Cherry", "Walnut", "Painted White"],
    finishes: ["Natural", "Stained", "Painted", "Glazed"],
    colors: [{ name: "White", value: "#F5F1EB" }, { name: "Gray", value: "#9A9A92" }, { name: "Navy", value: "#273B4D" }, { name: "Espresso", value: "#3B2821" }, { name: "Honey", value: "#B9824B" }],
    shelves: [1, 5],
    drawers: [0, 3],
    doors: ["Solid", "Glass", "None"],
    hardware: ["Knobs", "Pulls", "Handles"],
    defaultConfig: { width: 36, height: 34, depth: 20, material: "Walnut", finish: "Natural", color: "Espresso", shelves: 2, drawers: 2, doors: "Solid", hardware: "Pulls", pullOuts: 0, lighting: false },
  },
  {
    id: "wall-cabinet",
    name: "Wall Cabinet",
    category: "Storage",
    eyebrow: "A vertical composition",
    description: "Open shelving and considered doors for objects worth living with.",
    longDescription: "The Wall Cabinet brings rhythm to a wall with a calibrated mix of open storage and doors. Hang it alone or compose a run around your architecture.",
    image: wallImage,
    startingPrice: 2160,
    dimensions: { width: [18, 60], height: [24, 54], depth: [10, 22] },
    materials: ["Oak", "Maple", "Walnut", "Painted White"],
    finishes: ["Natural", "Stained", "Painted"],
    colors: [{ name: "White", value: "#F5F1EB" }, { name: "Gray", value: "#9A9A92" }, { name: "Navy", value: "#273B4D" }, { name: "Honey", value: "#B9824B" }],
    shelves: [1, 4],
    drawers: [0, 2],
    doors: ["Solid", "Glass", "None"],
    defaultConfig: { width: 42, height: 36, depth: 16, material: "Oak", finish: "Natural", color: "Honey", shelves: 3, drawers: 0, doors: "Glass", hardware: "Knobs", pullOuts: 0, lighting: false },
  },
  {
    id: "pantry-cabinet",
    name: "Pantry Cabinet",
    category: "Pantry",
    eyebrow: "Tall storage, refined",
    description: "A full-height storage system with graceful reach and hidden utility.",
    longDescription: "Made for the busy heart of the home, the Pantry Cabinet combines the efficiency of a well-planned kitchen with the visual calm of a freestanding architectural object.",
    image: pantryImage,
    startingPrice: 3240,
    dimensions: { width: [18, 42], height: [60, 96], depth: [16, 28] },
    materials: ["Oak", "Maple", "Walnut", "Painted White"],
    finishes: ["Natural", "Stained", "Painted", "Glazed"],
    colors: [{ name: "White", value: "#F5F1EB" }, { name: "Gray", value: "#9A9A92" }, { name: "Navy", value: "#273B4D" }, { name: "Espresso", value: "#3B2821" }],
    shelves: [2, 6],
    drawers: [0, 4],
    doors: ["Solid", "Glass", "None"],
    pullOuts: [0, 3],
    defaultConfig: { width: 30, height: 78, depth: 22, material: "Painted White", finish: "Painted", color: "White", shelves: 4, drawers: 2, doors: "Solid", hardware: "Handles", pullOuts: 1, lighting: false },
  },
  {
    id: "display-cupboard",
    name: "Display Cupboard",
    category: "Display",
    eyebrow: "For the collected home",
    description: "A softly lit vitrine for books, ceramics and the pieces that tell your story.",
    longDescription: "The Display Cupboard is a generous stage for a considered collection. Add integrated lighting for a warm evening glow and choose between clear or solid glass doors.",
    image: displayImage,
    startingPrice: 2680,
    dimensions: { width: [24, 60], height: [48, 84], depth: [12, 26] },
    materials: ["Oak", "Walnut", "Painted White"],
    finishes: ["Natural", "Stained", "Painted"],
    colors: [{ name: "White", value: "#F5F1EB" }, { name: "Navy", value: "#273B4D" }, { name: "Espresso", value: "#3B2821" }, { name: "Honey", value: "#B9824B" }],
    shelves: [2, 5],
    drawers: [0, 2],
    doors: ["Glass", "Solid Glass", "None"],
    hardware: ["Knobs", "Pulls"],
    lighting: true,
    defaultConfig: { width: 40, height: 66, depth: 18, material: "Walnut", finish: "Stained", color: "Espresso", shelves: 4, drawers: 1, doors: "Glass", hardware: "Knobs", pullOuts: 0, lighting: true },
  },
];

export const getProduct = (id?: string | null) => products.find((product) => product.id === id) ?? products[0];

export const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export const cloneConfig = (config: Configuration): Configuration => ({ ...config });

export const configFromStorage = (product: Product) => {
  try {
    const stored = localStorage.getItem(`custom-boxz:${product.id}`);
    if (stored) return { ...cloneConfig(product.defaultConfig), ...JSON.parse(stored) } as Configuration;
  } catch (error) {
    console.warn("[CONFIG] Unable to read saved configuration", error);
  }
  return cloneConfig(product.defaultConfig);
};

export const saveConfig = (product: Product, config: Configuration) => {
  try {
    localStorage.setItem(`custom-boxz:${product.id}`, JSON.stringify(config));
  } catch (error) {
    console.warn("[CONFIG] Unable to save configuration", error);
  }
};

export const estimatePrice = (product: Product, config: Configuration) => {
  const widthFactor = config.width / product.defaultConfig.width;
  const heightFactor = config.height / product.defaultConfig.height;
  const storageFactor = 1 + Math.max(0, config.shelves - product.defaultConfig.shelves) * 0.035 + config.drawers * 0.045;
  const materialFactor = config.material === "Walnut" ? 1.14 : config.material === "Cherry" ? 1.08 : 1;
  const doorFactor = config.doors === "Glass" || config.doors === "Solid Glass" ? 1.1 : 1;
  const lightingFactor = config.lighting ? 1.08 : 1;
  return Math.round(product.startingPrice * Math.max(0.8, widthFactor * 0.56 + heightFactor * 0.44) * storageFactor * materialFactor * doorFactor * lightingFactor / 10) * 10;
};

export const categories = ["All", "Cabinets", "Storage", "Display", "Pantry"] as const;

export const productImages = { cabinetImage, wallImage, pantryImage, displayImage };

export type QuoteRequestStatus = "New" | "In review" | "Quoted" | "Archived";

export type QuoteRequest = {
  id: string;
  createdAt: string;
  status: QuoteRequestStatus;
  customer: { name: string; email: string; phone: string; company: string; notes: string };
  product: { id: string; name: string; category: string };
  configuration: Configuration;
  estimate: number;
};

const QUOTE_REQUESTS_KEY = "custom-boxz:quote-requests";

export const getQuoteRequests = (): QuoteRequest[] => {
  try {
    const stored = localStorage.getItem(QUOTE_REQUESTS_KEY);
    return stored ? (JSON.parse(stored) as QuoteRequest[]) : [];
  } catch (error) {
    console.warn("[ADMIN] Unable to read quote requests", error);
    return [];
  }
};

export const saveQuoteRequest = (request: Omit<QuoteRequest, "id" | "createdAt" | "status">) => {
  const next: QuoteRequest = { ...request, id: `CB-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString(), status: "New" };
  try {
    localStorage.setItem(QUOTE_REQUESTS_KEY, JSON.stringify([next, ...getQuoteRequests()]));
  } catch (error) {
    console.warn("[ADMIN] Unable to save quote request", error);
  }
  return next;
};

export const updateQuoteRequestStatus = (id: string, status: QuoteRequestStatus) => {
  try {
    const updated = getQuoteRequests().map((request) => request.id === id ? { ...request, status } : request);
    localStorage.setItem(QUOTE_REQUESTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn("[ADMIN] Unable to update quote request", error);
  }
};

export const deleteQuoteRequest = (id: string) => {
  try {
    localStorage.setItem(QUOTE_REQUESTS_KEY, JSON.stringify(getQuoteRequests().filter((request) => request.id !== id)));
  } catch (error) {
    console.warn("[ADMIN] Unable to delete quote request", error);
  }
};
