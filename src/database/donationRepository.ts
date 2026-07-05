import db from "./database";
import { Donation } from "../models/Donation";

export const createDonation = async (
  donation: Donation
) => {

  await db.runAsync(
    `
    INSERT INTO Donations
    (
      ReceiptNo,
      CollectionDate,
      DonorName,
      Mobile,
      Address,
      Lane,
      DonorType,
      Amount,
      PaymentMode,
      Status,
      PaidDate,
      CollectorName,
      Remarks
    )
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      donation.ReceiptNo,
      donation.CollectionDate,
      donation.DonorName,
      donation.Mobile,
      donation.Address,
      donation.Lane,
      donation.DonorType,
      donation.Amount,
      donation.PaymentMode,
      donation.Status,
      donation.PaidDate ?? null,
      donation.CollectorName,
      donation.Remarks ?? null
    ]
  );
};

export const getAllDonations = async () => {
  return await db.getAllAsync(`
    SELECT *
    FROM Donations
    ORDER BY CollectionDate DESC
  `);
};

export const getPendingDonations = async () => {
  return await db.getAllAsync(`
    SELECT *
    FROM Donations
    WHERE Status = 'Unpaid'
    ORDER BY CollectionDate DESC
  `);
};

export const markAsPaid = async (
  id: number,
  paymentMode: string
) => {

  const paidDate =
    new Date().toISOString();

  await db.runAsync(
    `
    UPDATE Donations
    SET
      Status='Paid',
      PaymentMode=?,
      PaidDate=?
    WHERE Id=?
    `,
    [paymentMode, paidDate, id]
  );
};

export const getDailyCollection = async (
  date: string
) => {

  return await db.getFirstAsync(
    `
    SELECT

    IFNULL(SUM(Amount),0)
      as TotalCollection,

    IFNULL(SUM(
      CASE
      WHEN PaymentMode='Cash'
      THEN Amount
      ELSE 0
      END
    ),0)
      as CashCollection,

    IFNULL(SUM(
      CASE
      WHEN PaymentMode='UPI'
      THEN Amount
      ELSE 0
      END
    ),0)
      as UPICollection,

    IFNULL(SUM(
      CASE
      WHEN Status='Unpaid'
      THEN Amount
      ELSE 0
      END
    ),0)
      as PendingCollection

    FROM Donations
    WHERE CollectionDate=?
    `,
    [date]
  );
};

export const getCollectorReport = async () => {

  return await db.getAllAsync(`
    SELECT
      CollectorName,
      SUM(Amount) AS Total
    FROM Donations
    GROUP BY CollectorName
    ORDER BY Total DESC
  `);
};

export const getLaneReport = async () => {

  return await db.getAllAsync(`
    SELECT
      Lane,
      SUM(Amount) AS Total
    FROM Donations
    GROUP BY Lane
    ORDER BY Total DESC
  `);
};

export const getDonorTypeReport = async () => {

  return await db.getAllAsync(`
    SELECT
      DonorType,
      SUM(Amount) AS Total
    FROM Donations
    GROUP BY DonorType
    ORDER BY Total DESC
  `);
};