const extractUserDetails = (email) => {
  if (!email) return null;
  
  try {
    // Format: JohnDoe.CSE22@jecrc.ac.in
    const [namePart] = email.split('@')[0].split('.');
    
    // Convert JohnDoe to "John Doe"
    const name = namePart.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    return {
      name,
      email
    };
  } catch (error) {
    console.error('Error extracting user details:', error);
    return { name: 'Anonymous', email };
  }
};

export default extractUserDetails;