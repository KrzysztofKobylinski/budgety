//budget controller
const budgetController = (function(){

})();

//UI CONTROLLER
const UIController = (function() {
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
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
        getDOMstrings: function() {
            return DOMstrings;
        }
    }

})();

//GLOBAL APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {

    const DOM = UICtrl.getDOMstrings();

    const ctrlAddItem = function() {
        //Get the input data
            const input = UICtrl.getInput();
            console.log(input);
        //Add item to budgetController

        //Add item to UIController

        //Calculate full budget

        //Display budget in UI

    }
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
        if(event.keyCode ===13 || event.which === 13) {
            ctrlAddItem();
        }
    });
})(budgetController, UIController);

