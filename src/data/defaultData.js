// Default data structure for the home app
// Property: 205 Hodges Lane, Takoma Park, MD - Built 1936
// 3 bed/3 bath, ~2,100 sq ft, two fireplaces, deck, terraced fenced yard

export const propertyInfo = {
  address: "205 Hodges Lane",
  city: "Takoma Park",
  state: "MD",
  zip: "20912",
  yearBuilt: 1936,
  squareFeet: 2544,
  belowGradeSqFt: 897,
  lotSize: 7625,
  bedrooms: 3,
  bathrooms: 3,
  features: [
    "Two wood-burning fireplaces",
    "Sunny tree-top deck",
    "Terraced, fenced yard",
    "Fully finished lower level",
    "Second kitchenette in basement"
  ]
};

export const roomCategories = [
  {
    id: "backyard",
    name: "Backyard",
    icon: "Trees",
    subdivisions: [
      { id: "deck", name: "Deck" },
      { id: "yard", name: "Yard" }
    ]
  },
  {
    id: "front-yard",
    name: "Front Yard",
    icon: "Home",
    subdivisions: []
  },
  {
    id: "basement",
    name: "Basement",
    icon: "Building",
    subdivisions: [
      { id: "basement-electrical", name: "Electrical Room" },
      { id: "basement-living", name: "Living Room" },
      { id: "basement-kitchenette", name: "Kitchenette" },
      { id: "basement-bathroom", name: "Bathroom" },
      { id: "basement-bedroom", name: "Bedroom" },
      { id: "basement-crawlspace", name: "Crawl Space" },
      { id: "basement-concrete", name: "Concrete Room" }
    ]
  },
  {
    id: "main-floor",
    name: "Main Floor",
    icon: "LayoutGrid",
    subdivisions: [
      { id: "main-entryway", name: "Entryway" },
      { id: "main-living", name: "Living Room" },
      { id: "main-kitchen", name: "Kitchen" },
      { id: "main-bathroom", name: "Bathroom" },
      { id: "main-three-seasons", name: "Three Seasons Room" }
    ]
  },
  {
    id: "upper-floor",
    name: "Upper Floor",
    icon: "ArrowUp",
    subdivisions: [
      { id: "upper-master", name: "Master Bedroom" },
      { id: "upper-guest", name: "Guest Bedroom" },
      { id: "upper-bathroom", name: "Bathroom" },
      { id: "upper-hallway", name: "Hallway" },
      { id: "upper-landing", name: "Landing" },
      { id: "upper-nook", name: "Nook" }
    ]
  },
  {
    id: "attic",
    name: "Attic",
    icon: "Triangle",
    subdivisions: []
  }
];

