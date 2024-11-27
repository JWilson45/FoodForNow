/**
 * Utility function to validate required environment variables
 * @param {string[]} requiredEnvVars - List of required environment variable names
 */
function checkEnvVars(requiredEnvVars) {
  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}.`
    );
    process.exit(1); // Exit the process with an error code
  }
}

module.exports = checkEnvVars;
