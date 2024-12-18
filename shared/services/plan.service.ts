import logger from "../config/logger";
import Plan, { IPlan } from "../models/plan.model";

const Logger = logger("plan.service");

export const getPlanById = async (planId: string): Promise<IPlan | null> => {
  try {
    Logger("getPlanById").info("");
    const plan = await Plan.findById(planId);
    return plan;
  } catch (error) {
    Logger("getPlanById").error(error);
    throw error;
  }
};
