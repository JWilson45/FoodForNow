/**
 * Utility function to validate required environment variables
 * @param {string[]} requiredEnvVars - List of required environment variable names
 */
function checkEnvVars(requiredEnvVars) {
  // Filter out the environment variables that are not defined
  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  // If there are any missing environment variables, log them and exit the process
  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}.`
    );
  }
}

module.exports = checkEnvVars; // Export the function to be used in other files
