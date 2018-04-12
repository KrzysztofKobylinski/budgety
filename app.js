//budget controller
const budgetController = (function(){

    const Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    const Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const data = {
        allItems: {
            exp: [],
            inc:[]
        },
        totals: {
            exp: 0,
            inc: 0
        }

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
        expenseContainer: '.expenses__list'
    };


    return {
        getInput: function() {
            return {
                type : document.querySelector(
                    DOMstrings.inputType).value, 
                    // receives inc or exp
                description : document.querySelector( DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            }
        },

        addListItem: function(obj, type) {
            let html, newHtml;
            //create html string with 
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="%id%">  <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                
                html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placeholder txt with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            //insert html to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


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
    };

    const ctrlAddItem = function() {
        let input, newItem;

        //Get the input data
        input = UICtrl.getInput();

        //Add item to budgetController
        newItem =  budgetCtrl.addItem(input.type, input.description, input.value);
       
        //Add item to UIController
        UICtrl.addListItem(newItem, input.type);

        //Clear the fields
        UICtrl.clearFields();
        //Calculate full budget


        //Display budget in UI


    };

    return {
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();

