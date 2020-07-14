import React from 'react';
import {
  useMediaQuery,
  createMuiTheme,
  ThemeProvider,
  CssBaseline,
} from '@material-ui/core';
import { grey, lightBlue } from '@material-ui/core/colors';

type Props = {
  children: React.ReactNode;
};

export default function App(props: Props) {
  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? 'dark' : 'light',
          primary: lightBlue,
          secondary: grey,
        },
        typography: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Ubuntu", sans-serif',
        },
      }),
    [darkMode]
  );

  const { children } = props;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
