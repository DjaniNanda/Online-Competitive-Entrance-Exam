module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      // If using TypeScript, add this line:
      // '^.+\\.tsx?$': 'ts-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!axios)', // This allows Jest to transform axios
      ],
    testEnvironment: 'jsdom', // This is important for React testing
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  };