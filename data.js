var ewallet = {};


setLocalStorage();

function setLocalStorage() {

    if(localStorage.getItem("ewallet")){
        ewallet = JSON.parse(localStorage.getItem('ewallet'));
    }
    else {
        // Accounts
        ewallet = {
            accounts:[
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
            ],
            paymentTypes:[
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
            ],
            categories:[
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
            ],
            transactions:[],
            cashFlowTypes:["income", "expense", "all"]
        };
        localStorage.setItem( 'ewallet',  JSON.stringify(ewallet) );
    }

}



