var accounts = [];
var paymentTypes = [];
var categories = [];
var transactions = [];
var cashFlowTypes = [];

setLocalStorage();

function setLocalStorage() {

    if(localStorage.getItem("accounts")&&localStorage.getItem("paymentTypes")&&localStorage.getItem("categories")&&localStorage.getItem("transactions")&&localStorage.getItem("cashFlowTypes")){
        accounts = localStorage.getItem("accounts");
        paymentTypes = localStorage.getItem("paymentTypes");
        categories = localStorage.getItem("categories");
        transactions = localStorage.getItem("transactions");
        cashFlowTypes = localStorage.getItem("cashFlowTypes");
    }
    else {
        // Accounts
        accounts = [
            {
                "name": "חשבון ראשי",
                "type": "account",
                "balance": 0
            },

            {
                "name": "חשבון צמיחה",
                "type": "savings",
                "balance": 0
            },

            {
                "name": "חשבון לייפסטייל",
                "type": "savings",
                "balance": 0
            }
        ];
        localStorage.setItem( 'accounts', accounts );
        paymentTypes = [
            {
                "name": "מזומן"
            },
            {
                "name": "אשראי"
            },
            {
                "name": "העברה בנקאית"
            },
            {
                "name": "צ'ק"
            },
            {
                "name": "דיירקט"
            },
            {
                "name": "PayPal"
            }
        ];
        localStorage.setItem( 'paymentTypes', paymentTypes );
        categories = [
            {
                "name": "משכורת",
                "type": "income"
            },
            {
                "name": "חסכונות",
                "type": "expense"
            },
            {
                "name": "דלק",
                "type": "expense"
            },
            {
                "name": "מזון",
                "type": "expense"
            },
            {
                "name": "בגדים",
                "type": "expense"
            },
            {
                "name": "עסק",
                "type": "income"
            },
            {
                "name": "ילדים",
                "type": "expense"
            },
            {
                "name": "פנאי",
                "type": "expense"
            }
        ];
        localStorage.setItem( 'categories', categories );
        transactions = [];
        localStorage.setItem( 'transactions', transactions );
        cashFlowTypes = ["income", "expense", "all"];
        localStorage.setItem( 'cashFlowTypes', cashFlowTypes );
    }

}



