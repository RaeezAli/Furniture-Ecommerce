import * as XLSX from "xlsx";

export const exportToExcel = (data, columns, filename) => {
  const rows = data.map(item =>
    columns.reduce((row, col) => {
      row[col.label] = item[col.key] ?? "";
      return row;
    }, {})
  );

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const colWidths = columns.map(col => ({
    wch: Math.max(col.label.length, 15),
  }));
  worksheet["!cols"] = colWidths;

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
