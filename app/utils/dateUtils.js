/**
 * Format a date to a readable format
 * @param {string} dateString - Date string in format YYYY-MM-DD
 * @param {string} timeString - Optional time string in format HH:MM:SS
 * @param {object} options - Additional formatting options
 * @returns {string} - Formatted date string
 */
export const formatDate = (
  dateString,
  timeString = "00:00:00",
  options = {}
) => {
  const defaultOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: undefined,
    showTime: true,
    timeFormat: { hour: "2-digit", minute: "2-digit" },
  };

  const mergedOptions = { ...defaultOptions, ...options };
  const { weekday, month, day, year, showTime, timeFormat } = mergedOptions;

  try {
    const dateObj = new Date(`${dateString}T${timeString}`);

    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }

    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday,
      month,
      day,
      year,
    });

    if (showTime) {
      const formattedTime = dateObj.toLocaleTimeString("en-US", timeFormat);
      return `${formattedDate} • ${formattedTime}`;
    }

    return formattedDate;
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString || "Invalid date";
  }
};

/**
 * Check if a date is in the past
 * @param {string} dateString - Date string in format YYYY-MM-DD
 * @param {string} timeString - Optional time string in format HH:MM:SS
 * @returns {boolean} - Whether the date is in the past
 */
export const isDatePast = (dateString, timeString = "00:00:00") => {
  try {
    const dateObj = new Date(`${dateString}T${timeString}`);
    const now = new Date();

    return dateObj < now;
  } catch (error) {
    console.error("Date validation error:", error);
    return false;
  }
};

/**
 * Get the relative time from now (e.g. "2 days from now", "Yesterday")
 * @param {string} dateString - Date string in format YYYY-MM-DD
 * @param {string} timeString - Optional time string in format HH:MM:SS
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (dateString, timeString = "00:00:00") => {
  try {
    const dateObj = new Date(`${dateString}T${timeString}`);
    const now = new Date();

    const diffTime = Math.abs(dateObj - now);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (isNaN(diffDays)) {
      throw new Error("Invalid date");
    }

    if (diffDays === 0) {
      // Today
      if (dateObj > now) {
        return "Today";
      } else {
        return "Earlier today";
      }
    } else if (diffDays === 1) {
      // Yesterday or Tomorrow
      if (dateObj > now) {
        return "Tomorrow";
      } else {
        return "Yesterday";
      }
    } else if (diffDays < 7) {
      // Within a week
      if (dateObj > now) {
        return `In ${diffDays} days`;
      } else {
        return `${diffDays} days ago`;
      }
    } else {
      // More than a week
      return formatDate(dateString, timeString, { year: "numeric" });
    }
  } catch (error) {
    console.error("Relative time error:", error);
    return dateString || "Unknown date";
  }
};
