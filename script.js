
moment.locale("he");

setLocalStorage();

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }
    else{
        return results[1] || 0;
    }
};

// Save to Local Storage
function saveToStorage () {
    localStorage.setItem( 'ewallet',  JSON.stringify(ewallet) );
}

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

/***************************************************
 ACCOUNTS.HTML FUNCTIONS
 ***************************************************/
function accountsRender(type) {
    var accountsHtmlRender = "";
    var accounts = ewallet.accounts;
    for(var i = 0; i < accounts.length; i ++) {
        if (accounts[i].type == "account" && accounts[i].type == type) {
            accountsHtmlRender += '<p><a href=' + i + '"index.html?account_id=">' + accounts[i].name + '</a> </p>';
        }
        else if (accounts[i].type == "savings" && accounts[i].type == type) {
            accountsHtmlRender += '<p><a href="savings-account.html?account_id=' + i + '">' + accounts[i].name + '</a> </p>';
        }
        else if (accounts[i].type == "account" &&  accounts[i].type == type.substring(0, 7)
        || accounts[i].type == "savings" &&  accounts[i].type == type.substring(0, 7)) {
            accountsHtmlRender += '<p><a href="account-edit.html?account_id=' + i + '">' + accounts[i].name + '</a> </p>';
        }

    }
    $("#accounts").html(accountsHtmlRender);
}


/***************************************************
    VIEW_ACCOUNT.HTML FUNCTIONS
***************************************************/
function viewAccountRender() {
    // var account_id = $.urlParam('account_id');
    var account_id = 0;
    var account = ewallet.accounts[account_id];
    var allTransactions = getAccountTransactions(ewallet.transactions, account_id);

    var sum = calcBalanceCurMonth(allTransactions);
    var income = (sum.income > 0 ? sum.income.toLocaleString() + "+" : sum.income.toLocaleString());
    var expense = (sum.expense > 0 ? sum.expense.toLocaleString() + "-" : sum.expense.toLocaleString());
    var balance = $(".balance").find("p");

    // SET ACCOUNT VALUES
    balance.html(account.balance);
    if (parseFloat(account.balance) < 0) {
        balance.removeClass("green").addClass("red");
    }
    else {
        balance.removeClass("red").addClass("green");
    }
    // $(".title").find("h1").html(account.name);
    // $("head title").html(account.name);
    $("#income").html(income);
    $("#expense").html(expense);

    var links = $("a.account_id");
    for (var i = 0; i<links.length; i++) {
        var href = links[i].href;
        links[i].href =href+"?account_id=" + account_id;
    }


}
// FUNCTIONS
function getAccountTransactions(transactions, account_id) {
    var accountTransactions = [];

    for (var i = 0; i < transactions.length; i++){
        if (transactions[i].account_id == account_id || transactions[i].to_account_id == account_id ) {
            accountTransactions.push(transactions[i]);
            console.log(transactions[i].category + " - " + transactions[i].details + " ["+transactions[i].type+"]:" + transactions[i].sum);
        }
    }
    return accountTransactions;
}

