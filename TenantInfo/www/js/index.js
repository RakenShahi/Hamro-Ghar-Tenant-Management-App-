
document.addEventListener('deviceready', onDeviceReady, false);
jQuery.cors = true; // force cross-site scripting
jQuery.allowCrossDomainPcontracts = true; // force cross-site scripting

//variables declared and initialisation
var Tenant_details=[];
var ipAddress = "http://192.168.1.119:3000";
var tenantID;
var conds = ["", "Male", "Female"]
let electricityBill;

//when the application is loaded on device
function onDeviceReady() {

    $('#addTenantBtn').on("click",function (){
        //switch to add tenant page
        $.mobile.changePage("index.html#addTenant")
    });

    $('#viewTenantsBtn').on("click",function (){
        //load list of tenants to view detail of selected tenants
        viewTenantsList();
    });

    $('#viewTransactionsBtn').on("click",function (){
        //load list to view transaction of selected tenants
        transactionTenantList();
    });

    $('#calculateInvoicesBtn').on("click",function (){
        //load list to calculate invoice of selected tenants
        calculateTenantList();
    });

    $('#deleteTenantBtn').on("click",function (){
        //load list to delete selected tenant.
        removeTenantList();
    });

    $('#aboutUsBtn').on("click",function (){
        //switch to about us page
        $.mobile.changePage("index.html#aboutUsPage");
    });

    $('#saveTenantBtn').on("click",function (){
        //save tenant data to mongodb database
        addTenantToDatabase();
    });

    $('#saveInvoiceBtn').on("click",function (){
        //save invoice data to mongodb database
        addInvoiceToDatabase();
    });

    //on list click listener for viewing user detail
    $('#allTenantList').on('click', 'li', function () {
        tenantID = $(this).find('span.id').text(); //get tenant ID
        viewTenantDetail(tenantID);
    });

    //on list click listener for viewing transaction
    $('#selectForTransaction').on('click', 'li', function () {
        tenantID = $(this).find('span.id').text(); //get tenantID
        viewTransaction(tenantID);
    });

    //on list click listener for invoice calculation
    $('#selectForCalculation').on('click', 'li', function () {
        tenantID = $(this).find('span.id').text();
        $.mobile.changePage("index.html#calculateInvoice")
    });

    //on list click listener to delete the selected tenant
    $('#deleteTenantList').on('click', 'li', function () {
        tenantID = $(this).find('span.id').text();
        $.mobile.changePage("index.html#confirm");
    });

    //delete confirmation
    $('#deleteYesBtn').on('click', function () {
        removeTenant(); //removed from list
        $.mobile.changePage("index.html#deleteTenantPage");
    });

    //to clean tenant detail fields
    $('#fieldClean').on("click",function (){
        clearAll();
    });

    //to clean invoice detail fields
    $('#clearInvoiceBtn').on("click",function (){
        clearInvoice();
    });

    // //for calculating electricity bill
    // $('#calcElectricityBillBtn').on("click",function (){
    //     calculateElectricityBill();
    // });

    //for calculating total bill
    $('#totalBill').on("click",function (){
        calculateTotalBill();
    });
}

//function to load all tenants into a list
function viewTenantsList(){
    let listID='#allTenantList';
    getAllTenant(listID);
    $.mobile.changePage("index.html#allTenants");
}

$(document).delegate("#calculateInvoice", "pageinit", function() {
    //when calculate electricity bill button is tapped.
    $('#calcElectricityBillBtn').tap(function(){
        calculateElectricityBill();
    });
});

//function to list tenants for viewing invoice transaction
function transactionTenantList(){
    let listID='#selectForTransaction';
    getAllTenant(listID);
    $.mobile.changePage("index.html#transactionPage");
}

//function to list tenants for calculating invoice
function calculateTenantList(){
    let listID='#selectForCalculation';
    getAllTenant(listID);
    $.mobile.changePage("index.html#calculationListPage");
}

//function to get all tenants from the database
function getAllTenant(listID) {
    const url=ipAddress+"/getAll";
    var listID=listID;
    http_name_tenant(url,listID);
}

