const subject_mail = "Thanks for joining!";

const message = (username) => {
  return `
    Dear ${username}, 
        Thanks for joining. We're thrilled to have you on board!!


    SecuReddit Inc.
    California State University
    Sacramento, CA    
  `;
};

module.exports = { subject_mail, message };
