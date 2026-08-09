export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  category: 'Milestone' | 'Wisdom' | 'Tradition' | 'Heirloom Recipe' | 'Achievement' | 'Letter';
  author: string;
  generation: string;
  location?: string;
  summary: string;
  fullStory: string;
  tags: string[];
  imageUrl?: string;
  audioUrl?: string;
  isFavorite?: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  birthYear: string;
  deathYear?: string;
  hometown: string;
  motto: string;
  avatarUrl: string;
  generation: 'Ancestors' | 'Grandparents' | 'Parents' | 'Current Gen';
  keyMemoriesCount: number;
}

export interface AlmanacDay {
  dateString: string; // e.g. "August 9"
  seasonName: string; // "High Summer"
  lunarPhase: string; // "Waxing Gibbous (82% illuminated)"
  lunarIcon: string;
  sunInfo: { sunrise: string; sunset: string };
  weatherLore: string;
  quote: { text: string; author: string };
  onThisDayEvents: { year: number; text: string; category: string }[];
}

export interface TimeCapsule {
  id: string;
  title: string;
  createdDate: string;
  unlockDate: string;
  isUnlocked: boolean;
  contributor: string;
  previewText: string;
  sealedSecretCount: number;
}

export const CURRENT_ALMANAC: AlmanacDay = {
  dateString: "August 9",
  seasonName: "High Summer Almanac",
  lunarPhase: "Waxing Gibbous (84% Light)",
  lunarIcon: "🌔",
  sunInfo: { sunrise: "06:12 AM", sunset: "08:04 PM" },
  weatherLore: "When dew lies thick upon the morning grass, expect a clear, warm day to pass.",
  quote: {
    text: "The stories we tell our children become the foundation stones upon which they build their tomorrows.",
    author: "Eleanor Vance, 1948"
  },
  onThisDayEvents: [
    { year: 1854, text: "The Great Overland Family Expedition reached the Willamette Valley after 160 days on the trail.", category: "Family Pioneer History" },
    { year: 1936, text: "Grandmother Rose recorded her very first handwritten preserve recipe in her red linen journal.", category: "Heirloom Moment" },
    { year: 1969, text: "The Harrison Family Cottage was dedicated at Whispering Pines Lake.", category: "Milestone" },
    { year: 2004, text: "Three generations assembled to plant the Centennial Oak tree at the homestead.", category: "Tradition" }
  ]
};

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: "mem-1",
    title: "Grandmother Rose's Secret Blackberry Cardamom Pie",
    date: "1942-07-14",
    category: "Heirloom Recipe",
    author: "Rose Sterling Harrison",
    generation: "Grandparents",
    location: "Cedar Crest Homestead, Oregon",
    summary: "Handwritten recipe cards handed down during the summer harvest of 1942.",
    fullStory: "Every July, when the wild blackberries ripened along the creek bed, Grandmother Rose would bake four pies before sunrise. The secret was a pinch of freshly ground green cardamom and a tablespoon of clover honey folded into the wild berry reduction. She always insisted that pie crust should be handled only with cool hands on marble.",
    tags: ["Recipe", "Baking", "Summer Harvest", "Parchment Original"],
    imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
    isFavorite: true
  },
  {
    id: "mem-2",
    title: "The Golden Anniversary Voyage to Emerald Bay",
    date: "1988-06-22",
    category: "Milestone",
    author: "Arthur & Clara Sterling",
    generation: "Ancestors",
    location: "Emerald Bay, Lake Tahoe",
    summary: "50 years of marriage celebrated with 42 family members aboard the Steamer Rose.",
    fullStory: "To mark 50 years together, Arthur rented the historic timber vessel for a sunset cruise. As the accordions played old waltzes, Arthur gave a toast that is still remembered: 'Love is not a solitary path, but a road built brick by brick through decades of shared sun and storm.'",
    tags: ["Anniversary", "Celebration", "Golden Jubilee", "Family Gathering"],
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    isFavorite: true
  },
  {
    id: "mem-3",
    title: "Lessons on Building a Craft: Grandpa Joe's Woodworking Notebook",
    date: "1965-11-03",
    category: "Wisdom",
    author: "Joseph 'Joe' Harrison",
    generation: "Grandparents",
    location: "Oakridge Workshop",
    summary: "Reflections on patience, measure, and grain from 40 years of timber craftsmanship.",
    fullStory: "Measure twice, cut once, but listen to the wood always. When you work with white oak or walnut, you are collaborating with decades of rain and sun. Respect the grain, and never force a joint that asks for gentle alignment.",
    tags: ["Woodworking", "Life Wisdom", "Craftsmanship", "Notes"],
    imageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
    isFavorite: false
  },
  {
    id: "mem-4",
    title: "The Annual Autumn Harvest Lantern Procession",
    date: "2015-10-18",
    category: "Tradition",
    author: "Elena Sterling-Harrison",
    generation: "Current Gen",
    location: "Pine Hill Orchard",
    summary: "The 30-year family tradition of crafting brass candle lanterns and walking the orchard at dusk.",
    fullStory: "Started in 1985 by Aunt Margaret, every October after the last apple is picked, adults and children carry lit parchment lanterns through the twilight rows, singing harvest folk melodies and sipping hot spiced cider.",
    tags: ["Tradition", "Autumn", "Harvest", "Lanterns"],
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    isFavorite: true
  },
  {
    id: "mem-5",
    title: "First Generation College Graduation: Sarah's Summa Cum Laude",
    date: "2021-05-15",
    category: "Achievement",
    author: "Sarah Harrison",
    generation: "Current Gen",
    location: "University Hall, Stanford",
    summary: "Receiving the University Dean's Gold Medal in Architectural Engineering.",
    fullStory: "Carrying her great-grandmother's silver fountain pen in her pocket, Sarah walked across the stage as the family cheered from the front rows. Grandma Rose wept tears of joy, remembering when girls in her village were denied school books.",
    tags: ["Graduation", "Education", "Milestone", "Pride"],
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    isFavorite: false
  }
];

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: "fam-1",
    name: "Arthur Sterling (1910–1994)",
    relation: "Great-Grandfather",
    birthYear: "1910",
    deathYear: "1994",
    hometown: "St. Paul, Minnesota",
    motto: "Honor in all deeds, kindness in all speech.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    generation: "Ancestors",
    keyMemoriesCount: 14
  },
  {
    id: "fam-2",
    name: "Rose Sterling Harrison",
    relation: "Matriarch / Grandmother",
    birthYear: "1924",
    hometown: "Cedar Crest, Oregon",
    motto: "A warm table cures a heavy heart.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    generation: "Grandparents",
    keyMemoriesCount: 28
  },
  {
    id: "fam-3",
    name: "David Harrison",
    relation: "Father",
    birthYear: "1958",
    hometown: "Portland, Oregon",
    motto: "Build for the next hundred years.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    generation: "Parents",
    keyMemoriesCount: 19
  },
  {
    id: "fam-4",
    name: "Elena & Marcus Harrison",
    relation: "Current Generation Keepers",
    birthYear: "1989 & 1992",
    hometown: "Seattle, Washington",
    motto: "Preserving yesterday for tomorrow's dreamers.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    generation: "Current Gen",
    keyMemoriesCount: 12
  }
];

