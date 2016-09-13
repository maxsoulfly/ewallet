
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

/***************************************************
 ACCOUNTS.HTML FUNCTIONS
 ***************************************************/
function accountsRender(type) {
    var accountsHtmlRender = "";
    var accounts = ewallet.accounts;
    for(var i = 0; i < accounts.length; i ++) {
        if (accounts[i].type == "account" && accounts[i].type == type) {
            accountsHtmlRender += '<p><a href="view_account.html?account_id=' + i + '">' + accounts[i].name + '</a> </p>';
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
    var account_id = $.urlParam('account_id');
    var account = ewallet.accounts[account_id];
    var allTransactions = getAccountTransactions(ewallet.transactions, account_id);

    var sum = calcBalanceCurMonth(allTransactions);
    var income = (sum.income > 0 ? sum.income.toLocaleString() + "+" : sum.income.toLocaleString());
    var expense = (sum.expense > 0 ? sum.expense.toLocaleString() + "-" : sum.expense.toLocaleString());

    // SET ACCOUNT VALUES
    $(".balance").find("p").html(account.balance.toLocaleString());
    $(".title").find("h1").html(account.name);
    $("head title").html(account.name);
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
    $('#back').attr("href", "view_account.html?account_id=" + account_id);
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
function categoriesRender(type) {
    var categoriesHtml = "";

    for (var i=0; i<ewallet.categories.length; i++) {
        if (ewallet.categories[i].type==type) {
            categoriesHtml += optionRender(ewallet.categories[i].name, "");
        }
    }
    return categoriesHtml;
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
        $('#back').attr("href", "view_account.html?account_id=" + account_id);
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
    accounts[account_id].balance = accounts[account_id].balance - parseFloat(transaction.sum);


    // add sum to chosen account balance
    accounts[to_account_id].balance = accounts[to_account_id].balance + parseFloat(transaction.sum);


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
    // RENDER PAGE:
    if (accounts[account_id].type == "account")
        $('#back').attr("href", "view_account.html?account_id=" + account_id);
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
            displayParam = getStartEnd(displayParam);
            dateTitle.find('span.date').text(displayParam.startDate.substring(0, 2) + "-" + displayParam.endDate);
            break;
        case "monthly":
            $("li#displayMonthly").addClass("active");
            displayParam = getStartEnd(displayParam);
            dateTitle.find('span.date').text(displayParam.startDate.substring(2));
            break;
        case "annually":
            $("li#displayAnnually").addClass("active");
            displayParam = getStartEnd(displayParam);
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
        listHtml += listItemRender(transactions[i], account_id);
    }
    return listHtml;
}

function listItemRender(transaction, account_id) {
    var li = '';
    li += '<li><span>' + transaction.category + '</span>';
    if (transaction.type == "income" && transaction.account_id == account_id || transaction.type == "expense" && transaction.to_account_id == account_id ) {
        li += '<span class="green">' + transaction.sum + '+</span>';
    } else {
        li += '<span class="red">' + transaction.sum + '-</span>';
    }
    li += '</li>';
    return li;
}

function getStartEnd(displayParam) {
    var curr = new Date();
    var firstDay,lastDay;

    switch (displayParam.by) {
        case "weekly":
            var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
            var last = first + 6; // last day is the first day + 6
            firstDay = new Date(curr.setDate(first));
            lastDay = new Date(curr.setDate(last));
            break;
        case "monthly":
            firstDay = new Date(curr.getFullYear(), curr.getMonth(), 1);
            lastDay = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
            break;
        case "annually":
            firstDay = new Date(curr.getFullYear(), 1, 1);
            lastDay = new Date(curr.getFullYear(), 11, 31);
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

function arraySearch(arr,val) {
    for (var i=0; i<arr.length; i++)
        if (arr[i] === val)
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
    $("#currency").html(currenciesListRender(account.currency));
}

function updateAccount() {

    var form = $("#accountEdit");
    var account_id = form.find("input#account_id").val();

    // save new values
    ewallet.accounts[account_id] = {
        "name": form.find("input#account_name").val(),
        "type": form.find("input#type").val(),
        "description": form.find("input#description").val(),
        "currency": form.find("select#currency option:selected").val(),
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
    $("#currency").html(currenciesListRender("ILS"));
}

function addAccount() {

    var form = $("#accountEdit");
    // save new values
    var newAccount = {
        "name": form.find("input#account_name").val(),
        "type": form.find("input#type").val(),
        "description": form.find("input#description").val(),
        "currency": form.find("select#currency option:selected").val(),
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
