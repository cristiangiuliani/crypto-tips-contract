import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/system';

import TipsCounter from '../components/TipsCounter.component';
import SendTipFormContainer from '../containers/SendTipForm.container';
import TipsListContainer from '../containers/TipsList.container';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',

  },
});

const PageLayout = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container>
        <Grid container spacing={2}>
          <Grid>
            <SendTipFormContainer />
          </Grid>
          <Grid>
            <TipsCounter />
            <TipsListContainer />
          </Grid>
        </Grid>

      </Container>
    </ThemeProvider>
  );
};

export default PageLayout;
