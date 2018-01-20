module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    parser: 'typescript-eslint-parser',
    settings: {
        react: {
            "createClass": "createReactClass",
            "pragma": "React",
            "version": "16.2.0",
            "flowVersion": "0.53"
        },
        propWrapperFunctions: ["forbidExtraProps"]
    },
    plugins: ["react"],
    parserOptions: {
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
            modules: true,
        }
    },
    rules: {
        "react/jsx-no-bind": "error",
    }
};