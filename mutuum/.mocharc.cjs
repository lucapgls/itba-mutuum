module.exports = {
    require: ["@babel/register", "test/mocha.setup.js"],
    extensions: ["ts", "tsx", "js"],
    spec: "test/**/*.{js,ts,tsx}",
    timeout: 10000
  };
