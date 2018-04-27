//budget controller
const budgetController = (function(){

    //default model of expense item
    const Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

        //prototype method for Expense. Calculates percentage based on value of item and totalIncome
        Expense.prototype.calculatePercentage = function(totalIncome) {
            if (totalIncome >0) {
                this.percentage = Math.round((this.value / totalIncome)*100);
            } else {
                this.percentage = -1;
            }
        };

        //returns updated percentage
        Expense.prototype.getPercentage = function() {
            return this.percentage;
        };

    //default model of income item
    const Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //calculates total sum of each type(inc/exp)
    const calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function(cur) 
        {
            sum += cur.value;
        });
        data.totals[type] = sum;

    };

    //defaul model for all data structure
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

    //what is public from budgetController:
    return {

        //adds item based on type, with new ID, and pushing it into data object
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

        //deletes item based on type and id
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

        //calculates total inc, total exp, total budget, total percentage
        calculateBudget: function() {
            //calculate total income and exp
            calculateTotal('exp');
            calculateTotal('inc');

            //calculates total budget: totals.inc - totals.exp
            data.budget = data.totals.inc - data.totals.exp;

            //calculates total percentage (totals.exp/totals.inc)
            if (data.totals.inc >0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
            } else {
                data.percentage = -1;
            }
        },
        
        //calculates percentage for every exp based on total income
        calculatePercentage: function() {
            data.allItems.exp.forEach(function(cur){
                cur.calculatePercentage(data.totals.inc);
            });
        },

        //calculates percentage for every data.allItems.exp object
        getPercentage: function() {
            let allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        //returns budget object(budget, totalInc, totalExp, percentage)
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    }
})();



//UI CONTROLLER
const UIController = (function() {

    //DOMstrings to simplify names
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
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    //to make numbers look pretty (space in thousands, dot for decimals, 2 decimals)
    const formatNumber = function(num, type) {
        let numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.'); 

        int = numSplit[0];
        dec = numSplit[1];

        if (int.length > 3) {
            int = int.substr(0, int.length -3 ) + ' ' + int.substr(int.length -3,int.length);
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int +'.'+ dec + ' PLN';
    };

    //forEach function for nodelist, because there is no forEach method for nodeList
    let nodeListForEach = function(list, callback) {
        for (let i=0; i<list.length; i++) {
            callback(list[i], i)
        }
            
    };

    //what is public from UIController function
    return {
        //gets input: type, description and value (as number)
        getInput: function() {
            return {
                type : document.querySelector(DOMstrings.inputType).value, 
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value) //convert string to number
            }
        },

        //adds item as based on type (inc/exp), with actual data; obj is item(object), type(inc/exp)
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
            newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));

            //insert newhtml to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        //removes item with selectorID
        deleteListItem: function(selectorID){
            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        //clears input fields, and focuses on description
        clearFields: function() {
            let fields, fieldsArr;

            fields =  document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });

            fieldsArr[0].focus();

        },

        //after input: object, checks type, and shows total budget, totalInc, totalExp, percentage
        displayBudget: function(obj) {
            let type;
            obj.budget > 0 ? type='inc' : type='exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
           
            if (obj.percentage >0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        //shows percentage for every item
        displayPercentage: function(percentages) {
            let fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            //checks if is able to calculate %, and displays it
            nodeListForEach(fields, function(current, index){
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        //display actual month + year, based on array on months
        displayMonth: function() {
            let now, months, month, year;
            now = new Date();
            year = now.getFullYear();
            months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', "Grudzień"];

            month = now.getMonth();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        

        },

        //based on type(inc/exp) changing style of input fields(color)
        changeType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        //returns DOMstrings for global app controller
        getDOMstrings: function() {
            return DOMstrings;
        }
    }
})();



//GLOBAL APP CONTROLLER - communication between budgetController & UIController
const controller = (function(budgetCtrl, UICtrl) {
    

    //set's up DOM event listeners(click, enter) to ctrlAddItem(), ctrlDeleteItem() and UICtrl.changeType(inc/exp => color)
    const setupEventListeners = function() {
        const DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if(event.keyCode ===13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

    //calculating budget again, making new budget and displaying it
    const updateBudget = function() {
        // Calculate full budget
        budgetCtrl.calculateBudget();
        // Return the budget
        const budget = budgetCtrl.getBudget();
        // Display budget in UI
        UICtrl.displayBudget(budget);
    };

    //calculating percentage, making new percentage and displaying it
    const updatePercentage = function() {
        //calculate percentage
        budgetCtrl.calculatePercentage();
        //read from budget controller
        let percentages = budgetCtrl.getPercentage();
        //update
        UICtrl.displayPercentage(percentages);

    };

    //set's up sequence of functions after adding item
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

    //set's up sequence of functions after deleting item
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

    //what is public 
    return {
        //default display of date, budget object, and eventlisteners
        init: function() {
            console.log('Application has started');
            UICtrl.displayMonth();
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

//starts app
controller.init();