//function to load list for deleting tenant
function removeTenantList(){
    let listID='#deleteTenantList'
    getAllTenant(listID);
    $.mobile.changePage("index.html#deleteTenantPage");
}

//function to remove tenant
function removeTenant(){
    const url=ipAddress+"/remove/"+tenantID;
    http_get(url);
    removeTenantList(); //reload list
    $.mobile.changePage("index.html#deleteTenantPage");
}

//function to view tenant detail
function viewTenantDetail(tenantID){
    const url=ipAddress+"/search/"+tenantID; //url declaration
    var listID='#singleTenantDetail'; //listID in html
    http_get(url,listID);
    $('#singleTenantDetail').empty(); //clear list
    $.mobile.changePage("index.html#getLogsPage");
}

//function to view transaction
function viewTransaction(tenantID){
    const url=ipAddress+"/searchTransaction/"+tenantID;
    console.log("for single tenant finding url:"+url);
    var listID='#transactionList';
    http_get_transaction(url,listID);
    $('#transactionList').empty();
    $.mobile.changePage("index.html#getTransactionPage");
}

function sendjson(url,obj) {
    console.log("In ExtraJson");
    console.log(url);

    $.ajax({
        url:url,
        type:'POST',
        contentType:'application/json; charset=utf-8',
        dataType:'json',
        data:obj,
        success:function(result){
            console.log("Operation successful")
        },
        failure:function(){
            alert("Operation failed...");
        }
    });
    console.log("Exiting sendjson ");
}

//to get name of the Tenant with the help of ajax from server
function http_name_tenant(suffix,listID) {
    $.ajax(
        {
            url:suffix,
            headers:{},
            dataType:'json',
            success:function(result){
                // alert("Search Complete");
                if(result.length==0){
                    alert("No data found");
                }
                $(listID).empty();
                for( var i = 0; i < result.length; i++ ) {
                    console.log(result[i]);
                    addTenantName(result[i],true,$(listID));
                }
            },
            error:function(err){
                alert('Network - Unable to contact server in http_get.'+err)
            }
        }
    )
}

//to get data with the help of ajax from server
function http_get(suffix,listID) {
    $.ajax(
        {
            url:suffix,
            headers:{},
            dataType:'json',
            success:function(result){
                // alert("Search Complete");
                if(result.length==0){
                    alert("No data found");
                }
                $(listID).empty();
                for( var i = 0; i < result.length; i++ ) {
                    console.log(result[i]);
                    // $('#TenantList').empty();
                    addTenantToLi(result[i],true,$(listID));
                }

            },
            error:function(err){
                alert('Network - Unable to contact server in http_get.'+err)
            }
        }
    )
}

//function to get transaction from server with the help of ajax
function http_get_transaction(suffix,listID) {
    $.ajax(
        {
            url:suffix,
            headers:{},
            dataType:'json',
            success:function(result){
                // alert("Search Complete");
                if(result.length===0){
                    alert("No data found");
                }
                for( var i = 0; i < result.length; i++ ) {
                    console.log(result[i]);
                    addTransactionItem(result[i],true,$(listID));
                }

            },
            error:function(err){
                alert('Network - Unable to contact server in http_get.'+err)
            }
        }
    )
}

function addTenantName(itemdata, nosave, treatmentlog) {
    var item = $('#Tenant_Name').clone();
    // alert(itemdata.tenantName+" from add item");
    item.attr({id:itemdata._id});
    item.find('span.id').text(itemdata._id);
    item.find("span.tenant_name").text(" "+itemdata.tenantName);

    if (!nosave){
        treatmentlog.append(item).listview('refresh');
    }
    else {
        treatmentlog.append(item);
    }
}