function makeDate(date) {
    // formats the date to dd/mm/yyyy
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    var finalDate = "";
    finalDate += (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
    finalDate += "/";
    finalDate += ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
    finalDate += "/";
    finalDate += date.getFullYear();
    return finalDate
}

function currMonth() {
    var date = new Date();
    var today = "";

    // returning the month with 0 in the beginning (if needed)
    today += ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
    today += "/" + date.getFullYear();
    return today;
}

function calcBalanceCurMonth(transactions) {
    var thisMonth = currMonth();
    var sum = {
        "income": 0,
        "expense": 0
    };

    var day = "";
    for (var i = 0; i < transactions.length; i++){

        // more info: http://momentjs.com/
        day = moment(transactions[i].date);
        if (day.format('L').substring(3) == thisMonth) {
            sum[transactions[i].type] += parseFloat(transactions[i].sum);
            console.log("calculating: " + transactions[i].type + ": " + parseFloat(transactions[i].sum) + "("+sum[transactions[i].type]+")");
        }
    }

    return sum;
}

//

/***************************************************
    NEW-INCOME.HTML / NEW-OUTCOME.HTML
 ***************************************************/
function newTransactionRender(type) {
    var account_id = $.urlParam('account_id');
    var now = new Date();
    var day = addZero(now.getDate());
    var month = addZero(now.getMonth()+1); // getMonth() gives you 0-11, so I add 1 to make a real month
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    var time = addZero(now.getHours()) + ":" + addZero(now.getMinutes());
    var paymentTypesHtml = categoriesRender("payment");
    var categoriesHtml = categoriesRender(type);

    // SET VALUES
    $('#account_id').val(account_id);
    $('#type').val(type);
    $('#date').val(today);
    $('#time').val(time);
    $('#payment').html(paymentTypesHtml);
    $('#category').html(categoriesHtml);
    $('#back').attr("href", "index.html?account_id=" + account_id);
}

function addTransaction() {
    var transactions = ewallet.transactions;
    var accounts = ewallet.accounts;
    var form = $("#newIncome");
    var account_id = form.find("input#account_id").val();
    var transaction = {
        "account_id" : account_id,
        "type": form.find("input#type").val(),
        "date": form.find("input#date").val(),
        "time": form.find("input#time").val(),
        "sum": form.find("input#amount").val(),
        "details": form.find("input#details").val(),
        "payment": form.find("select#payment option:selected").text(),
        "category": form.find("select#category option:selected").text(),
        "from_account_id": form.find("input#from_account_id").val(),
        "to_account_id": form.find("input#to_account_id").val()
    };

    if (transaction.type == "income") {
        accounts[transaction.account_id].balance = accounts[account_id].balance + parseFloat(transaction.sum);

    }
    else if (transaction.type == "expense") {
        accounts[transaction.account_id].balance = accounts[account_id].balance - parseFloat(transaction.sum);
    }

    transactions.push(transaction);
    saveToStorage ();

    history.back();
}

// formats a month / day to have "0" in the beginning
function addZero(num) {
    return ("0" + num).slice(-2);
}


// returns a string with categories within OPTION TAGS
function categoriesRender(type, selected) {
    var categoriesHtml = "";

    for (var i=0; i<ewallet.categories.length; i++) {
        if (ewallet.categories[i].type==type) {
            categoriesHtml += optionRender(ewallet.categories[i].name, selected);
        }
    }
    return categoriesHtml;
}

// returns a string with timeFrame within OPTION TAGS
function timeFrameRender(selected) {
    var timeFrameHtml = "";

    for (var i=0; i<ewallet.timeFrame.length; i++) {
        timeFrameHtml += optionDifferTextRender(ewallet.timeFrame[i].name, ewallet.timeFrame[i].text, selected);
    }
    return timeFrameHtml;
}

// return a string with <option> TAG
function optionRender(value, selected) {
    return optionDifferTextRender(value, value, selected);
}

// optionDifferTextRender receives value, text & selected
// returns a string with rendered <option> TAG
function optionDifferTextRender(value, text, selected) {
    var option = '<option value="'+value+'"';
    if (selected==value) {
        option += ' selected';
    }
    option += '>'+text+'</option>';
    return option
}

/***************************************************
 NEW-TRANSACTION.HTML
 ***************************************************/

function newTransactionPageRender () {
    var accounts = ewallet.accounts;
    var account_id = $.urlParam('account_id');
    var accountOptionsHtml = "";
    var now = new Date();
    var day = addZero(now.getDate());
    var month = addZero(now.getMonth()+1);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    var time = addZero(now.getHours()) + ":" + addZero(now.getMinutes());
    var category = "חסכונות";
    var type = "expense";
    var payment = "מזומן";

    for (var i = 0; i < accounts.length; i++) {
        if (i != account_id) {
            accountOptionsHtml += optionDifferTextRender(i, accounts[i].name, "");
        }
    }

    // SET VALUES
    $('#account_id').val(account_id);
    $('#type').val(type);
    $('#date').val(today);
    $('#time').val(time);
    $('#payment').val(payment);
    $('#category').val(category);
    $('#from_account_id').html(optionDifferTextRender(account_id, accounts[account_id].name, ""));
    $('#to_account_id').html(accountOptionsHtml);


    if (accounts[account_id].type == "account")
        $('#back').attr("href", "index.html?account_id=" + account_id);
    else if (accounts[account_id].type == "savings")
        $('#back').attr("href", "savings-account.html?account_id=" + account_id);
}

function addATransaction() {
    var transactions = ewallet.transactions;
    var accounts = ewallet.accounts;
    var form = $("#newIncome");
    var account_id = form.find("input#account_id").val();
    var to_account_id = form.find("select#to_account_id option:selected").val();
    var transaction = {
        "account_id" : account_id,
        "type": form.find("input#type").val(),
        "date": form.find("input#date").val(),
        "time": form.find("input#time").val(),
        "sum": form.find("input#amount").val(),
        "details": "העברה",
        "payment": form.find("input#payment").val(),
        "category": form.find("input#category").val(),
        "from_account_id": form.find("input#from_account_id").val(),
        "to_account_id": to_account_id
    };
    // subtract sum from current account balance
    accounts[account_id].balance = parseFloat(accounts[account_id].balance) - parseFloat(transaction.sum);


    // add sum to chosen account balance
    accounts[to_account_id].balance = parseFloat(accounts[to_account_id].balance) + parseFloat(transaction.sum);


    transactions.push(transaction);
    saveToStorage ();


    history.back();
}

/*********************************************************
 * HISTORY.HTML
 ********************************************************/

function renderHistoryPage() {


    var account_id = $.urlParam('account_id');
    var accountTransactions, transactionsListHtml;
    var ulTable = $('ul.history.table');
    var dateTitle = $('div.date p');
    var accounts = ewallet.accounts;
    var viewDate = $("#viewDate");

    var offset = $.urlParam('offset') != null ? $.urlParam('offset') : 0;
    // RENDER PAGE:
    if (accounts[account_id].type == "account")
        $('#back').attr("href", "index.html?account_id=" + account_id);
    else if (accounts[account_id].type == "savings")
        $('#back').attr("href", "savings-account.html?account_id=" + account_id);

    var links = $("ul.nav a");
    for (var i = 0; i < links.length; i++) {
        var href = links[i].href;
        links[i].href = href + "&account_id=" + account_id;
        links[i].href = addCashFlowToUrl(displayParam, links[i].href);
    }

    $(".title img").attr("src", "hist_" + displayParam.cashFlowType + ".png");

    $("ul.nav li").removeClass("active");

    switch (displayParam.by) {
        case "weekly":
            $("li#displayWeekly").addClass("active");
            displayParam = getStartEnd(displayParam );
            // text display in the title
            if (displayParam.startDate.substring(3, 5) != displayParam.endDate.substring(3, 5)) {
                dateTitle.find('span.date').text(displayParam.startDate.substring(0, 5) + "-" + displayParam.endDate);
            }
            else {
                dateTitle.find('span.date').text(displayParam.startDate.substring(0, 2) + "-" + displayParam.endDate);
            }
            break;
        case "monthly":
            $("li#displayMonthly").addClass("active");
            displayParam = getStartEnd(displayParam);
            // text display in the title
            dateTitle.find('span.date').text(displayParam.startDate.substring(3));
            break;
        case "annually":
            $("li#displayAnnually").addClass("active");
            displayParam = getStartEnd(displayParam);
            // text display in the title
            dateTitle.find('span.date').text(displayParam.startDate.substring(6));
            break;
        case "all":
        default:
            $("li#displayAll").addClass("active");
            dateTitle.toggle();
    }


    accountTransactions = getTransactions(account_id, displayParam);
    transactionsListHtml = transactionsListRender(accountTransactions, account_id);
    ulTable.html(ulTable.html() + transactionsListHtml);
}
// -------------  FUNCTIONS  -------------------- //
function getStartEnd(displayParam) {
    var curr = new Date();
    var firstDay,lastDay;

    switch (displayParam.by) {
        case "weekly":
            firstDay = new Date((curr.addDays(parseInt(displayParam.offset*7)))).addDays(-curr.getDay()); // First day is the day of the month - the day of the week
            lastDay = firstDay.addDays(6); // last day is the first day + 6

            break;
        case "monthly":
            firstDay = new Date(curr.getFullYear(), curr.getMonth() + parseInt(displayParam.offset), 1);
            lastDay = new Date(curr.getFullYear(), curr.getMonth() + 1 + parseInt(displayParam.offset), 0);
            break;
        case "annually":
            firstDay = new Date(curr.getFullYear() + parseInt(displayParam.offset), 1, 1);
            lastDay = new Date(curr.getFullYear() + parseInt(displayParam.offset), 11, 31);
            break;
        default:
    }
    displayParam.startDate = makeDate(firstDay);
    displayParam.endDate = makeDate(lastDay);

    return displayParam;
}

function isDateBetween(dateFrom, dateTo, dateCheck) {

    dateCheck = makeDate(dateCheck);
    var d1 = dateFrom.split("/");
    var d2 = dateTo.split("/");
    var c = dateCheck.split("/");

    var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);  // -1 because months are from 0 to 11
    var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
    var check = new Date(c[2], parseInt(c[1])-1, c[0]);

    return check >= from && check <= to;
}

