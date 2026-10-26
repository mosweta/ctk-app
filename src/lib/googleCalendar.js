/**
 * Builds a Google Calendar event creation URL.
 * 
 * @param {Object} event - The event object from the API.
 * @returns {string} The Google Calendar URL.
 */
export function getGoogleCalendarUrl(event) {
  if (!event || !event.title || !event.start_time) return '';

  // Helper to format date for Google (YYYYMMDDTHHmmssZ)
  const formatGCalDate = (dateString) => {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const start = formatGCalDate(event.start_time);
  if (!start) return '';

  let end = null;
  if (event.end_time) {
    end = formatGCalDate(event.end_time);
  }
  
  // If no end time, default to 1 hour after start
  if (!end) {
    const d = new Date(event.start_time);
    d.setHours(d.getHours() + 1);
    end = formatGCalDate(d.toISOString());
  }

  const dates = `${start}/${end}`;
  
  // Build the URL safely using encodeURIComponent
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: dates,
    details: event.description || '',
    location: event.location || '',
  });

  // Append the public event URL to the details if desired
  if (event.id) {
    params.append('details', `\n\nView event details: ${window.location.origin}/events/${event.id}`);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}