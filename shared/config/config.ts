export const USER_MESSAGES = {
  errors: {
    image_not_processed:
      "Sorry, I was unable to process the image. Please try again in some time.",
    text_not_processed:
      "Sorry, I was unable to process your message. Please try again in some time.",
    rate_limit_exceeded:
      "You have reached the daily message limit. Please try again tomorrow.",
  },
  info: {
    feature_not_supported:
      "Sorry, we only accept food photos and text messages at the moment. The format of the message you sent is not supported. Please stay tuned for further updates.",
  },
};
export const START_HOUR_OF_DAY = 3;

// TODO: Convert this to enum later
export const QUEUE_MESSAGE_GROUP_IDS = {
  whatsapp_messages: "whatsapp_messages",
  meal_summary: "meal_summary",
  reminder: "reminder",
  meal_report: "meal_report",
  onboard_user: "onboard_user",
};

export const DEFAULT_GEO_INFO = {
  countryCode: "IN",
  timezone: "Asia/Kolkata",
};

export const MEAL_REPORT = {
  improvementFactor: 0.15,
  weeks: 12,
  maxScore: 10,
};

export const URL = {
  baseURL: process.env.BASE_URL,
  mealReport: "/report/",
};

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

export interface IBadge {
  name: string;
  description: string;
  image: string;
}

export interface IBadges {
  personality: {
    [key: string]: IBadge;
  };
  mealWin: {
    [key: string]: IBadge;
  };
}

export const BADGES: IBadges = {
  personality: {
    protein_pro: {
      name: "Protein Pro",
      description: "Strength-building, protein-rich meals are your thing!",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/personality/protein_pro.svg`,
    },
    balanced_champ: {
      name: "Balanced Champ",
      description:
        "You've nailed the balance! Your meals hit all the right macros.",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/personality/balanced_champ.svg`,
    },
    fiber_fan: {
      name: "Fiber Fan",
      description:
        "Fiber is your friend! Your diet is packed with gut-friendly fiber.",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/personality/fiber_fan.svg`,
    },
    organic_nibbler: {
      name: "Organic Nibbler",
      description:
        "Natural is your thing! You seek out organic ingredients wherever possible.",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/personality/organic_nibbler.svg`,
    },
    carb_conscious: {
      name: "Carb Conscious",
      description:
        "You keep it smart with carbs! Your meals are low on refined carbs.",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/personality/cab_conscious.svg`,
    },
    plant_powered: {
      name: "Plant-Powered",
      description:
        "Powered by plants! You prioritize veggies and plant-based proteins.",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/personality/plant_powered.svg`,
    },
    snack_sensei: {
      name: "Snack Sensei",
      description:
        "Master of the snack arts! You keep your snacks balanced and nutritious.",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/personality/snack_sensei.svg`,
    },
    flavor_adventurer: {
      name: "Flavor Adventurer",
      description:
        "You love to explore! Your enjoy a diverse range of flavors and ingredients.",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/personality/flavor_adventurer.svg`,
    },
    green_guru: {
      name: "Green Guru",
      description:
        "You're a Veggie champion! You make plants a priority on every plate.",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/personality/green_guru.svg`,
    },
    low_sugar_legend: {
      name: "Low-Sugar Legend",
      description: "Your meals skip sugar and keep your energy high!",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/personality/low-sugar_legend.svg`,
    },
  },
  mealWin: {
    nutrient_ninja: {
      name: "Nutrient Ninja",
      description:
        "You’re slicing through meals with nutrient-packed perfection!",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/meal-wins/nutrient_ninja.svg`,
    },
    consistency_champ: {
      name: "Consistency Champ",
      description:
        "No skips, no misses – your meal snapping game is always on point!",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/meal-wins/consistency_champ.svg`,
    },
    macro_master: {
      name: "Macro Master",
      description:
        "Balanced plates are your superpower. You’ve mastered the macro magic!",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/meal-wins/macro_master.svg`,
    },
    green_machine: {
      name: "Green Machine",
      description: "You’re powered by greens! You leaf no veggie uneaten.",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/meal-wins/green_machine.svg`,
    },
    breakfast_boss: {
      name: "Breakfast Boss",
      description:
        "You own the mornings – no breakfast is left behind on your watch!",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/meal-wins/breakfast_boss.svg`,
    },
    portion_pro: {
      name: "Portion Pro",
      description:
        "You’ve nailed the art of just-right portions – no more, no less!",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/meal-wins/portion_pro.svg`,
    },
    protein_packed: {
      name: "Protein Packed",
      description:
        "Strong meals, stronger you – your plates are packed with protein power!",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/meal-wins/protein_packed.svg`,
    },
    low_carb_leader: {
      name: "Low Carb Leader",
      description:
        "Who needs carbs when you’re rocking the low-carb life like a pro?",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/meal-wins/low_carb_leader.svg`,
    },
    fruit_fanatic: {
      name: "Fruit Fanatic",
      description:
        "Your meals are a fruity fiesta – sweet, healthy, and oh-so-delicious!",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/meal-wins/fruit_fanatic.svg`,
    },
    healthy_habit_hero: {
      name: "Healthy Habit Hero",
      description:
        "Logging streak unlocked! You’re a superhero of healthy meal habits.",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/meal-wins/healthy_habit_hero.svg`,
    },
    weekend_warrior: {
      name: "Weekend Warrior",
      description:
        "Weekends can’t break you – you’re crushing healthy vibes 24/7!",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/meal-wins/weekend_warrior.svg`,
    },
    balanced_boss: {
      name: "Balanced Boss",
      description:
        "Harmony on a plate! Every meal you eat is balanced perfection.",
      image: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/assets/badges/meal-wins/balanced_boss.svg`,
    },
  },
};