function offset(offset) {
    var currentUrl = window.location.href;
    displayParam.offset = parseInt(displayParam.offset) + parseInt(offset);
    currentUrl = addOffsetToUrl(displayParam, currentUrl);
    window.location.href = currentUrl;
}

function getTransactions(account_id, displayParam) {
    var transactionsFiltered = [];
    var transactions = ewallet.transactions;
    for (var i = 0; i < transactions.length; i++) {

        if (displayParam.by == "all") {
           if (isTransactionAllowed(displayParam, transactions[i], account_id ))
               transactionsFiltered.push(transactions[i]);
        }
        else {
            if (isDateBetween(displayParam.startDate, displayParam.endDate, ewallet.transactions[i].date)) {
                if (isTransactionAllowed(displayParam, transactions[i], account_id ))
                    transactionsFiltered.push(transactions[i]);
            }
        }
    }
    return transactionsFiltered;
}

function isTransactionAllowed(displayParam, transaction, account_id ) {
    if (displayParam.cashFlowType == "all") {
        if (transaction.account_id == account_id || transaction.to_account_id == account_id) {
            return true;
        }
    }
    else if(displayParam.cashFlowType == "income") {
        if (transaction.account_id == account_id && transaction.type == "income" || transaction.to_account_id == account_id && transaction.type == "expense" ) {
            return true;
        }
    }
    else if(displayParam.cashFlowType == "expense") {
        if (transaction.account_id == account_id && transaction.type == "expense" || transaction.to_account_id == account_id && transaction.type == "income" ){
            return true;
        }
    }

    return false;
}

