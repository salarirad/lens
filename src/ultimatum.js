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

export default function Ultimatum({content, onStore}) {
  //props:   rule.text , help.text , itemsBox.text , playerBox.text, othersBox.text
  //props:   initialAmount ,initialAmountRandomize ,initialAmountMin ,initialAmountMax , trials

  //i18n:
  const { t } = useTranslation();
  const {tokens, trials} = content;

  const response = useRef(null);

  const [state, setState] = useState({
    finished: false,
    trial: 1,
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
    //console.log('testAction', state);
    console.log('canFinish: ', canFinishTrial());
  }

  /***
   * DEPRECATED
   * token has been moved by player to a different box
   *
   */
  function handleTokenMove(fromBox, destBox) {
    setBoxes(boxes.map(item => {
      if(item.name === fromBox){
        return {...item, amount: item.amount-1};
      }else if(item.name === destBox){
        return {...item, amount: item.amount+1};
      }else{
        return item;
      }
    }));
  }

  /***
   * this function shows if this trial can be finished by the participant
   */
  const canFinishTrial = () => {
    let result = false;
    boxes.forEach((box) => {
      if(box.name == ItemTypes.POT && box.amount == 0)
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
      const updatedBoxes = boxes.map(box => {
        if(box.name === fromBox){
          return {...box, amount: box.amount-1};
        }else if(box.name === destBox){
          return {...box, amount: box.amount+1};
        }else{
          return box;
        }
      })
      setBoxes(updatedBoxes);
    },
    [boxes],
  )

  //Testing moveToken but has bugs
  useEffect(() => {
      //handleTokenMove('pot','player');
      //handleTokenMove('pot','opponent');
  },[]);

  /***
   * Main render part of the ultimatum experiment
   *
   */
  return (
    <Grid container direction='column' spacing={2} alignItems='stretch' justify='flex-start' className='Text-container'>
      <DndProvider backend={HTML5Backend}>
        <Grid item>
          <Typography variant="h4">{t('ultimatum.rule.text')}</Typography>
        </Grid>

        {boxes.map(({name, amount, accepts}, index) => (
          <RepositoryBox
            accept={accepts}
            name={name}
            amount={amount}
            onDrop={(item) => handleDrop(name, item)}
            key={index}
          />
        ))}

        <Grid item container direction="row" justify="space-around" alignItems='center'>
          <Button size='large' color='primary' variant='outlined' onClick={testAction}>{t('test')}</Button>
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