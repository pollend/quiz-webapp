import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography'
import normalizePort from './Common/normalizePort';
import Categories from './Categories';
import Questions from './Questions';

const styles = theme => ({
  root: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    background: theme.palette.backgrounds.main
  },
  center: {
    justifyContent: 'center',
    textAlign: 'center',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)'
  },
  progress: {
    marginBottom: theme.spacing.unit
  },
});

let ws;
class Root extends Component {
  state = {
    snackMessage: { open: false, text: '' },
    connected: false
  };

  componentDidMount = () => this.connectToWS();

  connectToWS = () => {
    ws = new WebSocket(
      `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:${normalizePort(process.env.PORT || '8080')}`
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
      this.setState({ connected: true });
      ws.send(JSON.stringify({ request: 'categories' }));
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      switch (response.request) {
        default:
          console.log(response);
          break;
        case 'categories':
          this.setState({ categories: response.data });
          break;
        case 'questions':
          this.setState({ questions: response.data });
          break;
      }
    };
  };

  handleGetQuestions = (amount, category, difficulty, type) => {
    ws.send(JSON.stringify({ request: 'questions', amount, category, difficulty, type }));
  };

  setTheme = (themeId = undefined) => {
    if (!themeId && themeId !== 0)
      themeId = Number(localStorage.getItem('theme'));
    if (!themeId && themeId !== 0)
      themeId = -1;
    if (themeId === -1) {
      if (this.state.config.theme.auto) {
        const state = this.state.entities.find(entity => {
          return entity[0] === this.state.config.theme.auto.sensor
        })[1].state;
        this.props.setTheme(state <= this.state.config.theme.auto.below ? 2 : 1);
      } else {
        // theme from sunlight
        const sun = this.state.entities.find(entity => {
          return entity[0] === 'sun.sun'
        });
        if (sun)
          this.props.setTheme(sun[1].state === 'below_horizon' ? 2 : 1);
        else
          this.props.setTheme(1);
      }
    } else
      this.props.setTheme(themeId);
    localStorage.setItem('theme', themeId);
  };

  handleClose = () => this.setState({ snackMessage: { open: false, text: '' } });

  handlePageChange = (page) => {
    this.setState({ page }, () => {
      this.getEntities(this.state.entities, page);
    });
  };

  render() {
    const { setTheme } = this;
    const { classes, themes, theme } = this.props;
    const { snackMessage, connected, categories, questions } = this.state;

    return (
      <div className={classes.root}>
        {questions ?
          <Questions
            themes={themes}
            theme={theme}
            questions={questions} />
          : categories ?
            <Categories
              themes={themes}
              theme={theme}
              categories={categories}
              setTheme={setTheme}
              handlePlay={this.handleGetQuestions} />
            :
            <div className={classes.center}>
              <CircularProgress className={classes.progress} />
              {connected ?
                <Typography variant="subheading">
                  Loading data..
                </Typography>
                :
                <Typography variant="subheading">
                  Attempting to connect..
                </Typography>
              }
            </div>
        }
        <Snackbar
          open={snackMessage.open}
          autoHideDuration={2000}
          onClose={this.handleClose}
          onExited={this.handleExited}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          ContentProps={{ 'aria-describedby': 'message-id' }}
          message={<span id="message-id">{snackMessage.text}</span>} />
      </div>
    );
  }
}

Root.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  themes: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  addTheme: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired
};

export default withStyles(styles)(Root);
