import { PhysicalActivityEnum } from "../types/enums";
import { Macros } from "./../types/openai";

export const SUPPORT = {
  email: "mealpoints.coach@gmail.com",
};

export const USER_MESSAGES = {
  errors: {
    something_went_wrong: `Oops! Something went wrong. Please try again in some time. If you need help, please contact us at ${SUPPORT.email}`,
    image_not_processed: `Sorry, I was unable to process the image. Please try again in some time. If you need help, please contact us at ${SUPPORT.email}`,
    text_not_processed: `Sorry, I was unable to process your message. Please try again in some time. If you need help, please contact us at ${SUPPORT.email}`,
    rate_limit_exceeded: `You have reached the daily message limit. Please try again tomorrow. If you need help, please contact us at ${SUPPORT.email}`,
    refund: {
      user_not_subscribed: `We could not find your subscription. If you feel this is an error, please contact us at ${SUPPORT.email}`,
      subscription_already_cancelled: `Your subscription has already been cancelled. If you feel this is an error, please contact us at ${SUPPORT.email}`,
      subscription_expired: `Your subscription has expired. If you feel this is an error, please contact us at ${SUPPORT.email}`,
    },
  },
  info: {
    help: `Hello there, thank you for reaching out to Meal Points help! 🌟 This feature has not been fully implemented yet, but please feel free to contact us as ${SUPPORT.email} and we will promptly respond.`,
    refund: {
      confirmation: `Are you sure you would like to proceed with the refund? Please note that this action will cancel your subscription.`,
      success: `Your subscription has been cancelled. You will receive a refund in 3-5 business days.`,
      rejected_by_user: `Your refund request has been cancelled. If you need help, please contact us at ${SUPPORT.email}`,
      processed: `Your refund has been processed. I should be in your account in 3-5 business days. If you need any further assistance, please contact us at ${SUPPORT.email}`,
    },
    subscription: {
      expired: `Your journey doesn’t stop here. Every meal is still a chance to push forward, to fuel greatness, to be your best.

We’re rooting for you. Always.`,
      expired_header: `Your subscription ran out. Your goals didn’t.`,
      paused: `Your current subscription for the chosen plan has been expired. Please renew your subscription using the link below OR contact us at ${SUPPORT.email} if you need any further assistance.`,
      paused_header: `Subscription Paused`,
      not_subscribed: `Every meal is a chance to level up, but you need the right plan to crush it. Don’t wait—commit to yourself today. 
Click the link below to grab your plan and make every bite count.`,
      not_subscribed_header: "You’re not in the game yet",
    },
    feature_not_supported:
      "Sorry, we only accept food photos and text messages at the moment. The format of the message you sent is not supported. Please stay tuned for further updates.",
    user_not_subscribed: `Hi there! 
👋 Meal Points is a subscription-based service that offers personalized meal feedback and guidance to help you reach your health goals. 
🌟 Subscribe now at ${process.env.MEALPOINTS_BASE_URL} to get started! 
We’d love to have you join us! 😊.`,
    meal: {
      updated: `
✅ Got it! Your previous meal has been removed from today’s calorie budget.
🍽️ Share a new meal to continue tracking your progress! 🚀💪
`,
      not_updated: `
❌ Your update meal request could not be fullfilled. Please try again in some time. If you need help, please contact us at ${SUPPORT.email}`,
    },
    welcome: {
      notify_nutrition_budget: (macros: Macros) => `
🎉 Your journey starts NOW! 
      
Here’s your game plan to crush your goals:  
🍴 Calories: ${macros.calories || ""} kcal/day  
🥩 Protein: ${macros.protein || ""} g/day  
🥑 Fats: ${macros.fat || ""} g/day  
🍞 Carbs: ${macros.carbohydrates || ""} g/day  
      
Don’t worry—Meal Points has your back. We’ll track everything for you, so all you need to do is focus on making each meal a win! 💪 Let’s make this journey epic. 🚀`,
    },
  },
};
export const START_HOUR_OF_DAY = 3;

// TODO: Convert this to enum later
export const QUEUE_MESSAGE_GROUP_IDS = {
  whatsapp_messages: "whatsapp_messages",
  reminder: "reminder",
  meal_report: "meal_report",
  onboard_user: "onboard_user",
  feat_intro_meal_via_text: "feat_intro_meal_via_text",
  subscription_expired: "subscription_expired",
  bld_reminder: "bld_reminder",
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

export const CORS_OPTIONS = {
  origin: ["http://localhost:5050", /\.getmealpoints\.com$/],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

export const ACTIVITY_MULTIPLIERS: Record<PhysicalActivityEnum, number> = {
  [PhysicalActivityEnum.Sedentary]: 1.2,
  [PhysicalActivityEnum.Light]: 1.375,
  [PhysicalActivityEnum.Moderate]: 1.55,
  [PhysicalActivityEnum.Active]: 1.725,
  [PhysicalActivityEnum.VeryActive]: 1.9,
};

export const UPDATE_MEAL_BUTTON_TEXT = "Update Meal";

export const LOADING_MESSAGES = [
  "Loading... almost ready! 🌐",
  "Processing... just a moment! 🔄",
  "Loading your response... hang tight! ⏳",
  "Almost there... just wrapping things up! 🎁",
  "Fetching your results... stay tuned! 📡",
  "Compiling... nearly done! 📊",
  "One sec! Getting everything ready... 🚀",
  "Finalizing... almost set! ✅",
  "Hold on! We’re just about done... ⏱️",
  "Crunching the numbers... almost there! 🧮",
  "Getting things in order... almost done! 🔧",
  "Hold tight! We’re working on it... ✨",
  "Loading your request... nearly there! 🏗️",
  "Hang in there! Just finishing up... 🎨",
  "Analyzing... results coming soon! 🔍",
  "Hold on! We're setting things up... 🛠",
  "Just a sec! Wrapping up your request... 🎯",
  "Almost ready! Thanks for your patience... 🌟",
  "We're on it! Just putting things together... 🧩",
  "Generating your response... sit tight! ⏲️",
  "One moment! We're making sure everything's perfect... 🍀",
  "Nearly done! Your request is being finalized... 🎛️",
  "We're processing it now... almost ready! ⚡",
  "Your request is in progress... stay tuned! 📶",
  "Almost finished! Just crossing the t’s... ✍️",
  "Final steps in motion... won’t be long! 🎬",
  "Loading up your response... just a sec! ⏳",
  "We’re brewing something good... ☕",
  "Getting everything sorted... nearly there! 🗂️",
];
