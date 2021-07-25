# Introduction

This software is called "HamroGhar" which means "Our Home". This app intention is to solve the invoice payment issue between landlord and the tenant. The aim is to address the problem by supplying landlords with both bills and past transaction documents to handle tenant information. In any transaction that happens, this would now have transparency and every information is backed up on the server, ensuring that no data is stored on the device.  

# Motivation

The app is intended to solve the issue of the Nepalese community people mostly in cities, where the issue arises during the monthly invoice payment and sometime not remembering the past credits that made some clash between the people. This app is to ensure not only there everything is recorded but everything is systematic for both parties. Invoice can be shared between the parties; records can be referenced for credit dispute and more.

# Tools Used
jQuery, Node.js, Mongo Database, HTML, CSS, Express, Cordova, Android Studio 
# Summary 
The Major tasks done in this application are as follow:
1.	Adding detail of tenant on the cloud i.e. Mongo Database: Personal details of the tenant such as full name, home address and contact number are stored on the Mongo database with the help of local storage.
2.	View the personal details of the Tenant obtained from the Mongo Database. In this task, the information which are stored in the database are retrieved and presented in the app.
3.	Invoice calculation: Monthly rent calculation including electricity, water bill and other miscellaneous invoices are calculated and stored in database and also displayed on demand.
4.	View Invoices: Every history of the invoice with the tenant are stored and can be viewed on demand.
5.	Delete Tenant: Tenant data can be deleted if required by the owner. In this case, instead of deleting the tenant from database, the status of tenant is updated from “Active” to “REMOVED”. The “REMOVED” tenant is not listed when client loads list of all tenants. This is because if there is any dispute arise in the future, then the database can be the history reference.


# User Interface
Here are some of the screenshots of the app's user interface.

![Main page](https://user-images.githubusercontent.com/30067218/126897520-5b261a95-8ca6-463d-9fe6-146734aa3faf.jpg)
![Add Tenant Page](https://user-images.githubusercontent.com/30067218/126899245-419410e4-40df-4fad-8e4a-eb0bf485593f.jpg)
![List of Active Tenants](https://user-images.githubusercontent.com/30067218/126899254-03e74600-0a96-413b-8e10-d96ead4dabfb.jpg)
![Tenant Details Page](https://user-images.githubusercontent.com/30067218/126899259-774c84e3-1dc9-4823-bbe5-57b6ed591cc1.jpg)

![Calculate Invoice](https://user-images.githubusercontent.com/30067218/126899800-91719d1e-df6d-4afc-9d67-fd49c2053bae.jpg)



