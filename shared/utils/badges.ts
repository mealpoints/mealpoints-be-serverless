import { BADGES, IBadges } from "../config/config";
import { IBadgeData } from "../models/mealReport.model";

export const getBadgeDataById = (
  category: keyof IBadges,
  badgeId: string
): IBadgeData | undefined => {
  if (!BADGES[category]) return undefined;
  if (!BADGES[category][badgeId]) return undefined;

  const badgeData = BADGES[category][badgeId];

  return {
    id: badgeId,
    ...badgeData,
  };
};