function transactionsListRender(transactions, account_id) {
    var listHtml = "";
    for (var i = 0; i < transactions.length; i++) {
        listHtml += listItemRender(transactions[i], account_id, i);
    }
    return listHtml;
}

function listItemRender(transaction, account_id, transaction_id) {
    var li = '';
    li += '<li><span>' +
                    '<a href="'+transaction.type+'-edit.html?transaction_id='+transaction_id+'">' +
                        transaction.category +
                    '</a>' +
                '</span>';
    if (transaction.type == "income" && transaction.account_id == account_id || transaction.type == "expense" && transaction.to_account_id == account_id ) {
        li += '<span class="green">' + transaction.sum + '+</span>';
    } else {
        li += '<span class="red">' + transaction.sum + '-</span>';
    }
    li += '</li>';
    return li;
}

function changeCashFlow(displayParam) {
    var currentUrl = window.location.href;
    var cashFlowTypes = ewallet.cashFlowTypes;
    var i = arraySearch(cashFlowTypes, displayParam.cashFlowType);
    var currCashFlowType = displayParam.cashFlowType;
    i++;
    if (i >= 3) i = 0;
    displayParam.cashFlowType = cashFlowTypes[i];
    currentUrl = addCashFlowToUrl(displayParam, currentUrl);
    window.location.href = currentUrl;
}

function addCashFlowToUrl(displayParam, url) {
    if (url.indexOf('&cashFlowType') > -1) {
        var indexOf = url.indexOf("&cashFlowType");
        url = url.substring(0,indexOf);
    }
    url += "&cashFlowType=" + displayParam.cashFlowType;

    return url;
}

function addOffsetToUrl(displayParam, url) {
    if (url.indexOf('&offset') > -1) {
        var indexOf = url.indexOf("&offset");
        url = url.substring(0,indexOf);
    }
    url += "&offset=" + displayParam.offset;

    return url;
}
function arraySearch(arr,val) {
    for (var i=0; i<arr.length; i++)
        if (arr[i] == val)
            return i;
    return false;
}

