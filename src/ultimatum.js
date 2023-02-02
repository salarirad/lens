import React, { useRef, useEffect, useState, Fragment, useCallback, memo } from 'react';
import { Typography, Button, Divider, Box, TextField, Grid, Paper } from '@material-ui/core';
import Markdown from 'react-markdown/with-html';
import { DndProvider, useDrag , useDrop} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";

import { useTranslation } from 'react-i18next';


// Item types of draggable components which now are only one type
const ItemTypes = {
  OPPONENT: 'opponent',
  POT: 'pot',
  PLAYER: 'player',
}

export default function Ultimatum({content, onStore, onNotification}) {
  //props:   rule.text , help.text , itemsBox.text , playerBox.text, othersBox.text
  //props:   initialAmount ,initialAmountRandomize ,initialAmountMin ,initialAmountMax , trials

  //i18n:
  const { t } = useTranslation();
  const {tokens, trials, opponentTypes, persons} = content;

  const response = useRef(null);

  const [state, setState] = useState({
    finished: false,
    trial: null,
    trialResponses: [],
    taskStartedAt: Date.now(),
    showTooltip: true,
  });

  const [boxes, setBoxes] = useState(
    [
      {name: ItemTypes.PLAYER , amount : 0, accepts: [ItemTypes.POT, ItemTypes.OPPONENT]},
      {name: ItemTypes.POT , amount : tokens, accepts: [ItemTypes.PLAYER, ItemTypes.OPPONENT]},
      {name: ItemTypes.OPPONENT , amount : 0, accepts: [ItemTypes.POT, ItemTypes.PLAYER]},
    ]
  )
  const shuffle = (a) => {
    console.log('shuffling');
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const [shuffledPersons, setShuffledPersons] = useState(undefined);

  // on mount and unmount
  useEffect(() => {
    // Nothing yet
  },[]);


  // when finished, store responses and proceed to the next view
  useEffect(() => {
    if (state.finished) {
      const now = Date.now()
      // add timestamps
      let response = {trials: state.trialResponses};
      response.taskStartedAt = state.taskStartedAt;
      response.taskFinishedAt = now;
      response.taskDuration = now - state.taskStartedAt;
      onStore({
        'view': content,
        'response': response
      }, true); // store + next
    }
  }, [state]);

  //test action experiment
  const testAction = () => {
    console.log('testAction', state);
    console.log('shuffled : ',shuffledPersons);
    //console.log('canFinish: ', canFinishTrial());
  }

  const finishTrialAction = () => {
    if(!canFinishTrial()){
      onNotification(t('ultimatum.errors.required'));
      //onNotification(t('errors.required'));
    }
    else{
      newTrial();
    }
  }

  /***
   * this function shows if this trial can be finished by the participant
   */
  const canFinishTrial = () => {
    let result = false;
    boxes.forEach((box) => {
      if(box.name === ItemTypes.POT && box.amount === 0)
        result = true;
    });
    return result;
  }

  /***
   * token has been moved by player to a different box
   */
  const handleDrop = useCallback(
    (name, item) => {
      // item is the entity that is dropped and has {name, boxName}
      // name is the name of the repositoryBox that entity has been dropped into
      const fromBox = item.boxName;
      const destBox = name;
      //console.log('dropped on: ',destBox);
      //console.log('from : ',fromBox);
      setBoxes(boxes.map(item => {
        if(item.name === fromBox){
          return {...item, amount: item.amount-1};
        }else if(item.name === destBox){
          return {...item, amount: item.amount+1};
        }else{
          return item;
        }
      }));
    },
    [boxes],
  )

  /***
   * starts the task after showing help screen
   */
  const startTask = () => {
    /**
     * TODO: if persons are less than the number of trials it should fill the array
     */
    setShuffledPersons(shuffle(persons));
    setState({
      ...state,
      trial: 0,
      trialResponses: [],
      taskStartedAt: Date.now() //timestamp
    });
  }

  /**
   * Produce a proper trialResponse object from states and boxes
   */
  function produceTrialResponse(){
    const playerShare = boxes.find(box => box.name === ItemTypes.PLAYER).amount;
    const oppShare = boxes.find(box => box.name === ItemTypes.OPPONENT).amount;
    let trialResp = {
      trial: state.trial,
      playerShare: playerShare,
      opponentShare: oppShare
    }
    return trialResp;
  }

  /**
   * Store trial responses, then proceed to the next trial or finish the game
   * @param {*} cashed either cashed or exploded
   * @param {*} explosionProbability last probability of balloon getting exploded
   */
  const newTrial = () => {
    if(!canFinishTrial()){
      console.log('it should never come to this, because before calling newTrial, canFinishTrial has been checked!!!!');
      onNotification(t('ultimatum.errors.required'));
      return;
    }
    const trialResp = produceTrialResponse();
    setState({
      ...state,
      trialResponses: [...state.trialResponses, trialResp],
      showTooltip: true,
      finished: (state.trial>=trials-1),
      trial: state.trial+1,
    });

    // when the trial finished the tokens in boxes should reset
    setBoxes(
      [
        {name: ItemTypes.PLAYER , amount : 0, accepts: [ItemTypes.POT, ItemTypes.OPPONENT]},
        {name: ItemTypes.POT , amount : tokens, accepts: [ItemTypes.PLAYER, ItemTypes.OPPONENT]},
        {name: ItemTypes.OPPONENT , amount : 0, accepts: [ItemTypes.POT, ItemTypes.PLAYER]},
      ]
    );
  }
  /**
   * Renders instructions before the trials begin
   * @returns React elements
   */
  const renderStartScreen = () => {
    return (
      <Grid container direction='column' spacing={2} alignItems='center'>
        <Grid item><Markdown source={t('stroop.are_you_ready')} escapeHtml={false} className='markdown-text' /></Grid>
        <Grid item>
          <Button variant='outlined' onClick={() => startTask()}>{t('stroop.start')}</Button>
        </Grid>

      </Grid>
    )
  }

  if (state.trial === null) {
    return renderStartScreen();
  }

  var personIndex = state.trial;
  if(state.trial!==null && state.trial>=shuffledPersons.length){
    personIndex = state.trial % shuffledPersons.length;
  }
  /***
   * Main render part of the ultimatum experiment
   *
   */
  return (
    <Grid container direction='column' spacing={2} alignItems='stretch' justify='flex-start' className='ultimatum-container'>
      <DndProvider backend={HTML5Backend}>
        <Grid item>
          <Typography variant="h4">{t('ultimatum.rule.text')}</Typography>
        </Grid>
        <Grid item container direction='row' justify="space-around" alignItems='center'>
          <Grid item><Grid container direction='column' justify="space-around" alignItems='center'>
            <Typography color='textSecondary' variant='caption'>{t('bart.trial_label',{trial:state.trial+1, trials:trials})}</Typography>
          </Grid></Grid>
        </Grid>

        {boxes.map(({name, amount, accepts}, index) => (
          <RepositoryBox
            accept={accepts}
            name={name}
            amount={amount}
            onDrop={(item) => handleDrop(name, item)}
            key={index}
            person={shuffledPersons[personIndex]}
          />
        ))}

        <Grid item container direction="row" justify="space-around" alignItems='center'>
          <Button size='large' color='primary' variant='outlined' onClick={finishTrialAction}>{t('ultimatum.finish.button')}</Button>
          <Button size='small' color='secondary' variant='outlined' onClick={testAction}>test</Button>
        </Grid>
      </DndProvider>
    </Grid>

  );

}


/***
 * Container box for monetized entities and their interactions
 */
const RepositoryBox = memo(function RepositoryBox({
  name,
  amount,
  onDrop,
  accept,
  person,
})
{
  const style = {
    lineHeight: 'normal',
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
    backgroundColor = 'darkkhaki'
  }

  const tokensList = [];
  for(let i=0; i < amount; i++) {
    tokensList.push(<MonetizedToken type={name} name={name+i.toString()} key={name+i.toString()} boxName={name} />);
  }

  return (
    <Grid ref={drop} item xs={12} style={{ ...style, backgroundColor }} data-test-id={"repository"+name} >
      <Paper className='view-container'>
        <Grid container>
          <Grid item xs={12}>
            {name===ItemTypes.OPPONENT && <Typography>{person.name}</Typography> }
            <Typography>{name} ({amount})</Typography>
            {isActive ? 'release to drop' : ''}
          </Grid>
          <Grid item xs={12}>
              {tokensList}
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
})

/***
 * Component which renders coin tokens and handles dragging events
 */
const MonetizedToken = memo(function MonetizedToken({type, name, boxName}) {

  const style = {
    cursor: 'move',
    color: 'black'
  }

  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: { name, boxName },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name],
  )
  return (
    <span ref={drag} data-test-id={`token`}>
      <MonetizationOnIcon style={{ ...style, opacity }} />
    </span>
  )

})