// Default maintenance tasks - recurring tasks for general home maintenance
// Note: Property-specific repair tasks from home inspection are stored separately per user
export const defaultMaintenanceTasks = [
  // Monthly
  {
    id: "smoke-detectors",
    name: "Test Smoke & CO Detectors",
    description: "Test all smoke and carbon monoxide detectors, replace batteries if needed",
    frequency: "monthly",
    intervalDays: 30,
    priority: "high",
    category: "Safety",
    taskType: "maintenance"
  },

  // Quarterly (Every 90 Days)
  {
    id: "ac-filter",
    name: "Change AC Filter",
    description: "Replace the AC filter (check size for your unit)",
    frequency: "quarterly",
    intervalDays: 90,
    priority: "medium",
    category: "HVAC",
    estimatedCost: 20,
    taskType: "maintenance"
  },

  // Semi-Annual
  {
    id: "hvac-service",
    name: "Service HVAC (Twice Yearly)",
    description: "Professional HVAC service - spring for AC, fall for heating",
    frequency: "semi-annual",
    intervalDays: 180,
    priority: "high",
    category: "HVAC",
    estimatedCost: 125,
    taskType: "maintenance"
  },

  // Annual
  {
    id: "gutter-cleaning",
    name: "Clean Gutters & Downspouts",
    description: "Remove debris from gutters and flush downspouts, check for proper drainage",
    frequency: "annual",
    intervalDays: 365,
    priority: "high",
    category: "Exterior",
    taskType: "maintenance"
  },
  {
    id: "humidifier-screen",
    name: "Change Humidifier Screen",
    description: "Replace the humidifier screen (if your home has a humidifier)",
    frequency: "annual",
    intervalDays: 365,
    priority: "medium",
    category: "HVAC",
    estimatedCost: 30,
    taskType: "maintenance"
  },
  {
    id: "ac-service",
    name: "Annual AC Service",
    description: "Professional AC service and inspection",
    frequency: "annual",
    intervalDays: 365,
    priority: "high",
    category: "HVAC",
    estimatedCost: 125,
    taskType: "maintenance"
  },
  {
    id: "water-heater-flush",
    name: "Flush Water Heater",
    description: "Drain and flush water heater to remove sediment buildup",
    frequency: "annual",
    intervalDays: 365,
    priority: "medium",
    category: "Plumbing",
    taskType: "maintenance"
  },
  {
    id: "dryer-vent-clean",
    name: "Clean Dryer Vent",
    description: "Clean lint from dryer vent and exhaust duct to prevent fire hazard",
    frequency: "annual",
    intervalDays: 365,
    priority: "high",
    category: "Appliances",
    taskType: "maintenance"
  },
  {
    id: "fireplace-inspection",
    name: "Fireplace & Chimney Inspection",
    description: "Professional inspection of fireplace and chimney (if applicable)",
    frequency: "annual",
    intervalDays: 365,
    priority: "medium",
    category: "Fireplace",
    estimatedCost: 150,
    taskType: "maintenance"
  },
  {
    id: "exterior-inspection",
    name: "Exterior Home Inspection",
    description: "Walk around home checking for cracks, peeling paint, damaged siding, and foundation issues",
    frequency: "annual",
    intervalDays: 365,
    priority: "medium",
    category: "Exterior",
    taskType: "maintenance"
  },
  {
    id: "roof-inspection",
    name: "Roof Inspection",
    description: "Check roof for damaged or missing shingles, flashing issues, and debris",
    frequency: "annual",
    intervalDays: 365,
    priority: "medium",
    category: "Exterior",
    taskType: "maintenance"
  }
];

// Maintenance categories for filtering
export const maintenanceCategories = [
  "All",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Exterior",
  "Interior",
  "Appliances",
  "Safety",
  "Fireplace",
  "Outdoor",
  "Structure"
];

// Task type options
export const taskTypes = [
  { value: "maintenance", label: "Maintenance" },
  { value: "repair", label: "Repair" },
  { value: "upgrade", label: "Upgrade" }
];

// Area categories for filtering tasks
export const areaCategories = [
  { value: "all", label: "All Areas" },
  { value: "outdoor", label: "Outdoor" },
  { value: "basement", label: "Basement" },
  { value: "main-floor", label: "Main Floor" },
  { value: "upper-floor", label: "Upper Floor" },
  { value: "attic", label: "Attic" },
  { value: "structure", label: "Structure" }
];

// Priority levels
export const priorityLevels = [
  { value: "low", label: "Low", color: "#86efac" },
  { value: "medium", label: "Medium", color: "#fbbf24" },
  { value: "high", label: "High", color: "#ef4444" }
];

// Frequency options for recurring tasks
export const frequencyOptions = [
  { value: "one-time", label: "One-Time", days: 0 },
  { value: "weekly", label: "Weekly", days: 7 },
  { value: "biweekly", label: "Bi-weekly", days: 14 },
  { value: "monthly", label: "Monthly", days: 30 },
  { value: "quarterly", label: "Quarterly", days: 90 },
  { value: "semi-annual", label: "Semi-Annual", days: 180 },
  { value: "annual", label: "Annual", days: 365 },
  { value: "biennial", label: "Every 2 Years", days: 730 },
  { value: "5-year", label: "Every 5 Years", days: 1825 },
  { value: "custom", label: "Custom", days: null }
];

// Cost categories - includes Maintenance, Repair, and Upgrade
export const costCategories = [
  "Maintenance",
  "Repair",
  "Upgrade"
];
