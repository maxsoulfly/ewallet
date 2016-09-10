var accounts = [
    {
        "name": "חשבון ראשי",
        "type": "account",
        "balance": 0
    },

    {
        "name": "חשבון דמו",
        "type": "account",
        "balance": 10000
    },

    {
        "name": "חשבון צמיחה",
        "type": "savings",
        "balance": 1500
    },

    {
        "name": "חשבון לייפסטייל",
        "type": "savings",
        "balance": 0
    }
];

var paymentTypes = [
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

var categories = [
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

var transactions = [
    {
        "account_id" : 1,
        "type": "income",
        "date": "08/09/2016",
        "time": "10:00",
        "sum": 12000,
        "details": "משכורת",
        "payment": "העברה בנקאית",
        "category": "משכורת",
        "to_account_id": ""
    },

    {
        "account_id" : 1,
        "type": "expense",
        "date": "10/07/2016",
        "time": "10:00",
        "sum": 1500,
        "details": "השקעות",
        "payment": "העברה בנקאית",
        "category": "חסכונות",
        "to_account_id": "2"
    },
    {
        "account_id" : 1,
        "type": "expense",
        "date": "10/08/2016",
        "time": "10:00",
        "sum": 1000,
        "details": "השקעות",
        "payment": "העברה בנקאית",
        "category": "חסכונות",
        "to_account_id": "2"
    },
    {
        "account_id" : 2,
        "type": "expense",
        "date": "10/07/2016",
        "time": "10:00",
        "sum": 2000,
        "details": "השקעות",
        "payment": "העברה בנקאית",
        "category": "חסכונות",
        "to_account_id": "1"
    },

    {
        "account_id" : 1,
        "type": "expense",
        "date": "11/09/2016",
        "time": "10:00",
        "sum": 250,
        "details": "ילו",
        "payment": "מזומן",
        "category": "דלק",
        "to_account_id": ""
    },

    {
        "account_id" : 1,
        "type": "expense",
        "date": "13/09/2016",
        "time": "17:00",
        "sum": 300,
        "details": "שופר סל",
        "payment": "אשראי",
        "category": "מזון",
        "to_account_id": ""
    },

    {
        "account_id" : 1,
        "type": "expense",
        "date": "13/09/2016",
        "time": "18:00",
        "sum": 750,
        "details": "",
        "payment": "אשראי",
        "category": "בגדים",
        "to_account_id": ""
    },

    {
        "account_id" : 1,
        "type": "income",
        "date": "15/09/2016",
        "time": "10:00",
        "sum": 1000,
        "details": "WV",
        "payment": "PayPal",
        "category": "עסק",
        "to_account_id": ""
    },

    {
        "account_id" : 1,
        "type": "expense",
        "date": "14/09/2016",
        "time": "17:00",
        "sum": 2000,
        "details": "",
        "payment": "מזומן",
        "category": "ילדים",
        "to_account_id": ""
    },

    {
        "account_id" : 1,
        "type": "expense",
        "date": "14/09/2016",
        "time": "17:00",
        "sum": 100,
        "details": "",
        "payment": "אשראי",
        "category": "פנאי",
        "to_account_id": ""
    }
];

var cashFlowTypes = ["income", "expense", "all"];