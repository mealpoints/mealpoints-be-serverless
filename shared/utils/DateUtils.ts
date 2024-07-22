export class DateUtils {
  private date: Date;

  constructor(input?: string | Date) {
    this.date = input ? new Date(input) : new Date();
  }

  // Parse a date
  static parse(input: string | Date): DateUtils {
    return new DateUtils(input);
  }

  // Format the date
  format(formatString: string): string {
    const map: { [key: string]: string } = {
      YYYY: this.date.getFullYear().toString(),
      MM: ("0" + (this.date.getMonth() + 1)).slice(-2),
      DD: ("0" + this.date.getDate()).slice(-2),
      HH: ("0" + this.date.getHours()).slice(-2),
      mm: ("0" + this.date.getMinutes()).slice(-2),
      ss: ("0" + this.date.getSeconds()).slice(-2),
    };

    return formatString.replaceAll(
      /YYYY|MM|DD|HH|mm|ss/g,
      (matched) => map[matched]
    );
  }

  // Add time to the date
  add(
    amount: number,
    unit:
      | "years"
      | "months"
      | "weeks"
      | "days"
      | "hours"
      | "minutes"
      | "seconds"
  ): DateUtils {
    switch (unit) {
      case "years": {
        this.date.setFullYear(this.date.getFullYear() + amount);
        break;
      }
      case "months": {
        this.date.setMonth(this.date.getMonth() + amount);
        break;
      }
      case "weeks": {
        this.date.setDate(this.date.getDate() + amount * 7);
        break;
      }
      case "days": {
        this.date.setDate(this.date.getDate() + amount);
        break;
      }
      case "hours": {
        this.date.setHours(this.date.getHours() + amount);
        break;
      }
      case "minutes": {
        this.date.setMinutes(this.date.getMinutes() + amount);
        break;
      }
      case "seconds": {
        this.date.setSeconds(this.date.getSeconds() + amount);
        break;
      }
    }
    return this;
  }

  // Subtract time from the date
  subtract(
    amount: number,
    unit:
      | "years"
      | "months"
      | "weeks"
      | "days"
      | "hours"
      | "minutes"
      | "seconds"
  ): DateUtils {
    return this.add(-amount, unit);
  }

  // Subtract specific units of time
  subtractDays(amount: number): DateUtils {
    return this.subtract(amount, "days");
  }

  subtractWeeks(amount: number): DateUtils {
    return this.subtract(amount, "weeks");
  }

  subtractMonths(amount: number): DateUtils {
    return this.subtract(amount, "months");
  }

  // Get the native Date object
  toDate(): Date {
    return this.date;
  }
}
