using { User, managed, cuid, temporal, Country } from '@sap/cds/common';
namespace com.hcl.telecom.operator;

aspect GeoCode {
  lat : Double;
  lng : Double;
}

aspect Address : GeoCode {
  Address : String(256);
  PostCode : String(12);
  Country : Country;
}

entity Users : cuid, temporal{
  Name : String;
  UserType : String(32);
}

entity Customers : cuid, Address {
  Name : User;
  Rating: Integer;
}

entity Assets {
  key SerialNumber: UUID;
  Vendor : String(64);
  Customer : Association to Customers;
  InstalledDate : Date;
  LastServiceDate : Date;
  SupportStatus : String(64);
  InstallationType : String(32);
  DeviceConnectionLimit: Integer;
  Plan : Association to Plans;
}

entity Plans:cuid{
  Rent : Double;
  DataLimit : Integer;//data limit in GB per month -1 for unlimited
  SpeedLimit : Integer;//MBPS -1 for unlimited
  InstallationType : String(128); //Fiber, 4G, 5G, DTH Set top box
  Rating: Integer;
}


entity Tickets:cuid{
  Customer : Association to Customers;
  ReportArea: String(64); //Device, Netowrk, Billing
  TicketStatus: String(64);//New, Pending Clarification, WIP, Closed
  OpenDate:DateTime;
  ResoluitionDate:DateTime;
  SLADateTime : DateTime;
  Source: String(64); //Call Center, Auto-Monitoring, Social Media
  TeamAssignment: String(64);//Billing, Services,Hardware
  Priority : String(1); //H,M,L (High, Medium, Low),
  ShortDescription : String(64);
}

aspect Requests : cuid{
  RequestedOn : DateTime;
  IsFulfilled : String(1);
  LastResponse : DateTime;
  FulfilledOn : DateTime;
  SLADateTime : DateTime;
}

entity FiveGRequests : Requests {
  Customer : Association to Customers;
}

entity NewConnectionRequests : Requests{
  Customer : Association to Customers;
}


entity Warehouses : cuid, Address {  
}

entity Stocks : cuid {
  Warehouse : Association to Warehouses;
  Type : String(64); //Fiber Router, 5G Router, Hub
  StockCount : Integer;
}

entity Dates{
  Date : Date;
}