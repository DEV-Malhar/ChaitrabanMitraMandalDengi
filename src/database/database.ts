import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("chaitraban_dengi.db");

export const initializeDatabase = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Donations (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,

      ReceiptNo TEXT NOT NULL,

      CollectionDate TEXT NOT NULL,

      DonorName TEXT NOT NULL,

      Mobile TEXT,

      Address TEXT,

      Lane TEXT,

      DonorType TEXT,

      Amount REAL NOT NULL,

      PaymentMode TEXT NOT NULL,

      Status TEXT NOT NULL,

      PaidDate TEXT,

      CollectorName TEXT,

      Remarks TEXT,
      
      CreatedDate TEXT,
      
      ModifiedDate TEXT
    );
    CREATE TABLE IF NOT EXISTS UpiAccounts (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,

  AccountName TEXT NOT NULL,

  UpiId TEXT NOT NULL,

  IsDefault INTEGER DEFAULT 0
);
  `);

  console.log("Database initialized");
};

export default db;