/*********************************************************
 *      SAVINGS-ACCOUNT.HTML
 *********************************************************/
function savingsAccountRender() {

    var account_id = $.urlParam('account_id');
    var allTransactions = getAccountTransactions(ewallet.transactions, account_id);
    allTransactions.sort(function(a,b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    //var ulTable = $('ul.table');
    var transactionListHtml = "";

    for (var i = 0; i < allTransactions.length && i < 5; i++) {
        transactionListHtml += '<li>';
        transactionListHtml += '<span>' + makeDate(allTransactions[i].date) + '</span>';
        if (allTransactions[i].account_id == account_id)
            transactionListHtml += '<span class="red">' + allTransactions[i].sum + '-</span>';
        else if (allTransactions[i].to_account_id == account_id)
            transactionListHtml += '<span class="green">' + allTransactions[i].sum + '+</span>';
        transactionListHtml += '</li>';
    }
    $('ul.table').html(transactionListHtml);

}



/*********************************************************
 *     ACCOUNT-EDIT.HTML
 *********************************************************/

// Render ACCOUNT-EDIT.HTML Page Values
function accountEditPageRender() {
    var account_id = $.urlParam('account_id');
    var account = ewallet.accounts[account_id];

    // Set Values
    $("#account_id").val(account_id);
    $("#account_name").val(account.name);
    $("#type").val(account.type);
    $("#description").val(account.description);
    $("#balance").val(account.balance);
    // Populate Currencies
    //$("#currency").html(currenciesListRender(account.currency));
}

function updateAccount() {

    var form = $("#accountEdit");
    var account_id = form.find("input#account_id").val();

    // save new values
    ewallet.accounts[account_id] = {
        "name": form.find("input#account_name").val(),
        "type": form.find("input#type").val(),
        "description": form.find("input#description").val(),
        "currency": form.find("#currency").val(),
        "balance": form.find("input#balance").val(),
    };

    saveToStorage ();

    history.back();
}

function deleteAccount() {

    var form = $("#accountEdit");
    var account_id = form.find("input#account_id").val();

    ewallet.accounts.splice(account_id, 1);

    saveToStorage();
    history.back();

}

// Returns html text with list of <option> TAGS
function currenciesListRender(selected) {
    var currencies = ewallet.currencies;
    var selectHtml = "";

    for (var i = 0; i < currencies.length; i++) {
        selectHtml += optionDifferTextRender(currencies[i].name, currencies[i].display, selected);
    }

    return selectHtml;
}


/*********************************************************
 *     NEW-ACCOUNT.HTML
 *********************************************************/

// Render ACCOUNT-EDIT.HTML Page Values
function newAccountPageRender() {
    var type = $.urlParam('type');

    // Set Values
    $("#type").val(type);
    // Populate Currencies
    //$("#currency").html(currenciesListRender("ILS"));
}

function addAccount() {

    var form = $("#accountEdit");
    // save new values
    var newAccount = {
        "name": form.find("input#account_name").val(),
        "type": form.find("input#type").val(),
        "description": form.find("input#description").val(),
        "currency": form.find("#currency").val(),
        "balance": form.find("input#balance").val(),
    };
    ewallet.accounts.push(newAccount);

    saveToStorage ();

    history.back();
}


/*******************************************
 *  CATEGORY-EDIT.HTML
 ******************************************/
// populate categories
function categoriesEditRender() {

    var categories = ewallet.categories;
    var categoriesHtml = "";
    var title = {
        "income" : "הגדרת מקורות הכנסה",
        "expense": "הגדרת קטגוריות",
        "payment": "הגדרת אמצעי תשלום"
    };

    $('.title h1').text(title[type]);

    // render all
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].type == type) {
            categoriesHtml += categoryHtml(categories[i], i);
        }
    }

    $('.form').html( categoriesHtml);
    $('head title').html(title[type]);
}


// one category html render
function categoryHtml(category, i) {
    var html = "";

    html += '<p id="p-'+i+'" class="edit">';
    html += '<input type="hidden" id="type-'+i+'" value="' + category.type + '">';
    html += '<input type="text" id="category-' + i + '" value="' + category.name + '" title="" onkeyup="updateCategory(' + i + ', ewallet.categories[' + i + '])">';
    html += '<a href="javaScript: deleteCategory(' + i + ')" class="remove">x</a>';
    html += '</p>';

    return html;
}

