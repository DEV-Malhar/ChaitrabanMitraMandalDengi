import db from "./database";

export const getUpiAccounts = async () => {
  return await db.getAllAsync(
    `SELECT * FROM UpiAccounts
     ORDER BY AccountName`
  );
};

export const addUpiAccount = async (
  accountName: string,
  upiId: string
) => {
  await db.runAsync(
    `
    INSERT INTO UpiAccounts
    (
      AccountName,
      UpiId,
      IsDefault
    )
    VALUES
    (
      ?, ?, 0
    )
    `,
    [accountName, upiId]
  );
};

export const deleteUpiAccount = async (
  id: number
) => {
  await db.runAsync(
    `DELETE FROM UpiAccounts
     WHERE Id=?`,
    [id]
  );
};

export const setDefaultUpi = async (
  id: number
) => {

  await db.runAsync(
    `UPDATE UpiAccounts
     SET IsDefault = 0`
  );

  await db.runAsync(
    `
    UPDATE UpiAccounts
    SET IsDefault = 1
    WHERE Id = ?
    `,
    [id]
  );
};

export const getDefaultUpi = async () => {

  return await db.getFirstAsync(
    `
    SELECT *
    FROM UpiAccounts
    WHERE IsDefault = 1
    LIMIT 1
    `
  );
};