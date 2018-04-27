//budget controller
const budgetController = (function(){

    const Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function(totalIncome) {
        if (totalIncome >0) {
            this.percentage = Math.round((this.value / totalIncome)*100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    const Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function(cur) 
        {
            sum += cur.value;
        });
        data.totals[type] = sum;

    };

    const data = {
        allItems: {
            exp: [],
            inc:[]
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }; 

    return {
        addItem: function(type, des, val) {
            let newItem, ID;
            //creating new ID
            if (data.allItems[type].length >0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //create new item based on type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type ==='inc') {
                newItem = new Income(ID, des, val);
            }
            //push in data object
            data.allItems[type].push(newItem);
            //make it available
            return newItem;
        },

        deleteItem: function(type, id) {
            let ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            //calculate total income and exp
            calculateTotal('exp');
            calculateTotal('inc');

            //cal budget: inc - exp
            data.budget = data.totals.inc - data.totals.exp;

            //cal the percentage
            if (data.totals.inc >0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
            } else {
                data.percentage = -1;
            }
        },
         
        calculatePercentage: function() {
            data.allItems.exp.forEach(function(cur){
                cur.calculatePercentage(data.totals.inc);
            });
        },

        getPercentage: function() {
            let allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function() {
            console.log(data);
        }
    }
})();





//UI CONTROLLER
const UIController = (function() {

    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };


    return {
        getInput: function() {
            return {
                type : document.querySelector(
                    DOMstrings.inputType).value, 
                    // receives inc or exp
                description : document.querySelector( DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type) {
            let html, newHtml;
            //create html string with 
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%">  <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placeholder txt with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            //insert html to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },

        deleteListItem: function(selectorID, ){
            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearFields: function() {
            let fields, fieldsArr;

            fields =  document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });

            fieldsArr[0].focus();

        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
           

            if (obj.percentage >0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }
})();





//GLOBAL APP CONTROLLER - comunication between budgetController & UIController
const controller = (function(budgetCtrl, UICtrl) {
    
    const setupEventListeners = function() {
        const DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if(event.keyCode ===13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    const updateBudget = function() {
        // Calculate full budget
        budgetCtrl.calculateBudget();
        // Return the budget
        const budget = budgetCtrl.getBudget();
        // Display budget in UI
        UICtrl.displayBudget(budget);
    };

    const updatePercentage = function() {
        //calculate percentage
        budgetCtrl.calculatePercentage();
        //read from budget controller
        let percentages = budgetCtrl.getPercentage();
        //update
        console.log(percentages);

    };

    const ctrlAddItem = function() {
        let input, newItem;
        //Get the input data
        input = UICtrl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //Add item to budgetController
            newItem =  budgetCtrl.addItem(input.type, input.description, input.value);
            //Add item to UIController
            UICtrl.addListItem(newItem, input.type);
            //Clear the fields
            UICtrl.clearFields();
            //Calculate and update
            updateBudget();
            updatePercentage();
        }
    };

    const ctrlDeleteItem = function(event) {
        let itemID, splitID, type, ID;
        itemID =  event.target.parentNode.parentNode.parentNode.parentNode.id;
        //not the best solution, relying on DOM structure
        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            //delete item from controller
            budgetCtrl.deleteItem(type, ID);
            //delete item from UI
            UICtrl.deleteListItem(itemID);
            //update
            updateBudget();
        }
    };

    return {
        init: function() {
            console.log('Application has started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
                });
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();