function addCategoryToList(type) {
    var categories = ewallet.categories;
    var text = {
        "income" : "מקור הכנסה חדש",
        "expense": "קטגוריה חדשה",
        "payment": "אמצעי תשלום"
    };
    var form =  $('.form');
    var newCategory = {"name":text[type],"type":type};
    categories.splice(categories.length, 1 , newCategory);
    saveToStorage();

    ewallet = JSON.parse(localStorage.getItem('ewallet'));
    //alert(ewallet.categories.length);

    form.html(categoriesEditRender(type));
}

function updateCategory(i, category) {
    category.name = $('.form').find("#category-"+i).val();
    saveToStorage();
}


function deleteCategory(i) {
    $('.form').find("#p-"+i).hide(500);
    ewallet.categories.splice(i,1);
    saveToStorage();
    ewallet = JSON.parse(localStorage.getItem('ewallet'));
    //alert(ewallet.categories.length);
}

/*************************************************
*   BUDGET.HTML
************************************************ */

function BudgetHtmlRender() {
    var budgets = ewallet.budgets;
    var budgetsHTML = "";

    for (var i = 0; i < budgets.length; i++) {
        budgetsHTML += displayBudget(budgets[i], i);
    }

    $('#budgets').html(budgetsHTML);
}


function displayBudget(budget, budget_id) {
    var html = "";
    var budgetUsed = budgetUse(budget);
    var budgetLeft = budget.limit - budgetUsed;
    var currency = displayCurrencyHeb(ewallet.currencies, budget.currency);
    var gfx = getPercentageAndColor(budgetLeft, budget.limit);

    html += '<div class="budget">';
    html += '<p class="title">' + budget.limit + ' ' + currency + ' לטובת '+ budget.category +' - <span class="green"><a href="budget-edit.html?budget_id=' + budget_id + '">עריכה</a></span></p>';
    html += '<div class="meter ' + gfx.color + ' nostripes">';
    html += '<span style="width: '+gfx.percent+'%"></span>';
    html += '</div>';
    html += '<p class="smaller">יתרה: <span class="used">' + budgetLeft + '</span> מתוך <span class="limit">' + budget.limit + '</span> ' + currency + '</p>';
    html += '</div>';

    return html;
}

function isTransactionWithinTimeFrame(transaction, timeFrameType) {
    var now = new Date();
    var displayParam = {
        "by": timeFrameType,
        "startDate": "",
        "endDate": "",
        "offset": 0,
        "cashFlowType": "expense"
    };
    displayParam = getStartEnd(displayParam);

    return isDateBetween(displayParam.startDate, displayParam.endDate, transaction.date);
}

function getPercentageAndColor(left, limit) {
    var gfx = {
        "percent": 0,
        "color:": "green"
    };
    gfx.percent = (left/limit)*100;
    if (gfx.percent >= 0 && gfx.percent < 25) gfx.color = "red";
    else if (gfx.percent >= 25 && gfx.percent < 50) gfx.color = "orange";
    else if (gfx.percent >= 50 && gfx.percent < 75) gfx.color = "yellow";

    return gfx;

}

function displayCurrencyHeb(currencies, currencyName ) {
    var currencyDisplay = "";
    for(var i = 0; i < currencies.length; i++) {
        if (currencies[i].name == currencyName) {
            currencyDisplay = currencies[i].display;
            break;
        }
    }
    return currencyDisplay;
}

function budgetUse(budget) {
    var transactions = ewallet.transactions;
    var sum = 0;

    var account_ids = budget.accounts;

    for (var i = 0; i < transactions.length; i++) {
        if (isTransactionInBudget(transactions[i], budget)) {
            sum += parseFloat(transactions[i].sum);
        }
    }


    console.log("sum: " + sum);

    return sum;
}

function isTransactionInBudget(transaction, budget) {
    // ADD ONLY WHEN IF IT'S the requested account, requested category, requested time frame and requested payment type
    // if is part of monitored accounts
    if (isAccountInBudget(transaction.account_id, budget.accounts)) {
        // if part of monitored category
        if (transaction.category == budget.category) {
            // if part of monitored time period
            if (isTransactionWithinTimeFrame(transaction, budget.timeFrameType)) {
                // if part of monitored payment
                if (isPaymentTypeInBudget (budget, transaction.payment)) {
                    return true;
                }
            }

        }
    }

    return false;
}

