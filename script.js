'use strict';

// DATA
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// ELEMENTS
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// the example below helped me to create the display functions
// const movements = [200, 300, 400, -500, -600, -100, 600];

// Creating an username for every account.
accounts.forEach(acc => {
  acc.username = acc.owner
    .split(' ')
    .map(name => name[0].toLowerCase())
    .join('');
});

// formatted date function
const formattedMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// formatting the movements
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Display movements into the container movements.
const displayMovements = function (acc, sorted = false) {
  containerMovements.innerHTML = '';

  const movs = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    let type;
    mov > 0 ? (type = `deposit`) : (type = `withdrawal`);

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formattedMovementDate(date, acc.locale);

    const displayFormattedMov = formatCur(mov, acc.locale, acc.currency);

    const item = `<div class="movements">
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${displayFormattedMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', item);
  });
};

// sorting the movements
let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// display balance value
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((mov, cur) => {
    return mov + cur;
  }, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// display incomes value
function displaySummary(acc) {
  let incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((mov, cur) => {
      return mov + cur;
    }, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  // display out value
  let out = acc.movements
    .filter(mov => mov < 0)
    .reduce((mov, cur) => {
      return mov + cur;
    }, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  // display interest value
  let interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * 1.2) / 100)
    .filter(int => int > 1)
    .reduce((value, cur) => {
      return value + cur;
    }, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
}

const updateUI = function () {
  displayMovements(currentAccount);
  displayBalance(currentAccount);
  displaySummary(currentAccount);
};

// timer section
const startLogOutTimer = function () {
  let time = 300;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// main functions sections
let currentAccount, timer;

// logging into the accounts
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (
    currentAccount &&
    accounts.find(acc => acc.pin === Number(inputLoginPin.value))
  ) {
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome, ${
      currentAccount.owner.split(' ')[0]
    }!`;

    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoginPin.blur();
  inputLoginUsername.value = inputLoginPin.value = '';

  // setting the date
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };

  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);

  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
});

// transfer section
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  let amountValue;
  amountValue = Number(inputTransferAmount.value);

  let receiverAccount;
  receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amountValue > 0 &&
    receiverAccount &&
    currentAccount.balance >= amountValue &&
    receiverAccount?.username !== currentAccount.username
  ) {
    receiverAccount.movements.push(amountValue);
    currentAccount.movements.push(-amountValue);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    inputTransferTo.value = inputTransferAmount.value = '';

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// loan section
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  let amount;
  amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);

      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

// closing account section
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    let index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});
