import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx";

export const exportDonationsToExcel = async (donations: any[]) => {
  try {
    console.log("DONATIONS =>", donations);
    const excelData = donations.map((item) => ({
      "Receipt No": item.ReceiptNo,
      "Donor Name": item.DonorName,
      Amount: item.Amount,
      "Payment Mode": item.PaymentMode,
      Status: item.Status,
      Mobile: item.Mobile,
      Address: item.Address,
      Lane: item.Lane,
      "Donor Type": item.DonorType,
      "Collection Date": item.CollectionDate,
      "Paid Date": item.PaidDate,
      Collector: item.CollectorName,
      Remarks: item.Remarks,
    }));

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");

    const wbout = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    const fileUri = FileSystem.documentDirectory + "DonationReport.xlsx";

    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(fileUri);
  } catch (error) {
    console.log("EXPORT ERROR =>", error);
    console.log("EXPORT ERROR JSON =>", JSON.stringify(error));
  }
};
