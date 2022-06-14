const input = require('sync-input');

const coffeeTypes = [{name: `espresso`, water: 250, milk: 0, coffee: 16, price: 4},
                     {name: `latte`, water: 350, milk: 75, coffee: 20, price: 7},
                     {name: `cappuccino`, water: 200, milk: 100, coffee: 12, price: 6}];

let coffeeMachine = { // currently supply
    money: 550, // $
    water: 400,   // ml
    milk: 540,    // ml
    coffee: 120,  // g
    disposableCups: 9,
    fillSupplies() {
        this.water += Number(input(`Write how many ml of water you want to add:`));
        this.milk += Number(input(`Write how many ml of milk you want to add:`));
        this.coffee += Number(input(`Write how many grams of coffee beans you want to add:`));
        this.disposableCups += Number(input(`Write how many disposable coffee cups you want to add:`));
    },
    state() {
        console.log(`The coffee machine has:` +
                    `\n${this.water} ml of water` +
                    `\n${this.milk} ml of milk` +
                    `\n${this.coffee} g of coffee beans` +
                    `\n${this.disposableCups} disposable cups` +
                    `\n$${this.money} of money`);
    },
    makeCoffee() {
        let userChoice = Number(input(`What do you want to buy? 1 - espresso, 2 - latte,` +
        `3 - cappuccino, back - to main menu:`));
        if (!isNaN(userChoice)) {
            if (this.checkAvailability(userChoice)) {
              this.water = Math.max(this.water - coffeeTypes[userChoice - 1].water, 0);
              this.milk = Math.max(this.milk - coffeeTypes[userChoice - 1].milk, 0);
              this.coffee = Math.max(this.coffee - coffeeTypes[userChoice - 1].coffee, 0);
              this.disposableCups = Math.max(this.disposableCups - 1, 0);
              this.money += coffeeTypes[userChoice - 1].price;
            }
        } else if (userChoice === `back`) {
            this.work();
        }
    },
    checkAvailability(index) {
        if (this.disposableCups > 0) {
            // compute available amount of cups with each ingredient
            let availableCupsWithWater = this.water / coffeeTypes[index - 1].water;
            let availableCupsWithMilk = this.milk / coffeeTypes[index - 1].milk;
            let availableCupsWithCoffee = this.coffee / coffeeTypes[index - 1].coffee;

            // find min amount of available cups
            let availableAmountOfCups = Math.floor(Math.min(availableCupsWithWater, availableCupsWithMilk, availableCupsWithCoffee));

            // answer to user
            switch (true) {
                case availableAmountOfCups >= 1 && this.disposableCups >= 1:
                    console.log(`I have enough resources, making you a coffee!`);
                    return true;
                case availableAmountOfCups < 1 :
                    switch (true) {
                        case availableCupsWithWater < 1:
                            console.log(`Sorry, not enough water!`);
                            break;
                        case availableCupsWithMilk < 1:
                            console.log(`Sorry, not enough milk!`);
                            break;
                        case availableCupsWithCoffee < 1:
                            console.log(`Sorry, not enough coffee beans!`);
                            break;
                        case this.disposableCups < 1:
                            console.log(`Sorry, not enough disposable cups!`);
                            break;
                    }
                    return false;
            }
        }
    },
    giveMoney(){ // give money to owner
        console.log(`I gave you $${this.money}`);
        this.money -= this.money;
    },
    work(){ // start to work
        let userAction = input(`Write action (buy, fill, take, remaining, exit):`);
        while (userAction !== `exit`) {
            switch (userAction) {
                case `buy`:
                    this.makeCoffee();
                    break;
                case `fill`:
                    this.fillSupplies();
                    break;
                case `take`:
                    this.giveMoney();
                    break;
                case `remaining`:
                    this.state();
                    break;
                default:
                    console.log(`Incorrect input, please try again`);
                    break;
            }
            userAction = input(`Write action (buy, fill, take, remaining, exit):`);
        }
    }
}

coffeeMachine.work();