export const TIME_CAPSULES: TimeCapsule[] = [
  {
    id: "tc-1",
    title: "Centennial Family Message for 2050",
    createdDate: "2000-01-01",
    unlockDate: "2050-01-01",
    isUnlocked: false,
    contributor: "Grandmother Rose & Uncle Ben",
    previewText: "Sealed on New Year's Day 2000 containing letters to our grandchildren, audio recordings of evening stories, and physical seeds from the pioneer orchard.",
    sealedSecretCount: 7
  },
  {
    id: "tc-2",
    title: "Wedding Day Sealed Box for 25th Anniversary",
    createdDate: "2010-09-18",
    unlockDate: "2035-09-18",
    isUnlocked: false,
    contributor: "David & Clara Harrison",
    previewText: "Unopened wine vintage from Napa 2010, handwritten vows, dried bouquet petals, and written predictions for our children.",
    sealedSecretCount: 4
  },
  {
    id: "tc-3",
    title: "Silver Jubilee Time Capsule (Opened 2023)",
    createdDate: "1998-05-10",
    unlockDate: "2023-05-10",
    isUnlocked: true,
    contributor: "The Harrison Siblings",
    previewText: "Contains early digital photos on floppy disk, high school journal excerpts, polaroids, and the original 1998 family crest design sketch.",
    sealedSecretCount: 12
  }
];
