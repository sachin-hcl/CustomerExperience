using {com.hcl.telecom.operator as tables} from '../db/schema';

using { com.hcl.telecom.operator.views as views } from '../db/views';


service Telecom {
  entity Users as projection on tables.Users;
  entity Customers as projection on tables.Customers;
  entity AssetsByAge as projection on views.AssetsByAge;
  entity AssetGroupByAge as projection on views.AssetGroupByAge;
  entity AssetBySupportLevels as projection on views.AssetBySupportLevels;
  entity InstallationType as projection on views.InstallationType;
  entity DailyServices as projection on views.DailyServices;
  entity InstallationHotspots as projection on views.InstallationHotspots;
  entity Assets as projection on tables.Assets;
  entity CustomerTickets as projection on views.CustomerTickets {*, key ID};
  entity FiveGRequests as projection on tables.FiveGRequests;
  entity NewConnectionRequests as projection on tables.NewConnectionRequests;
  entity TicketPriorityCounts as projection on views.TicketPriorityCounts;
  entity Stocks as projection on tables.Stocks;
  entity AssetByVendors as projection on views.AssetByVendors;
  entity Warehouses as projection on tables.Warehouses;
  entity Plans as projection on tables.Plans;
}