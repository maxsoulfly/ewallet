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
                    "description": "חשבון ראשי",
                    "currency":"ILS",
                    "balance": 0
                },

                {
                    "name": "חשבון צמיחה",
                    "type": "savings",
                    "description": "חשבון להשקעות",
                    "currency":"ILS",
                    "balance": 0
                },

                {
                    "name": "חשבון לייפסטייל",
                    "type": "savings",
                    "description": "חשבון לפאן",
                    "currency":"ILS",
                    "balance": 0
                }
            ],
            categories:[
                {
                    "name": "משכורת",
                    "type": "income",
                    "subcategories": []
                },
                {
                    "name": "דיור",
                    "type": "expense",
                    "subcategories": []
                },
                {
                    "name": "חסכונות",
                    "type": "expense",
                    "subcategories": []
                },
                {
                    "name": "דלק",
                    "type": "expense",
                    "subcategories": []
                },
                {
                    "name": "רכב",
                    "type": "expense",
                    "subcategories": []
                },
                {
                    "name": "תחבורה ציבורית",
                    "type": "expense",
                    "subcategories": []
                },
                {
                    "name": "חשבונות חודשיים",
                    "type": "expense",
                    "subcategories": []
                },
                {
                    "name": "מזון",
                    "type": "expense",
                    "subcategories": []
                },
                {
                    "name": "ילדים",
                    "type": "expense",
                    "subcategories": []
                },
                {
                    "name": "ביגוד והנעלה",
                    "type": "expense",
                    "subcategories": []
                },
                {
                    "name": "לימודים",
                    "type": "expense",
                    "subcategories": []
                },
                {
                    "name": "פנאי ובילויים",
                    "type": "expense",
                    "subcategories": []
                },
                {
                    "name": "חופשות",
                    "type": "expense",
                    "subcategories": []
                },
                {
                    "name": "אחר",
                    "type": "expense",
                    "subcategories": []
                },
                {
                    "name": "עסק",
                    "type": "income",
                    "subcategories": []
                },
                {
                    "name": "מזומן",
                    "type": "payment"
                },
                {
                    "name": "אשראי",
                    "type": "payment"
                },
                {
                    "name": "העברה בנקאית",
                    "type": "payment"
                },
                {
                    "name": "צ'ק",
                    "type": "payment"
                },
                {
                    "name": "דיירקט",
                    "type": "payment"
                },
                {
                    "name": "PayPal",
                    "type": "payment"
                }
            ],
            transactions:[],
            cashFlowTypes:["income", "expense", "all"],
            timeFrame: [
                {
                    "name": "weekly",
                    "text": "שבועי",
                    "type": "recurring"
                },
                {
                    "name": "monthly",
                    "text": "חודשי",
                    "type": "recurring"
                },
                {
                    "name": "annually",
                    "text": "שנתי",
                    "type": "recurring"
                }
            ],
            currencies: [
                {
                    "name": "USD",
                    "display": 'דולר'
                },
                {
                    "name": "ILS",
                    "display": 'ש"ח'
                },
                {
                    "name": "EUR",
                    "display": 'אירו'
                },
                {
                    "name": "PND",
                    "display": 'ליט"ש'
                }
            ],
            budgets: []
        };
        localStorage.setItem( 'ewallet',  JSON.stringify(ewallet) );
    }

}



