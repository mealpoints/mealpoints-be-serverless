import { isNaN } from "lodash";

export const getNumber = (number_: string | undefined) => {
  if (
    number_ === undefined ||
    typeof number_ !== "string" ||
    number_.trim() === ""
  )
    return undefined;
  const number = Number(number_);
  return isNaN(number) ? undefined : number;
};

export const getDate = (date_: string | undefined) => {
  if (date_ === undefined || typeof date_ !== "string") return undefined;
  const date = new Date(date_.trim());
  return isNaN(date.getTime()) ? undefined : date;
};
