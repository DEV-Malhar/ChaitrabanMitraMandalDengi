export interface Donation {
  Id?: number;

  ReceiptNo: string;

  CollectionDate: string;

  DonorName: string;

  Mobile: string;

  Address: string;

  Lane: string;

  DonorType: string;

  Amount: number;

  PaymentMode: string;

  Status: string;

  PaidDate?: string;

  CollectorName: string;

  Remarks?: string;

  CreatedDate?: string;
  ModifiedDate?: string;
}