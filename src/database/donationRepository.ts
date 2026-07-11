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
  const rows = await db.getAllAsync(`
    SELECT *
    FROM Donations
    WHERE Status = ?
    ORDER BY CollectionDate DESC
  `, ["Unpaid"]);

  return rows;
};

export const markAsPaid = async (
  id: number,
  paymentMode: string
) => {
  const now = new Date().toISOString();

  console.log("Updating Id =>", id);

  const result = await db.runAsync(
    `
    UPDATE Donations
    SET
      Status='Paid',
      PaymentMode=?,
      PaidDate=?,
      ModifiedDate=?
    WHERE Id=?
    `,
    [
      paymentMode,
      now,
      now,
      id,
    ]
  );

  console.log("UPDATE RESULT =>", result);

  const updated = await db.getFirstAsync(
    `SELECT * FROM Donations WHERE Id = ?`,
    [id]
  );

  console.log("UPDATED RECORD =>", updated);
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

export const deleteDonation = async (
  id: number
) => {
  await db.runAsync(
    "DELETE FROM Donations WHERE Id=?",
    [id]
  );
};

export const updateDonation = async (
  donation: Donation
) => {

  const modifiedDate =
    new Date().toISOString();

  await db.runAsync(
    `
    UPDATE Donations
    SET
      DonorName=?,
      Mobile=?,
      Address=?,
      Lane=?,
      DonorType=?,
      Amount=?,
      CollectorName=?,
      Remarks=?,
      ModifiedDate=?
    WHERE Id=?
    `,
    [
      donation.DonorName ?? null,
      donation.Mobile ?? null,
      donation.Address ?? null,
      donation.Lane ?? null,
      donation.DonorType ?? null,
      donation.Amount ?? null,
      donation.CollectorName ?? null,
      donation.Remarks ?? null,
      modifiedDate,
      donation.Id ?? null
    ]
  );
};

export const receivePendingDonation = async (
  donation: Donation
) => {
  const now =
    new Date().toISOString();

  if (donation.Id == null) {
    throw new Error("Donation Id is required for receiving pending donation");
  }

  await db.runAsync(
    `
    UPDATE Donations
    SET
      Mobile=?,
      Address=?,
      Amount=?,
      PaymentMode=?,
      Remarks=?,
      Status='Paid',
      PaidDate=?,
      ModifiedDate=?
    WHERE Id=?
    `,
    [
      donation.Mobile ?? null,
      donation.Address ?? null,
      donation.Amount ?? 0,
      donation.PaymentMode ?? null,
      donation.Remarks ?? null,
      now,
      now,
      donation.Id
    ]
  );
};

export const getDonationById = async (
  id: number
) => {
  return await db.getFirstAsync(
    `
    SELECT *
    FROM Donations
    WHERE Id = ?
    `,
    [id]
  );
};

export const getFilteredDonations = async (
  collectionDate?: string,
  status?: string,
  lane?: string
) => {
  let query = `
    SELECT *
    FROM Donations
    WHERE 1=1
  `;

  const params: any[] = [];

  if (collectionDate) {
    query += ` AND CollectionDate = ?`;
    params.push(collectionDate);
  }

  if (status && status !== "All") {
    query += ` AND Status = ?`;
    params.push(status);
  }

  if (lane && lane !== "All") {
    query += ` AND Lane = ?`;
    params.push(lane);
  }

  query += `
    ORDER BY CollectionDate DESC,
             ReceiptNo DESC
  `;

  return await db.getAllAsync(query, params);
};