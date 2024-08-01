import { gapi } from 'gapi-script';

export const initGoogleCalendarApi = (clientId) => {
  function start() {
    gapi.client.init({
      clientId,
      scope: 'email profile https://www.googleapis.com/auth/calendar',
    }).then(() => {
      return gapi.client.load('calendar', 'v3');
    }).then(() => {
      console.log('Google Calendar API loaded successfully');
    }).catch((error) => {
      console.error('Error loading Google Calendar API:', error);
    });
  }
  gapi.load('client:auth2', start);
};

export const addEventToGoogleCalendar = (task) => {
  const auth2 = gapi.auth2.getAuthInstance();
  const isSignedIn = auth2.isSignedIn.get();

  if (!isSignedIn) {
    console.error('User not signed in to Google');
    return;
  }

  const event = {
    summary: task.name,
    description: `Task steps: ${JSON.stringify(task.steps)}`,
    start: {
      dateTime: `${task.dueDate}T00:00:00Z`,
      timeZone: 'UTC'
    },
    end: {
      dateTime: `${task.dueDate}T23:59:59Z`,
      timeZone: 'UTC'
    },
  };

  gapi.client.calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  }).then(response => {
    console.log('Event created:', response.result.htmlLink);
    alert('Event created in Google Calendar');
  }).catch(error => {
    console.error('Error creating event:', error);
    alert('Failed to create event in Google Calendar');
  });
};
