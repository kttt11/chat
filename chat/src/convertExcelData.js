import XLSX from 'xlsx';

export const convertExcelData = async (file) => {
    const fileBuffer = await fetch(file.uri).then(response => response.arrayBuffer());
    const workbook = XLSX.read(fileBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return data;
}
