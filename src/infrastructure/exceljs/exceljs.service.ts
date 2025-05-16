import exceljs from 'exceljs';

export class ExceljsService {
    
    private readonly workbook: exceljs.Workbook = new exceljs.Workbook();

    constructor() {}

    public async createExcelBuffer(sheetData: { name: string, columns: exceljs.Column[], rows: any[] }[]): Promise<Buffer> {
        
        sheetData.forEach(data => {
            const sheet = this.workbook.getWorksheet(data.name) || this.createSheet(data.name);
            this.createColumns(sheet, data.columns);
            this.addRows(sheet, data.rows);
        });

        return Buffer.from(await this.workbook.xlsx.writeBuffer());
    }

    private createSheet(name: string): exceljs.Worksheet {
        return this.workbook.addWorksheet(name);
    }

    private createColumns(sheet: exceljs.Worksheet, columns: exceljs.Column[]): void {
        const columnObjects = columns.map((column) => ({
            header: column.header,
            key: column.key,
            width: column.width || 10, 
        }));
        sheet.columns = columnObjects;
    }

    private addRows(sheet: exceljs.Worksheet, rows: any[]): void {
        sheet.addRows(rows);
    }
}
