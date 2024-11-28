import { DateUtils } from "../../../shared/utils/DateUtils";

describe("DateUtils", () => {
  describe("constructor", () => {
    it("should initialize with the current date if no input is provided", () => {
      const dateUtils = new DateUtils();
      const now = new Date();
      expect(dateUtils.toDate().toDateString()).toBe(now.toDateString());
    });

    it("should initialize with the provided date string", () => {
      const dateString = "2023-01-01";
      const dateUtils = new DateUtils(dateString);
      expect(dateUtils.toDate().toDateString()).toBe(
        new Date(dateString).toDateString()
      );
    });

    it("should initialize with the provided Date object", () => {
      const date = new Date("2023-01-01");
      const dateUtils = new DateUtils(date);
      expect(dateUtils.toDate().toDateString()).toBe(date.toDateString());
    });
  });

  describe("parse", () => {
    it("should parse a date string", () => {
      const dateString = "2023-01-01";
      const dateUtils = DateUtils.parse(dateString);
      expect(dateUtils.toDate().toDateString()).toBe(
        new Date(dateString).toDateString()
      );
    });

    it("should parse a Date object", () => {
      const date = new Date("2023-01-01");
      const dateUtils = DateUtils.parse(date);
      expect(dateUtils.toDate().toDateString()).toBe(date.toDateString());
    });
  });

  describe("format", () => {
    it("should format the date correctly", () => {
      const date = new Date("2023-01-01T12:34:56");
      const dateUtils = new DateUtils(date);
      expect(dateUtils.format("YYYY-MM-DD HH:mm:ss")).toBe(
        "2023-01-01 12:34:56"
      );
    });
  });

  describe("add", () => {
    it("should add years to the date", () => {
      const date = new Date("2023-01-01");
      const dateUtils = new DateUtils(date);
      dateUtils.add(1, "years");
      expect(dateUtils.toDate().getFullYear()).toBe(2024);
    });

    it("should add months to the date", () => {
      const date = new Date("2023-01-01");
      const dateUtils = new DateUtils(date);
      dateUtils.add(1, "months");
      expect(dateUtils.toDate().getMonth()).toBe(1); // February
    });

    it("should add weeks to the date", () => {
      const date = new Date("2023-01-01");
      const dateUtils = new DateUtils(date);
      dateUtils.add(1, "weeks");
      expect(dateUtils.toDate().getDate()).toBe(8);
    });

    it("should add days to the date", () => {
      const date = new Date("2023-01-01");
      const dateUtils = new DateUtils(date);
      dateUtils.add(1, "days");
      expect(dateUtils.toDate().getDate()).toBe(2);
    });

    it("should add hours to the date", () => {
      const date = new Date("2023-01-01T00:00:00");
      const dateUtils = new DateUtils(date);
      dateUtils.add(1, "hours");
      expect(dateUtils.toDate().getHours()).toBe(1);
    });

    it("should add minutes to the date", () => {
      const date = new Date("2023-01-01T00:00:00");
      const dateUtils = new DateUtils(date);
      dateUtils.add(1, "minutes");
      expect(dateUtils.toDate().getMinutes()).toBe(1);
    });

    it("should add seconds to the date", () => {
      const date = new Date("2023-01-01T00:00:00");
      const dateUtils = new DateUtils(date);
      dateUtils.add(1, "seconds");
      expect(dateUtils.toDate().getSeconds()).toBe(1);
    });
  });

  describe("subtract", () => {
    it("should subtract years from the date", () => {
      const date = new Date("2023-01-01");
      const dateUtils = new DateUtils(date);
      dateUtils.subtract(1, "years");
      expect(dateUtils.toDate().getFullYear()).toBe(2022);
    });

    it("should subtract months from the date", () => {
      const date = new Date("2023-01-01");
      const dateUtils = new DateUtils(date);
      dateUtils.subtract(1, "months");
      expect(dateUtils.toDate().getMonth()).toBe(11); // December
    });

    it("should subtract weeks from the date", () => {
      const date = new Date("2023-01-08");
      const dateUtils = new DateUtils(date);
      dateUtils.subtract(1, "weeks");
      expect(dateUtils.toDate().getDate()).toBe(1);
    });

    it("should subtract days from the date", () => {
      const date = new Date("2023-01-02");
      const dateUtils = new DateUtils(date);
      dateUtils.subtract(1, "days");
      expect(dateUtils.toDate().getDate()).toBe(1);
    });

    it("should subtract hours from the date", () => {
      const date = new Date("2023-01-01T01:00:00");
      const dateUtils = new DateUtils(date);
      dateUtils.subtract(1, "hours");
      expect(dateUtils.toDate().getHours()).toBe(0);
    });

    it("should subtract minutes from the date", () => {
      const date = new Date("2023-01-01T00:01:00");
      const dateUtils = new DateUtils(date);
      dateUtils.subtract(1, "minutes");
      expect(dateUtils.toDate().getMinutes()).toBe(0);
    });

    it("should subtract seconds from the date", () => {
      const date = new Date("2023-01-01T00:00:01");
      const dateUtils = new DateUtils(date);
      dateUtils.subtract(1, "seconds");
      expect(dateUtils.toDate().getSeconds()).toBe(0);
    });
  });

  describe("isBetween", () => {
    it("should return true if the current date is between the start and end dates", () => {
      const startDate = new Date("2023-01-01");
      const endDate = new Date("2023-12-31");
      const currentDate = new DateUtils("2023-06-15");
      expect(currentDate.isBetween(startDate, endDate)).toBe(true);
    });

    it("should return false if the current date is before the start date", () => {
      const startDate = new Date("2023-01-01");
      const endDate = new Date("2023-12-31");
      const currentDate = new DateUtils("2022-12-31");
      expect(currentDate.isBetween(startDate, endDate)).toBe(false);
    });

    it("should return false if the current date is after the end date", () => {
      const startDate = new Date("2023-01-01");
      const endDate = new Date("2023-12-31");
      const currentDate = new DateUtils("2024-01-01");
      expect(currentDate.isBetween(startDate, endDate)).toBe(false);
    });
  });
});
