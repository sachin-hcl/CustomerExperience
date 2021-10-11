using {com.hcl.telecom.operator as tables} from './schema';

namespace com.hcl.telecom.operator.views;

entity WeightageSummary     as
    select COUNT(
        *
    ) as UserCount from tables.Users;

entity AssetsByAge          as
    select
        *,
        (
            julianday(
                'now'
            ) - julianday(
                InstalledDate
            )
        ) / 365 as Age
    from tables.Assets;

entity AssetBySupportLevels as
    select
        COUNT(
            *
        ) as Count,
        SupportStatus
    from tables.Assets
    group by
        SupportStatus;

entity AssetByVendors as
    select
        COUNT(
            *
        ) as Count,
        Vendor
    from tables.Assets
    group by
        Vendor;

entity AssetGroupByAge      as
        select
            COUNT(
                *
            )             as Count,
            '0 - 2 Years' as AgeGroup
        from AssetsByAge
        where
            Age <= 2
    union
        select
            COUNT(
                *
            )             as Count,
            '2 - 4 Years' as AgeGroup
        from AssetsByAge
        where
            Age between 2 and 4
    union
        select
            COUNT(
                *
            )             as Count,
            '4 - 6 Years' as AgeGroup
        from AssetsByAge
        where
            Age between 4 and 6
    union
        select
            COUNT(
                *
            )           as Count,
            '6 + Years' as AgeGroup
        from AssetsByAge
        where
            Age >= 6;

entity InstallationType     as
    select
        COUNT(
            *
        ) as Count,
        InstalledDate,
        InstallationType
    from tables.Assets
    group by
        InstalledDate,
        InstallationType;

entity DailyServices        as
    select
        COUNT(
            *
        ) as Count,
        LastServiceDate
    from tables.Assets
    group by
        LastServiceDate;

entity InstallationHotspots as
    select
        printf(
            '%.2f', lat
        ) as latitude,
        printf(
            '%.2f', lng
        ) as longitude,
        InstalledDate,
        Count(
            *
        ) as Count
    from tables.Assets
    inner join tables.Customers
        on(
            Customers.ID = Customer.ID
        )
    where
        InstallationType = 'New'
    group by
        InstalledDate;


entity CustomerTickets      as
    select
        Address,
        PostCode,
        Country,
        Name,
        Rating,
        Tickets.ID,
        ReportArea,
        TicketStatus,
        OpenDate,
        ResoluitionDate,
        Source,
        TeamAssignment,
        lat,
        lng,
        SLADateTime,
        Priority,
        ShortDescription
    from tables.Tickets
    inner join tables.Customers
        on Customers.ID = Customer.ID;

entity TicketPriorityCounts as
    select
        ifnull(High,0) as High,
        ifnull(Medium,0) as Medium,
        ifnull(Low,0) as Low,
        Date
    from 
    tables.Dates
    left outer join
    (
        select
            count(
                *
            ) as High,
            substr(
                OpenDate, 0, 11
            ) as TicketDate
        from tables.Tickets
        where
            Priority = 'H'
        group by
                    Priority,
                    substr(
                    OpenDate,
                    0,
                    11
            )
    ) as HighPriority
    on Dates.Date = HighPriority.TicketDate
    left outer join (
        select
            count(
                *
            ) as Medium,
            substr(
                OpenDate, 0, 11
            ) as TicketDate
        from tables.Tickets
        where
            Priority = 'M'
        group by
                    Priority,
                    substr(
                    OpenDate,
                    0,
                    11
            )
    ) as MediumPriority
        on MediumPriority.TicketDate = Dates.Date
    left outer join (
        select
            count(
                *
            ) as Low,
            substr(
                OpenDate, 0, 11
            ) as TicketDate
        from tables.Tickets
        where
            Priority = 'L'
        group by
                    Priority,
                    substr(
                    OpenDate,
                    0,
                    11
            )
    ) as LowPriority
        on Dates.Date = LowPriority.TicketDate;
