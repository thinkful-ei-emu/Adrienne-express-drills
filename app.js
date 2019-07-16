const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));

app.get('/', (req, res)=> {
  console.log('The root path was called');
  res.send('Hello Express!');
});

app.get('/sum', (req, res) => {
  const a = req.query.a;
  const b = req.query.b;

  const numA = parseInt(a, 10);
  const numB = parseInt(b, 10);

  const c = numA + numB;

  if(!a) {
    return res.status(400).send('Please provide A');
  }
  if(!b) {
    return res.status(400).send('Please provide B');
  }
  const sum = `The sum of ${a} and ${b} is ${c}`;
  res.send(sum);
});

app.get('/cipher', (req, res) => {
  const { text, shift } = req.query;

  if(!text) {
    return res
      .status(400)
      .send('text is required');
  }

  if(!shift) {
    return res
      .status(400)
      .send('shift is required');
  }

  const numShift = parseFloat(shift);

  if(Number.isNaN(numShift)) {
    return res
      .status(400)
      .send('shift must be a number');
  }

  const base = 'A'.charCodeAt(0);

  const cipher = text
    .toUpperCase()
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if(code < base || code > (base + 26)) {
        return char;
      }
      let diff = code - base;
      diff = diff + numShift;
      diff = diff % 26;
      const shiftedChar = String.fromCharCode(base + diff);
      return shiftedChar;
    })
    .join('');

  res
    .status(200)
    .send(cipher);
});

app.get('/lotto', (req, res) => {
  const numbers = req.query.numbers;

  if(!numbers) {
    return res
      .status(200)
      .send('number is required');
  }

  if(!Array.isArray(numbers)) {
    return res
      .status(200)
      .send('numbers must be an array');
  }

  const userNums = numbers
    .map(n => parseInt(n))
    .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

  if(userNums.length !=6) {
    return res
      .status(400)
      .send('numbers must contain 6 integers between 1 and 20');
  }

  const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

  const compNums = [];
  for(let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    compNums.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }
  
  let differences = compNums.filter(num => !userNums.includes(num));

  let result;

  switch(differences.length) {
  case 0:
    result = 'Wow! Unbelievable! You could have won the mega millions!';
    break;
  case 1:
    result = 'Congratulations! You win $100!';
    break;
  case 2:
    result = 'Congratulations, you won a free ticket!';
    break;
  default:
    result = 'Sorry, you lose';
  }

  res.json({
    userNums,
    compNums,
    differences,
    result
  });

  res.send(result);
});

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});