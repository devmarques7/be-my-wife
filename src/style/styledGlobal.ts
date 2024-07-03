import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle<{ isMenuOpen?: boolean }>`
  :root {
    --font-family: ${({ theme }) => theme.typography.fontFamily};
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }

  body {
    font-family: var(--font-family);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    overflow-x: none;
    overflow-y: ${({ isMenuOpen }) => (isMenuOpen ? 'hidden' : 'auto')}; /* Disable vertical scroll when menu is open */
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
    border: none;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }

  #root, #__next {
    isolation: isolate;
  }
`;

export default GlobalStyles;
