
moment.locale("he");

//renderAccountsPage();

// setLocalStorage();


function setLocalStorage() {

    if(localStorage.getItem("account")){

    }
    else {
        // Accounts
        var account = [];
        account[0].name = "חשבון ראשי";
        account[0].balance = 0;
        console.log( account );
        localStorage.setItem( 'account', account );
        console.log( localStorage.getItem( 'account' ) );
    }
}

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }
    else{
        return results[1] || 0;
    }
};

/***************************************************
 ACCOUNTS.HTML FUNCTIONS
 ***************************************************/
function accountsRender(type) {
    var accountsHtmlRender = "";
    for(var i = 0; i < accounts.length; i ++) {
        if (accounts[i].type == type) {
            accountsHtmlRender += '<p><a href="savings-account.html?account_id=' + i + '">' + accounts[i].name + '</a> </p>';
        }
    }
    $("#accounts").html(accountsHtmlRender);
}


/***************************************************
    VIEW_ACCOUNT.HTML FUNCTIONS
***************************************************/
function viewAccountRender() {
    var account_id = $.urlParam('account_id');
    var account = accounts[account_id];
    var allTransactions = getAccountTransactions(transactions, account_id);
    var sum = calcBalanceCurMonth(allTransactions);
    var income = (sum.income > 0 ? sum.income.toLocaleString() + "+" : sum.income.toLocaleString());
    var expense = (sum.expense > 0 ? sum.expense.toLocaleString() + "-" : sum.expense.toLocaleString());

    // SET ACCOUNT VALUES
    $(".balance").find("p").html(account.balance.toLocaleString());
    $(".title").find("h1").html(accounts[account_id].name);
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
        if (transactions[i].account_id == account_id) {
            accountTransactions.push(transactions[i]);
        }
    }
    return accountTransactions;
}

function makeDate(date) {
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
        day = moment(transactions[i].date, "DD/MM/YYYY");
        if (day.format('L').substring(3) == thisMonth) {
            sum[transactions[i].type] += transactions[i].sum;
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
    var month = addZero(now.getMonth());
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    var time = addZero(now.getHours()) + ":" + addZero(now.getMinutes());
    var paymentTypesHtml = paymentTypesSelectRender();
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
    var form = $("#newIncome");
    var transaction = {
        "account_id" : form.find("input#account_id").val(),
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

    transactions.push(transaction);
    history.back();
}


function addZero(num) {
    return ("0" + num).slice(-2);
}

function paymentTypesSelectRender() {
    var paymentTypesHtml = "";
    for (var i=0; i<paymentTypes.length; i++) {
        paymentTypesHtml += optionRender(paymentTypes[i].name, "");
    }
    return paymentTypesHtml;
}


function categoriesRender(type) {
    var categoriesHtml = "";

    for (var i=0; i<paymentTypes.length; i++) {
        if (categories[i].type==type) {
            categoriesHtml += optionRender(categories[i].name, "");
        }
    }
    return categoriesHtml;
}

function optionRender(value, selected) {
    return optionDifferTextRender(value, value, selected);
}

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
    var account_id = $.urlParam('account_id');
    var accountOptionsHtml = "";
    var now = new Date();
    var day = addZero(now.getDate());
    var month = addZero(now.getMonth());
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
    $('#payment').html(payment);
    $('#category').html(category);
    $('#from_account_id').html(optionDifferTextRender(account_id, accounts[account_id].name, ""));
    $('#to_account_id').html(accountOptionsHtml);
    $('#back').attr("href", "view_account.html?account_id=" + account_id);
}

function addATransaction() {
    var form = $("#newIncome");
    var transaction = {
        "account_id" : form.find("input#account_id").val(),
        "type": form.find("input#type").val(),
        "date": form.find("input#date").val(),
        "time": form.find("input#time").val(),
        "sum": form.find("input#amount").val(),
        "details": "העברה",
        "payment": form.find("input#payment").val(),
        "category": form.find("input#category").val(),
        "from_account_id": form.find("input#from_account_id").val(),
        "to_account_id": form.find("input#to_account_id").val()
    };

    transactions.push(transaction);
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

    // RENDER PAGE:
    $('#back').attr("href", "view_account.html?account_id=" + account_id);

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
    transactionsListHtml = transactionsListRender(accountTransactions);
    ulTable.html(ulTable.html() + transactionsListHtml);
}
// -------------  FUNCTIONS  -------------------- //
function getTransactions(account_id, displayParam) {
    var transaction = [];
    for (var i = 0; i < transactions.length; i++) {
        if (transactions[i].account_id == account_id ) {
            if (displayParam.by == "all") {
                if (displayParam.cashFlowType == "all" || transactions[i].type == displayParam.cashFlowType)
                    transaction.push(transactions[i]);
            }
            else {
                if (isDateBetween(displayParam.startDate, displayParam.endDate, transactions[i].date)) {
                    if (displayParam.cashFlowType == "all" || transactions[i].type == displayParam.cashFlowType)
                        transaction.push(transactions[i]);
                }
            }
        }
    }
    return transaction;
}

function transactionsListRender(transactions) {
    var listHtml = "";
    for (var i = 0; i < transactions.length; i++) {
        listHtml += listItemRender(transactions[i]);
    }
    return listHtml;
}

function listItemRender(transaction) {
    var li = '';
    li += '<li><span>' + transaction.category + '</span>';
    if (transaction.type == "income") {
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
    var i = arraySearch(cashFlowTypes, displayParam.cashFlowType);
    var currCashFlowType = displayParam.cashFlowType;
    i++;
    if (i >= 3) i = 0;
    displayParam.cashFlowType = cashFlowTypes[i];
    currentUrl = addCashFlowToUrl(displayParam, currentUrl);
    window.location.href = currentUrl;
}

function addCashFlowToUrl(displayParam, url) {
    if (url.indexOf('cashFlowType') > -1) {
        var indexOf = url.indexOf("cashFlowType");
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
