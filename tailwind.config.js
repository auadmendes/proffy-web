/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        profy: '#fdfd',
        background: '#F0F0F7',
        primary_lighter: '#9871F5',
        primary_light: '#916BEA',
        primary: '#8257E5',
        primary_dark: '#774DD6',
        primary_darker: '#6842C2',
        secondary: '#04D361',
        secondary_dark: '#04BF58',
        title_in_primary: '#FFFFFF',
        text_in_primary: '#D4C2FF',
        text_title: '#32264D',
        text_complement:' #9C98A6',
        text_base: '#6A6180',
        line_in_white: '#E6E6F0',
        input_background: '#F8F8FC',
        button_text: '#FFFFFF',
        box_base: '#FFFFFF',
        box_footer: '#FAFAFC',
      }
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'], // Add 'Poppins' as the first choice
      archivo: ['Archive', 'sans-serif'],
    }
  },
  plugins: [],
}

  