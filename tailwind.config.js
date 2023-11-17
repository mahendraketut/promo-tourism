/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,js}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: "'Roboto', sans-serif",
        caveat: "'Caveat', cursive",
        montserrat: "'Montserrat', sans-serif",
        poppins: "'Poppins', sans-serif",
        roboto: "'Roboto', sans-serif",
        sriracha: "'Sriracha', cursive",
      },
    },
  },
  plugins: [],
};
