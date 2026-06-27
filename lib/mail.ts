import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({ apiKey: process.env.APIKEY || "" });




const sendEmail = async ( to : string, subject : string,  html?: string) => {
    try {
  const info =  await brevo.transactionalEmails.sendTransacEmail({
    to: [{ email: to}],
    subject: subject, // subject line
    htmlContent: html, // HTML body
     sender: { name: 'jasayo', email: 'rabiujasayo@gmail.com' },
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  
} catch (err) {
  console.error("Error while sending mail:", err);
}
}
export default sendEmail