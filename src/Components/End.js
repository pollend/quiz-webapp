import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';

const styles = () => ({
  cardContent: {
    minHeight: 100,
    display: 'flex',
    flexDirection: 'column'
  },
  fill: {
    flexGrow: 1
  }
});

class End extends React.Component {

  handleRestart = () => window.location.reload(true);

  render() {
    const { classes, correctAnswers, incorrectAnswers } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography variant="headline">
            End Game
          </Typography>
          <Typography variant="subheading">
            Correct: {correctAnswers.length}
          </Typography>
          <Typography variant="subheading">
            Incorrect: {incorrectAnswers.length}
          </Typography>

        </CardContent>
        <CardActions>
          <div className={classes.fill} />
          <IconButton className={classes.button} onClick={this.handleRestart}>
            <Refresh />
          </IconButton>
          <div className={classes.fill} />
        </CardActions>
      </Card>
    );
  }
}

End.propTypes = {
  classes: PropTypes.object.isRequired,
  correctAnswers: PropTypes.array.isRequired,
  incorrectAnswers: PropTypes.array.isRequired
};

export default withStyles(styles)(End);