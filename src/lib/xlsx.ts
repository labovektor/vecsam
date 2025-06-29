import xlsx, {
  type IColumn,
  type IJsonSheet,
  type ISettings,
} from "json-as-xlsx";

export function exportAsExcelFile(
  data: any[],
  columns: IColumn[],
  sheetName: string,
  callback?: () => void,
): void {
  const column: IJsonSheet[] = [
    {
      sheet: sheetName,
      columns: columns,
      content: data,
    },
  ];

  const time = Date.now().toString();
  const setting: ISettings = {
    fileName: `${sheetName} - ${time}`,
  };

  xlsx(column, setting, callback);
}
