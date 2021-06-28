import { setSeconds } from "date-fns";

export function timeToSeconds(hours: number, minutes: number, seconds: number) {
  return hours * 60 * 60 + minutes * 60 + seconds;
}

export function timeStringToSeconds(time: string) {
  const [hours = 0, minutes = 0, seconds = 0] = time
    .split(":")
    .slice(0, 8)
    .map((value) => parseInt(value, 10));

  return timeToSeconds(hours, minutes, seconds);
}

export function timeStringToDate(input: string, date = new Date()) {
  return setSeconds(date, timeStringToSeconds(input));
}
