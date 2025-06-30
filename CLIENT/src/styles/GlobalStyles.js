// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f5f5f5;
    color: #333333;
  }
  a {
    color: #28a745;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

export default GlobalStyles;
