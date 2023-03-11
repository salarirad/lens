import React, { Fragment, memo } from 'react';
import { useDrag, useDrop, DragPreviewImage } from 'react-dnd';
import { useTranslation } from 'react-i18next';
import { languages } from '../utils/i18n';
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import { ltrTheme, rtlTheme } from '../utils/theme';
import { grey, teal, blueGrey } from '@material-ui/core/colors';
import { Avatar, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';

// Item types of draggable components
export const ItemTypes = {
  OPPONENT: 'opponent',
  POT: 'pot',
  PLAYER: 'player',
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
  },
  paper: {
    padding: theme.spacing(2),
  },
  medium: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  grey: {
    color: theme.palette.getContrastText(grey[400]),
    backgroundColor: grey[400],
  },
  tealDark: {
    color: theme.palette.getContrastText(teal[800]),
    backgroundColor: teal[800],
  },
  blueG: {
    color: theme.palette.getContrastText(blueGrey[800]),
    backgroundColor: blueGrey[800],
  },
  height100: {
    height: '100%',
  }
}));

var language = undefined;
var personsLangPrefix = undefined;

/***
 * Container box for monetized entities and their interactions
 */
export const RepositoryBox = memo(function RepositoryBox({
  name,
  amount,
  onDrop,
  accept,
  person,
  personsPrefix,
}) {

  let { lang } = useParams();
  language = lang;
  personsLangPrefix = personsPrefix;
  console.log(personsLangPrefix);
  const { t } = useTranslation();
  const theme = (languages[language].direction === 'rtl') ? rtlTheme : ltrTheme;
  const classes = useStyles(theme);
  const style = {
    height: '128px',
  }

  const [{ canDrop, isOver }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      //connectDropTarget: connect.dropTarget()
    }),
  })

  const isActive = canDrop && isOver
  let backgroundColor = '#222'
  if (isActive) {
    backgroundColor = 'darkgreen'
  } else if (canDrop) {
    backgroundColor = blueGrey[800]
  }

  const tokensList = [];
  for (let i = 0; i < amount; i++) {
    tokensList.push(<MonetizedToken type={name} name={name + i.toString()} key={name + i.toString()} boxName={name} />);
  }

  return (
    <Grid item xs={12}>
      <Paper ref={drop} className={classes.paper} style={{ ...style, backgroundColor }} elevation={3} >
        <Grid container alignItems="center" direction="row" className={classes.height100}>
          <Grid item xs={4}>
            {name === ItemTypes.OPPONENT &&
              <OpponentInfoBar person={person} />
            }
            {name !== ItemTypes.OPPONENT &&
              <Typography>{t('dictator.' + name)}</Typography>
            }
          </Grid>
          <Grid item xs={7}>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center">
              {tokensList}
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <Grid container direction="column" justifyContent="center" alignItems="center">
              <Avatar className={`${classes.grey} ${classes.large}`}>{amount}</Avatar>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
})

/**
 * uses the persons id and the field key alongside experiment loaded personLangPrefix to produce the locales key
 * @returns string for locales key
 */
function getPersonKey(key, id) {
  console.log(personsLangPrefix);
  return personsLangPrefix + id + '.' + key;
}

const OpponentInfoBar = memo(function OpponentInfoBar({ person }) {
  const { t } = useTranslation();
  const theme = (languages[language].direction === 'rtl') ? rtlTheme : ltrTheme;
  const classes = useStyles(theme);
  return (
    <>
      {person?.avatar &&
        <Avatar alt={t(getPersonKey(person.field1, person.id))} src={process.env.PUBLIC_URL + "/images/" + person.avatar} className={classes.large} />
      }
      {!person?.avatar &&
        <Avatar className={classes.large} />
      }
      <Typography variant="body1" color="textPrimary" component="p">
        {person?.field1 && t(getPersonKey(person.field1, person.id))}
      </Typography>
      <Typography variant="body2" color="textSecondary" component="p">
        {person?.field2 && t(getPersonKey(person.field2, person.id))}
      </Typography>
      <Typography variant="body2" color="textSecondary" component="p">
        {person?.field3 && t(getPersonKey(person.field3, person.id))}
      </Typography>
    </>
  );
})

/***
 * Component which renders coin tokens and handles dragging events
 */
const MonetizedToken = memo(function MonetizedToken({ type, name, boxName }) {

  const style = {
    cursor: 'move',
  }

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type,
      item: { name, boxName },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [name],
  )
  return (
    <Grid item>
      <DragPreviewImage connect={preview} src={process.env.PUBLIC_URL + "/images/token-large.png"} />
      <span ref={drag} className='token-span' style={{ ...style, opacity: isDragging ? 0.5 : 1,}}> 
        <MonetizationOnIcon fontSize={isDragging? 'large':'medium'} /> 
      </span>
    </Grid>

  )
})