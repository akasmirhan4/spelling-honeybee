export const DateToStringFormatter = (date: Date) =>
  date.toLocaleDateString("en-SG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
