const emailTemplates = {
    meeting: (meeting) => `
      <h2>Meeting Scheduled</h2>
      <p>A new meeting has been scheduled.</p>
      <p><strong>Title:</strong> ${meeting.title}</p>
      <p><strong>Date:</strong> ${meeting.date}</p>
      <p><strong>Link:</strong> <a href="${meeting.
        meetingLink}">${meeting.
            meetingLink}</a></p>
    `,
  
    survey: (survey) => `
      <h2>New Survey Available</h2>
      <p>A new survey is now available for you to participate in.</p>
      <p><strong>Title:</strong> ${survey.title}</p>
      <p><strong>Deadline:</strong> ${survey.deadline}</p>
    `,
  
    newsletter: (newsletter) => `
      <h2>New Newsletter Published</h2>
      <p>Check out the latest newsletter!</p>
      <p><strong>Title:</strong> ${newsletter.title}</p>
    `,
  };
  
  module.exports = emailTemplates;
  