// Central place for config (edit these)
import emailjs from "@emailjs/browser";



export const EMAIL_DOMAIN = "jecrc.ac.in"; // your college domain
export const EMAILJS = {
  SERVICE_ID: "service_tj0gjyg",
  TEMPLATE_ID: "template_wzlzv9i",
  PUBLIC_KEY: "kPE3q3x56EJ_mYEZm",
  // Your template variables should be: To_email, passcode, time
  
};
// Initialize EmailJS
emailjs.init(EMAILJS.PUBLIC_KEY);