function isAccountInBudget(account_id, accountsArray) {
    for (var i = 0; i < accountsArray.length; i++) {
        if (accountsArray[i] == account_id) return true;
    }
    return false;
}

function isPaymentTypeInBudget (budget, paymentType) {
    for (var i = 0; i < budget.paymentTypes.length; i++) {
        if (budget.paymentTypes[i] == paymentType) {
            return true;
        }
    }
    return false;
}


/*************************************************
 *   NEW-BUDGET.HTML
 ************************************************ */
function newBudgetPageRender() {
    // set categories
    $("#category").html(categoriesRender("expense"));
    // set timeFrames
    $("#timeFrameType").html(timeFrameRender());
    // set accounts
    //$("div.checkboxes.accounts").html(budgetMultiCheckboxesRender("accounts", []));
    // set payments
    $("div.checkboxes.payments").html(budgetMultiCheckboxesRender("payments", []));


    $("#checkAll").change(function () {
        $("div.checkboxes.payments input:checkbox").prop('checked', $(this).prop("checked"));
    });
}

function generatePaymentsTable(paymentArray) {
    var payments = [];
    var i = 0;
    if (paymentArray.length > 0) {
        for (i = 0; i < paymentArray.length; i++) {
            payments.push(paymentArray[i].name)
        }
    }
    else {

        for (i = 0; i < ewallet.categories.length; i++) {
            if (ewallet.categories[i].type == "payment") {
                payments.push(ewallet.categories[i])
            }
        }
    }

    return payments;
}

function budgetMultiCheckboxesRender(tableName, checkedArray) {
    var table;
    if (tableName == "payments") table = generatePaymentsTable([]);
    else table = ewallet[tableName];
    var checked = "";
    var html = "";
    var value = "";

    for (var i = 0; i < table.length; i++) {
        if (checkedArray.length > 0){
            if (arraySearch(checkedArray, i) == i || arraySearch(checkedArray, table[i].name) == i) {
                checked = "checked"
            } else checked = "";
        }
        if (tableName == "payments") {
            html += multiCheckboxLine(tableName, table[i].name, checked, table[i].name, i);
        }
        else {
            if (table[i].type == "account") {
                html += multiCheckboxLine(tableName, i, checked, table[i].name, i);
            }
        }
    }
    if (tableName == "payments") {
        html += '<hr><label><input type="checkbox" id="checkAll"/> בחר הכל</label>';
    }

    return html;
}

function multiCheckboxLine(tableName, value, checked, name, index) {
    var html = "";

    html += '<label for="'+tableName+'-' + index + '">';
    html += '<input type="checkbox" id="'+tableName+'-' + index + '" value="'+value+'" class="'+tableName+'"' + checked +'/>';
    html += name;
    html += '</label>';

    return html;
}

function showCheckboxes(field) {
    $(".checkboxes." + field).toggle(500);
}

function addBudget() {
    var form = $("#newBudget");
    var newBudget = {
        "category": form.find("select#category option:selected").text(),
        //"accounts": getMultiCheckboxValuesArray("accounts"),
        "accounts": form.find("#account_id").val(),
        "paymentTypes": getMultiCheckboxValuesArray("payments"),
        "timeFrameType": form.find("select#timeFrameType option:selected").val(),
        "date": "",
        "currency": "ILS",
        "limit": form.find("#limit").val(),
        "description": form.find("#description").val()
    };

    ewallet.budgets.push(newBudget);
    saveToStorage();

    history.back();
}

function getMultiCheckboxValuesArray (tableName) {
    var allVals = [];
    $('div.checkboxes.'+tableName+' :checked').each(function() {
        allVals.push($(this).val());
    });

    return allVals;
}



/*************************************************
 *   BUDGET-EDIT.HTML
 ************************************************ */