//function to load tenant details into list
function addTenantToLi(itemdata, nosave, treatmentlog) {
    var item = $('#Tenant_Data').clone();
    item.attr({id:itemdata._id});
    item.find('span.id').text(itemdata._id);
    item.find("span.tenant_name").text("Name: "+itemdata.tenantName);
    item.find('span.original_address').text("Original Address: "+itemdata.originalAddress);
    item.find('span.starting_date').text("Joined Date: "+itemdata.startingDate);
    item.find('span.contact_number').text("Contact Number: "+itemdata.contactNumber);
    item.find('span.citizenship_number').text("Citizenship Number: "+itemdata.citizenshipNumber);
    item.find('span.gender').text("Gender: "+itemdata.gender);

    if (!nosave){
        treatmentlog.append(item);
    }
    else {
        treatmentlog.append(item);
    }
}
//function to load invoice details into list
function addTransactionItem(itemdata, nosave, treatmentlog) {
    var item = $('#item_transaction').clone();
    item.attr({id:itemdata._id});
    item.find('span.monthlyRent').text(" Monthly Rent: "+itemdata.monthlyRent);
    item.find('span.waterReceipt').text(" Drinking Water Receipt: "+itemdata.waterReceipt);
    item.find('span.miscellaneous').text(" Miscellaneous Charge: "+itemdata.miscellaneous);
    item.find('span.initialMeterReading').text(" Starting Meter Reading: "+itemdata.initialMeterReading);
    item.find('span.finalMeterReading').text(" Final Meter Reading of this month: "+itemdata.finalMeterReading);
    item.find('span.pricePerUnit').text(" Electricity Price per Unit: "+itemdata.pricePerUnit);
    item.find('span.totalElectricityBill').text(" Total Electricity Charge: "+itemdata.totalElectricityBill);
    item.find('span.totalBill').text(" Total Bill: "+itemdata.totalBill);
    item.find('span.paidDate').text(" Calculated Date: "+itemdata.paidDate);

    if (!nosave){
        treatmentlog.append(item).listview('refresh');
    }
    else {
        treatmentlog.append(item);
    }
}

//function to calculate electricity bill
function calculateElectricityBill() {
    let initial_meter_read=$('#initialMeterReading').val();
    let final_meter_read=$('#finalMeterReading').val();
    let price_per_unit=$('#pricePerWatt').val();

    //validation for the electricity bill
    var checkField=false;
    if (initial_meter_read==="") {
        alert("Please provide initial meter reading value!")
        checkField = true
        $('#initialMeterReading').val("")
    }

    if (final_meter_read==="") {
        alert("Please provide final meter reading value!")
        checkField = true
        $('#finalMeterReading').val("")
    }

    if (price_per_unit==="") {
        alert("Please provide electricity amount per unit!")
        checkField = true
        $('#pricePerWatt').val("")
    }

    if(parseInt(initial_meter_read)>parseInt(final_meter_read)){
        alert("Initial meter reading value must be lower than Final meter reading!!!")
        checkField=true;
        $('#initialMeterReading').val("")
        $('#finalMeterReading').val("")

    }

    if(!checkField) {
        let initialMeterReading = parseInt(initial_meter_read);
        let finalMeterReading = parseInt(final_meter_read);
        let pricePerUnit = parseInt(price_per_unit);
        electricityBill = pricePerUnit * (finalMeterReading - initialMeterReading);
        $('#electricityConsumed').val(electricityBill);
    }
}

