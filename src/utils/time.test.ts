import { timeStringToSeconds, timeToSeconds } from "./time";

it("should convert hours minutes and seconds to seconds", () => {
  expect(timeToSeconds(12, 34, 56)).toEqual(
    45296 // (12 * 60 * 60) + (34 * 60) + (56)
  );
});

it("should convert a timestring to seconds", () => {
  expect(timeStringToSeconds("12:34:56")).toEqual(
    45296 // (12 * 60 * 60) + (34 * 60) + (56)
  );
});