function budgetEditRender() {
    var budget_id = $.urlParam('budget_id');
    var budget = ewallet.budgets[budget_id];

    // set categories
    $("#category").html(categoriesRender("expense", budget.category));
    // set timeFrames
    $("#timeFrameType").html(timeFrameRender(budget.timeFrameType));
    // set accounts
    //$("div.checkboxes.accounts").html(budgetMultiCheckboxesRender("accounts", budget.accounts));
    // set payments
    $("div.checkboxes.payments").html(budgetMultiCheckboxesRender("payments", budget.paymentTypes));
    // set balance
    $("#limit").val(budget.limit);
    // set description
    $("#description").val(budget.description);

    $("#checkAll").change(function () {
        $("div.checkboxes.payments input:checkbox").prop('checked', $(this).prop("checked"));
    });
}

function updateBudget() {
    var budget_id = $.urlParam('budget_id');
    var form = $("#newBudget");
    var updatedBudget = {
        "category": form.find("select#category option:selected").text(),
        //"accounts": getMultiCheckboxValuesArray("accounts"),
        "accounts": form.find("#account_id").val(),
        "paymentTypes": getMultiCheckboxValuesArray("payments"),
        "timeFrameType": form.find("select#timeFrameType option:selected").val(),
        "date": "",
        "currency": "ILS",
        "limit": form.find("#limit").val(),
        "description": form.find("#description").val()
    };

    ewallet.budgets[budget_id] = updatedBudget;
    saveToStorage();

    history.back();
}
function deleteBudget() {
    var budget_id = $.urlParam('budget_id');

    ewallet.budgets.splice(budget_id, 1);

    saveToStorage();
    history.back();
}




/*************************************************
 *   INCOME-EDIT.HTML / EXPENSE-EDIT.HTML
 ************************************************ */

function transactionEditRender(type) {
    var transactions = ewallet.transactions;

    var transaction_id = $.urlParam('transaction_id');

    var paymentTypesHtml = categoriesRender("payment", transactions[transaction_id].payment);
    var categoriesHtml = categoriesRender(type, transactions[transaction_id].category);

    // SET VALUES
    $('#transaction_id').val(transaction_id);
    $('#account_id').val(transactions[transaction_id].account_id);
    $('#type').val(transactions[transaction_id].type);
    $('#amount').val(transactions[transaction_id].sum);
    $('#date').val(transactions[transaction_id].date);
    $('#time').val(transactions[transaction_id].time);
    $('#details').val(transactions[transaction_id].details);
    $('#payment').html(paymentTypesHtml);
    $('#category').html(categoriesHtml);
    // $('#back').attr("href", "index.html?account_id=" + account_id);
}


function updateTransaction() {

    var transaction_id = $.urlParam('transaction_id');
    var transaction = ewallet.transactions[transaction_id];
    var accounts = ewallet.accounts;
    var form = $("#editTransaction");
    var account_id = form.find("input#account_id").val();
    var newSum = form.find("input#amount").val();

    if (transaction.type == "income") {
        // subtract previous value and add current
        accounts[transaction.account_id].balance = parseFloat(accounts[account_id].balance) - parseFloat(transaction.sum) + parseFloat(newSum);
    }
    else if (transaction.type == "expense") {
        // add previous value and subtract current
        accounts[transaction.account_id].balance = parseFloat(accounts[account_id].balance) + parseFloat(transaction.sum) - parseFloat(newSum);
    }

    ewallet.transactions[transaction_id] = {
        "account_id" : account_id,
        "type": form.find("input#type").val(),
        "date": form.find("input#date").val(),
        "time": form.find("input#time").val(),
        "sum": newSum,
        "details": form.find("input#details").val(),
        "payment": form.find("select#payment option:selected").text(),
        "category": form.find("select#category option:selected").text(),
        "from_account_id": form.find("input#from_account_id").val(),
        "to_account_id": form.find("input#to_account_id").val()
    };


    saveToStorage ();

    history.back();
}


function deleteTransaction() {
    var transaction_id = $.urlParam('transaction_id');
    var transaction = ewallet.transactions[transaction_id];
    var accounts = ewallet.accounts;

    if (transaction.type == "income") {
        accounts[transaction.account_id].balance = parseFloat(accounts[transaction.account_id].balance) - parseFloat(transaction.sum);
    }
    else if (transaction.type == "expense") {
        accounts[transaction.account_id].balance = parseFloat(accounts[transaction.account_id].balance) + parseFloat(transaction.sum);
    }
    ewallet.transactions.splice(transaction_id, 1);

    saveToStorage();
    history.back();

}