//function to calculate total
function calculateTotalBill() {
    let monthly_rent=$('#monthlyRentFixed').val();
    let water_amount=$('#drinkingWaterBill').val();
    let misc_amount=$('#miscellaneousCharge').val();
    let initial_meter_read=$('#initialMeterReading').val();
    let final_meter_read=$('#finalMeterReading').val();
    let price_per_unit=$('#pricePerWatt').val();

    //validating inputs for calculating the monthly bill
    var checkField = false;

    if (monthly_rent=="") {
        alert("Please provide monthly rent!")
        checkField = true
        $('#monthlyRentFixed').val("")
    }

    if (water_amount=="") {
        alert("Please provide water bill amount!")
        checkField = true
        $('#drinkingWaterBill').val("")
    }

    if (misc_amount=="") {
        alert("Please provide miscellaneous amount!")
        checkField = true
        $('#miscellaneousCharge').val("")
    }

    if (initial_meter_read=="") {
        alert("Please provide initial meter reading value!")
        checkField = true
        $('#initialMeterReading').val("")
    }

    if (final_meter_read=="") {
        alert("Please provide final meter reading value!")
        checkField = true
        $('#finalMeterReading').val("")
    }

    if (price_per_unit=="") {
        alert("Please provide electricity amount per unit!")
        checkField = true
        $('#pricePerWatt').val("")
    }

    //initial meter reading should always be less than final meter reading
    if(parseInt(initial_meter_read)>parseInt(final_meter_read)){
        alert("Initial meter reading value must be lower than Final meter reading!!!")
        checkField=true;
        $('#initialMeterReading').val("")
        $('#finalMeterReading').val("")

    }

    if(!checkField) {
        calculateElectricityBill()
        let monthlyRent = parseInt(monthly_rent);
        let drinkingWater = parseInt(water_amount);
        let miscBill = parseInt(misc_amount);
        let initialMeterReading = parseInt(initial_meter_read);
        let finalMeterReading = parseInt(final_meter_read);
        let pricePerUnit = parseInt(price_per_unit);
        var electricityAmount = pricePerUnit * (finalMeterReading - initialMeterReading);
        var totalAmount = monthlyRent + drinkingWater + miscBill + electricityAmount;
        $('#totalAmount').val(totalAmount);
    }
}

//clear all data in input fields and selector
function clearAll() {
    $('#tenantName').val("")
    $('#permanentAddress').val("")
    $('#gender').val("").selectmenu("refresh")
    $('#startingDate').val("")
    $('#contactNumber').val("")
    $('#citizenshipNumber').val("")
} //end clearAll

//function to clear all the fields of invoice
function clearInvoice(){
    $('#monthlyRentFixed').val("");
    $('#drinkingWaterBill').val("");
    $('#miscellaneousCharge').val("");
    $('#initialMeterReading').val("");
    $('#finalMeterReading').val("");
    $('#pricePerWatt').val("");
    $('#paidDateField').val("");
    $('#electricityConsumed').val("");
    $('#totalAmount').val("");
}

//function to add tenant to database
function addTenantToDatabase() {
    //getting values from input fields HTML
    var tenant_name = $('#tenantName').val();
    var original_address = $('#permanentAddress').val();
    var starting_date = $('#startingDate').val();
    var contact_number = $('#contactNumber').val();
    var citizenship_number = $('#citizenshipNumber').val();
    var gender = conds[$('#gender').val()];
    console.log(gender);

    //validating inputs
    var checkField = false;

    if (tenant_name === "") {
        alert("Tenant name must be a non empty name string")
        checkField = true
        $('#tenantName').val("")
    }
    if (original_address === "") {
        alert("Home Address must be a non empty name string")
        checkField = true
        $('#permanentAddress').val("")
    }
    if (starting_date === "") {
        alert("Please provided the Joined Date")
        checkField = true
        $('#startingDate').val("")
    }
    if (contact_number < 1000000000 || contact_number > 9999999999) {
        alert("Contact number should be non empty integer of 10 digits")
        checkField = true
        $('#contactNumber').val("")
    }
    if (citizenship_number < 10000000 || citizenship_number > 99999999) {
        alert("Citizenship number should be non empty integer of 8 digits")
        checkField = true
        $('#citizenshipNumber').val("")
    }

    if (gender === undefined || gender=="") {
        alert("Please select the Gender!!!")
        checkField = true
        $('#gender').val("").selectmenu("refresh");
    }

    if (!checkField) {

    var tenant = {
        tenantName: tenant_name, originalAddress: original_address, startingDate: starting_date,
        contactNumber: contact_number, citizenshipNumber: citizenship_number, gender: gender, status: "Active"
    };

    Tenant_details.push(tenant); //push tenant data to the array
    localStorage.Tenant_details = JSON.stringify(Tenant_details);
    const data = localStorage.getItem("Tenant_details");
    const urlSuffix = ipAddress + "/postData"
    sendjson(urlSuffix, data); //passing the data to SERVER
    //for removing from localstorage
    while (Tenant_details != 0) {
        Tenant_details.pop();
    }
    localStorage.removeItem("Tenant_details");

    alert("Tenant Added Successfully!!!")
    clearAll();
    $.mobile.changePage("index.html#homePage");
    }
}

