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
    console.error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}.`
    );
    process.exit(1); // Exit the process with an error code (1 indicates failure)
  }
}

module.exports = checkEnvVars; // Export the function to be used in other files
