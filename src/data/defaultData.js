// Default data structure for the home app
// Property: 205 Hodges Lane, Takoma Park, MD - Built 1936
// 3 bed/3 bath, ~2,100 sq ft, two fireplaces, deck, terraced fenced yard

export const propertyInfo = {
  address: "205 Hodges Lane",
  city: "Takoma Park",
  state: "MD",
  zip: "20912",
  yearBuilt: 1936,
  squareFeet: 2099,
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

// Default maintenance tasks based on a 1936 home with specific features
// Combined with repair tasks from home inspection spreadsheet
export const defaultMaintenanceTasks = [
  // ============ RECURRING MAINTENANCE TASKS ============

  // Every 90 Days
  {
    id: "ac-filter",
    name: "Change AC Filter (16x25)",
    description: "Replace the 16x25 AC filter in the basement electrical room",
    frequency: "quarterly",
    intervalDays: 90,
    priority: "medium",
    category: "HVAC",
    location: "Basement - Electrical Room",
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
    location: "Basement - Electrical Room",
    estimatedCost: 125,
    taskType: "maintenance"
  },

  // Annual
  {
    id: "humidifier-screen",
    name: "Change Humidifier Screen",
    description: "Replace the humidifier screen in the basement electrical room",
    frequency: "annual",
    intervalDays: 365,
    priority: "medium",
    category: "HVAC",
    location: "Basement - Electrical Room",
    estimatedCost: 30,
    taskType: "maintenance"
  },
  {
    id: "ac-service",
    name: "Annual AC Service & Level Check",
    description: "Professional AC service, check unit level and lean. ~$125/visit",
    frequency: "annual",
    intervalDays: 365,
    priority: "high",
    category: "HVAC",
    location: "Outside - AC Unit",
    estimatedCost: 125,
    taskType: "maintenance"
  },
  {
    id: "retaining-wall-monitor",
    name: "Monitor Retaining Wall",
    description: "Check retaining wall in backyard for any movement or damage",
    frequency: "annual",
    intervalDays: 365,
    priority: "medium",
    category: "Outdoor",
    location: "Outside - Backyard",
    taskType: "maintenance"
  },
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

  // ============ HIGH PRIORITY REPAIRS ============

  // Deck Repairs
  {
    id: "deck-foundation-rot",
    name: "Repair Foundation Rot (Under Stairs)",
    description: "Fix foundation rot under deck stairs. Contractor needed. Est. $600-$1,200",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Structure",
    location: "Outside - Deck",
    estimatedCost: 900,
    taskType: "repair",
    contractor: true
  },
  {
    id: "deck-regrade",
    name: "Regrade Gravel/Soil Under Deck",
    description: "Regrade gravel/soil to prevent water pooling under deck",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Outdoor",
    location: "Outside - Deck",
    taskType: "repair"
  },

  // Gutters
  {
    id: "gutter-rust-repair",
    name: "Fix/Replace Rusted Gutter",
    description: "Repair or replace rusted gutter section. DIY project. Est. $300",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Exterior",
    location: "Outside - Gutters",
    estimatedCost: 300,
    taskType: "repair"
  },

  // Siding & Exterior
  {
    id: "lead-paint-strip",
    name: "Strip/Paint Potential Lead Paint",
    description: "Strip and repaint left side siding - potential lead paint. Follow safety protocols.",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Exterior",
    location: "Outside - Left Side",
    taskType: "repair"
  },
  {
    id: "exterior-crack-fill",
    name: "Fill Exterior Crack",
    description: "Fill exterior crack on left side to prevent moisture intrusion",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Exterior",
    location: "Outside - Left Side",
    taskType: "repair"
  },

  // Windows
  {
    id: "window-well-right",
    name: "Install Window Well (Right Side)",
    description: "Install window well on right side. DIY project. Est. $30",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Exterior",
    location: "Outside - Right Side",
    estimatedCost: 30,
    taskType: "repair"
  },

  // Perimeter & Grading
  {
    id: "regrade-perimeter",
    name: "Regrade Mulch/Soil Away from House",
    description: "Regrade mulch and soil around perimeter to direct water away from foundation. Est. $200-$400",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Outdoor",
    location: "Outside - Perimeter",
    estimatedCost: 300,
    taskType: "repair"
  },

  // Electrical
  {
    id: "ground-outlets-outside",
    name: "Ensure Outdoor Outlets are Grounded/GFCI",
    description: "Have electrician verify outdoor outlets are properly grounded and GFCI protected. ~1 hour labor",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Electrical",
    location: "Outside",
    contractor: true,
    taskType: "repair"
  },

  // Basement Electrical Room
  {
    id: "basement-window-well",
    name: "Install Window Well (Basement)",
    description: "Install window well in electrical room to stop wall moisture",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Exterior",
    location: "Basement - Electrical Room",
    taskType: "repair"
  },
  {
    id: "sump-pump-roots",
    name: "Remove Roots from Sump Pump",
    description: "Clear root intrusion from sump pump system",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Plumbing",
    location: "Basement - Electrical Room",
    taskType: "repair"
  },
  {
    id: "sump-pump-battery",
    name: "Replace Sump Pump Battery Backup",
    description: "Replace sump pump battery backup system. Est. $400-$500",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Plumbing",
    location: "Basement - Electrical Room",
    estimatedCost: 450,
    taskType: "repair"
  },

  // Basement Bathroom
  {
    id: "basement-shower-repair",
    name: "Repair Leaky Shower & Redo Stall",
    description: "Fix leaky basement shower and redo shower stall. Contractor needed.",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Plumbing",
    location: "Basement - Bathroom",
    contractor: true,
    taskType: "repair"
  },
  {
    id: "basement-bath-gfci",
    name: "Ground Outlet & Upgrade to GFCI (Basement Bath)",
    description: "Have electrician ground outlet and upgrade to GFCI. ~1 hour labor",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Electrical",
    location: "Basement - Bathroom",
    contractor: true,
    taskType: "repair"
  },

  // Basement Kitchen
  {
    id: "basement-kitchen-gfci",
    name: "Ground Outlet & Upgrade to GFCI (Basement Kitchen)",
    description: "Have electrician ground outlet and upgrade to GFCI. ~1 hour labor",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Electrical",
    location: "Basement - Kitchenette",
    contractor: true,
    taskType: "repair"
  },
  {
    id: "basement-sink-repair",
    name: "Repair Sink Sprayer & Pipe Leak",
    description: "Fix basement kitchen sink sprayer and pipe leak. Est. $300",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Plumbing",
    location: "Basement - Kitchenette",
    estimatedCost: 300,
    taskType: "repair"
  },

  // Main Floor Kitchen
  {
    id: "kitchen-gfci",
    name: "Switch 2 Kitchen Outlets to GFCI",
    description: "Have electrician upgrade 2 kitchen outlets to GFCI. ~1 hour labor",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Electrical",
    location: "Main Floor - Kitchen",
    contractor: true,
    taskType: "repair"
  },

  // Main Floor Bathroom
  {
    id: "main-bath-remodel",
    name: "Full Bathroom Remodel",
    description: "Full bathroom remodel including shower and door. Contractor needed.",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Interior",
    location: "Main Floor - Bathroom",
    contractor: true,
    taskType: "repair"
  },
  {
    id: "bath-window-frost",
    name: "Add Window Frost for Privacy",
    description: "Add frosted window film to main floor bathroom for privacy",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Interior",
    location: "Main Floor - Bathroom",
    taskType: "repair"
  },

  // Front Yard
  {
    id: "hose-connection-seal",
    name: "Seal Hose Connection with Putty",
    description: "Seal hose connection in front yard with putty to prevent leaks",
    frequency: "one-time",
    intervalDays: 0,
    priority: "high",
    category: "Plumbing",
    location: "Outside - Front Yard",
    taskType: "repair"
  },

  // ============ MEDIUM PRIORITY REPAIRS ============

  // Basement Electrical Room
  {
    id: "basement-mold-drywall",
    name: "Cut Out Mold/Discolored Drywall",
    description: "Remove mold-affected or discolored drywall in electrical room. Contractor recommended.",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Interior",
    location: "Basement - Electrical Room",
    contractor: true,
    taskType: "repair"
  },
  {
    id: "breaker-panel-replace",
    name: "Replace Rusting Breaker Panel",
    description: "Replace rusting electrical breaker panel. Electrician required. Est. $1,500-$3,000. Within 3 years.",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Electrical",
    location: "Basement - Electrical Room",
    estimatedCost: 2250,
    contractor: true,
    taskType: "repair"
  },
  {
    id: "asbestos-tiles",
    name: "Remove/Encapsulate Asbestos Tiles",
    description: "Remove or encapsulate asbestos floor tiles. Est. $2,000-$4,000",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Interior",
    location: "Basement - Electrical Room",
    estimatedCost: 3000,
    taskType: "repair"
  },

  // Deck
  {
    id: "deck-stair-boards",
    name: "Replace 2-3 Rotted Stair Boards",
    description: "Replace rotted stair boards on deck. Handyman task.",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Outdoor",
    location: "Outside - Deck",
    taskType: "repair"
  },

  // Siding
  {
    id: "siding-seal-holes",
    name: "Seal Small Holes/Cracks with Caulk",
    description: "Seal small holes and cracks in siding with exterior caulk",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Exterior",
    location: "Outside - Siding",
    taskType: "repair"
  },
  {
    id: "siding-trim-repair",
    name: "Reattach/Repair Falling Trim",
    description: "Reattach or repair falling trim pieces on exterior siding",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Exterior",
    location: "Outside - Siding",
    taskType: "repair"
  },
  {
    id: "siding-gap-seal",
    name: "Seal Gap at Top of Siding",
    description: "Seal gap at top of siding to prevent water and pest intrusion",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Exterior",
    location: "Outside - Siding",
    taskType: "repair"
  },
  {
    id: "siding-maintenance",
    name: "General Siding & Flashing Maintenance",
    description: "General maintenance on siding and flashing around the house",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Exterior",
    location: "Outside - Siding",
    taskType: "repair"
  },

  // Back Door
  {
    id: "back-door-paint",
    name: "Paint and Caulk Back Door Frame",
    description: "Paint and caulk the back door frame for weatherproofing",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Exterior",
    location: "Outside - Back Door",
    taskType: "repair"
  },

  // Window Well
  {
    id: "window-well-cover",
    name: "Add Window Well Cover (Left Side)",
    description: "Install window well cover on left side to prevent debris and water",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Exterior",
    location: "Outside - Left Side",
    taskType: "repair"
  },

  // Chimney
  {
    id: "chimney-sweep-mortar",
    name: "Chimney Sweep & Mortar Repair",
    description: "Professional chimney sweep and mortar repair. Est. $1,000. Complete within 1 year.",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Fireplace",
    location: "Outside - Chimney",
    estimatedCost: 1000,
    contractor: true,
    taskType: "repair"
  },
  {
    id: "chimney-crown-repair",
    name: "Repair/Patch Chimney Crown",
    description: "Repair or patch chimney crown. Mason required. Est. $500-$800",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Fireplace",
    location: "Outside - Roof",
    estimatedCost: 650,
    contractor: true,
    taskType: "repair"
  },

  // Front Yard
  {
    id: "walkway-stones",
    name: "Secure Loose Stones & Mortar Walkway",
    description: "Secure 2 loose stones and re-mortar walkway in front yard",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Outdoor",
    location: "Outside - Front Yard",
    taskType: "repair"
  },

  // Basement Crawl Space
  {
    id: "crawlspace-cracks",
    name: "Seal Crawl Space Cracks with Mortar",
    description: "Seal cracks in crawl space walls with mortar",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Structure",
    location: "Basement - Crawl Space",
    taskType: "repair"
  },

  // Basement Concrete Room
  {
    id: "concrete-room-window",
    name: "Paint and Monitor Top Window",
    description: "Paint window frame and monitor for any issues in concrete room",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Interior",
    location: "Basement - Concrete Room",
    taskType: "repair"
  },
  {
    id: "fireplace-concrete",
    name: "Pour Concrete Layer on Fireplace Bed",
    description: "Pour concrete layer on fireplace bed in basement. DIY or mason.",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Fireplace",
    location: "Basement - Concrete Room",
    taskType: "repair"
  },
  {
    id: "concrete-room-insulate",
    name: "Insulate Concrete Room",
    description: "Add insulation to basement concrete room. Contractor. Est. $2,000-$4,000",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Interior",
    location: "Basement - Concrete Room",
    estimatedCost: 3000,
    contractor: true,
    taskType: "repair"
  },

  // Main Floor Three Seasons
  {
    id: "three-seasons-minisplit",
    name: "Add Mini-Split to Three Seasons Room",
    description: "Install mini-split HVAC unit in three seasons room. Contractor needed.",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "HVAC",
    location: "Main Floor - Three Seasons Room",
    contractor: true,
    taskType: "repair"
  },
  {
    id: "sliding-door-replace",
    name: "Replace Sliding Glass Door",
    description: "Replace sliding glass door in three seasons room. Move inner door outward. Est. $3,000-$10,000",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Interior",
    location: "Main Floor - Three Seasons Room",
    estimatedCost: 6500,
    contractor: true,
    taskType: "repair"
  },

  // Main Floor Living Room
  {
    id: "living-room-floors",
    name: "Lightly Sand Floors (Prevent Splinters)",
    description: "Lightly sand hardwood floors in living room to prevent splinters",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Interior",
    location: "Main Floor - Living Room",
    taskType: "repair"
  },

  // Upper Floor Landing
  {
    id: "stair-treads",
    name: "Screw Stair Treads & Wood Filler",
    description: "Secure loose stair treads with screws and fill gaps with wood filler",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Interior",
    location: "Upper Floor - Landing",
    taskType: "repair"
  },

  // Upper Floor Master
  {
    id: "master-gutter-paint",
    name: "Paint Wood Under Gutter (Master)",
    description: "Paint exposed wood under gutter near master bedroom",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Exterior",
    location: "Upper Floor - Master Bedroom",
    taskType: "repair"
  },
  {
    id: "master-roof-nails",
    name: "Reseal Visible Nail Heads on Roof",
    description: "Reseal visible nail heads on roof near master bedroom",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Exterior",
    location: "Upper Floor - Master Bedroom",
    taskType: "repair"
  },

  // Attic
  {
    id: "attic-device-cover",
    name: "Add Cover to Device Box Near Fan",
    description: "Add safety cover to exposed device box near attic fan",
    frequency: "one-time",
    intervalDays: 0,
    priority: "medium",
    category: "Electrical",
    location: "Attic",
    taskType: "repair"
  },

  // ============ LOW PRIORITY REPAIRS ============

  // Roof
  {
    id: "flashing-nail",
    name: "Nail Down Loose Flashing Near Attic Fan",
    description: "Secure loose flashing near attic fan on roof",
    frequency: "one-time",
    intervalDays: 0,
    priority: "low",
    category: "Exterior",
    location: "Outside - Roof",
    taskType: "repair"
  },
  {
    id: "moss-spray",
    name: "Spray Moss with Trisodium Phosphate",
    description: "Treat moss on roof with Trisodium Phosphate solution",
    frequency: "one-time",
    intervalDays: 0,
    priority: "low",
    category: "Exterior",
    location: "Outside - Roof",
    taskType: "repair"
  },

  // Deck
  {
    id: "deck-cosmetic-board",
    name: "Repair Vertical Cosmetic Board Rot",
    description: "Repair rotted vertical cosmetic board on deck. Handyman task.",
    frequency: "one-time",
    intervalDays: 0,
    priority: "low",
    category: "Outdoor",
    location: "Outside - Deck",
    taskType: "repair"
  },

  // Windows
  {
    id: "window-seals-replace",
    name: "Replace Failed Window Seals (Foggy Glass)",
    description: "Replace windows with failed seals showing foggy glass. Contractor needed.",
    frequency: "one-time",
    intervalDays: 0,
    priority: "low",
    category: "Exterior",
    location: "Outside - Windows",
    contractor: true,
    taskType: "repair"
  },

  // Basement Bedroom
  {
    id: "basement-pipe-cover",
    name: "Add Cover to Main Pipe",
    description: "Add protective cover to main exposed pipe in basement bedroom",
    frequency: "one-time",
    intervalDays: 0,
    priority: "low",
    category: "Plumbing",
    location: "Basement - Bedroom",
    taskType: "repair"
  },

  // Basement Bathroom
  {
    id: "galvanized-plumbing",
    name: "Replace Galvanized Plumbing",
    description: "Replace old galvanized plumbing throughout basement. Full replacement $20,000-$30,000. Consider piecemeal approach.",
    frequency: "one-time",
    intervalDays: 0,
    priority: "low",
    category: "Plumbing",
    location: "Basement - Bathroom",
    estimatedCost: 25000,
    contractor: true,
    taskType: "repair"
  },

  // Upper Floor Landing
  {
    id: "vent-covers-replace",
    name: "Replace Vent Covers",
    description: "Replace old vent covers on upper floor landing",
    frequency: "one-time",
    intervalDays: 0,
    priority: "low",
    category: "HVAC",
    location: "Upper Floor - Landing",
    taskType: "repair"
  },

  // Upper Floor Guest Bedroom
  {
    id: "guest-pipe-replace",
    name: "Replace Curved Pipe with Straight PVC",
    description: "Replace curved drain pipe with straight PVC in guest bedroom. Est. $300",
    frequency: "one-time",
    intervalDays: 0,
    priority: "low",
    category: "Plumbing",
    location: "Upper Floor - Guest Bedroom",
    estimatedCost: 300,
    taskType: "repair"
  },

  // Upper Floor Master
  {
    id: "master-roof-replace",
    name: "Replace Bedroom Roof with Flat Material",
    description: "Replace master bedroom roof section with flat roofing material. Contractor. Est. $5,000",
    frequency: "one-time",
    intervalDays: 0,
    priority: "low",
    category: "Exterior",
    location: "Upper Floor - Master Bedroom",
    estimatedCost: 5000,
    contractor: true,
    taskType: "repair"
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
  { value: "repair", label: "Repair" }
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

// Cost categories - simplified to just Maintenance and Repair
export const costCategories = [
  "Maintenance",
  "Repair"
];