//function to add invoice to database
function addInvoiceToDatabase(){
    let monthly_rent=$('#monthlyRentFixed').val();
    let water_amount=$('#drinkingWaterBill').val();
    let misc_amount=$('#miscellaneousCharge').val();
    let initial_meter_read=$('#initialMeterReading').val();
    let final_meter_read=$('#finalMeterReading').val();
    let price_per_unit=$('#pricePerWatt').val();
    let calculated_date=$('#paidDateField').val();
    let elecTotal=$('#electricityConsumed').val();
    let total=$('#totalAmount').val();
    //validating inputs
    var checkField = false;

    if (monthly_rent==="") {
        alert("Please provide monthly rent!")
        checkField = true
        $('#monthlyRentFixed').val("")
    }

    if (water_amount==="") {
        alert("Please provide water bill amount!")
        checkField = true
        $('#drinkingWaterBill').val("")
    }

    if (misc_amount==="") {
        alert("Please provide miscellaneous amount!")
        checkField = true
        $('#miscellaneousCharge').val("")
    }

    if (initial_meter_read==="") {
        alert("Please provide initial meter reading value!")
        checkField = true
        $('#initialMeterReading').val("")
    }

    if (final_meter_read==="") {
        alert("Please provide final meter reading value!")
        checkField = true
        $('#finalMeterReading').val("")
    }

    if (price_per_unit==="") {
        alert("Please provide electricity amount per unit!")
        checkField = true
        $('#pricePerWatt').val("")
    }

    if (calculated_date==="") {
        alert("Please provide Calculated date!")
        checkField = true
        $('#paidDateField').val("")
    }

    if(parseInt(initial_meter_read)>parseInt(final_meter_read)){
        alert("Initial meter reading value must be lower than Final meter reading!!!")
        checkField=true;
        $('#initialMeterReading').val("")
        $('#finalMeterReading').val("")

    }

    if (elecTotal === "") {
        alert("Electricity Total is not calculated!!!")
        checkField = true
        $('#electricityConsumed').val("")
    }


    if (total === "") {
        alert("Total is not calculated!!!")
        checkField = true
        $('#totalAmount').val("")
    }
    if(!checkField) {
        let customerID=tenantID;
        let monthlyRent = parseInt(monthly_rent);
        let drinkingWater = parseInt(water_amount);
        let miscBill = parseInt(misc_amount);
        let initialMeterReading = parseInt(initial_meter_read);
        let finalMeterReading = parseInt(final_meter_read);
        let pricePerUnit = parseInt(price_per_unit);
        let paidDate = calculated_date;
        var electricityAmount =pricePerUnit * (finalMeterReading - initialMeterReading);
        var totalAmount = monthlyRent + drinkingWater + miscBill + electricityAmount;
        //store invoice data
        var invoiceData = {
            tenantID: customerID, monthlyRent: monthlyRent, waterReceipt: drinkingWater, miscellaneous: miscBill,
            initialMeterReading: initialMeterReading, finalMeterReading: finalMeterReading, pricePerUnit: pricePerUnit,
            totalElectricityBill: electricityAmount, totalBill: totalAmount, paidDate: paidDate
        };
        //push the invoice data to the array
        Tenant_details.push(invoiceData);
        localStorage.Tenant_details = JSON.stringify(Tenant_details);
        console.log(localStorage.getItem("Tenant_details"));
        const data = localStorage.getItem("Tenant_details");

        var url = ipAddress + "/postInvoice/" + tenantID;
        sendjson(url, data);
        while (Tenant_details.length !== 0) { // clear items
            Tenant_details.pop();
        }
        localStorage.removeItem("Tenant_details")
        alert("Invoice saved successfully...")
        clearInvoice();
        $.mobile.changePage("index.html#homePage");
    }
}

