module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended",'plugin:@next/next/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/jsx-no-target-blank": "off",
    "no-unused-vars": "off",
    "react/prop-types": 0,
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
  },
};
