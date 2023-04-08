export const sample = (items, n=1) => {
  let rnd = Math.floor(Math.random()*items.length);
  return items[rnd];
}

  /**
  * Shuffles any array and returns it
  * @param {*any} items any array to be shuffled
  * @returns shuffled array
  */
export const shuffle = (items) => {
  const shuffled = items.slice();
  for (let i = items.length - 1; i > 0; i--) {
      const rnd = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[rnd]] = [shuffled[rnd], shuffled[i]];
  }
  return shuffled;
};