"use client";

import React, { useState, useMemo } from "react";
import { Plus, Trash2, Download, Table2, FileSpreadsheet } from "lucide-react";
import { calculateTotalWeight } from "@rdcad-express/core-math";
import type { RebarElement } from "@rdcad-express/dwg-schemas";
import * as XLSX from "xlsx";

export default function BBSGenerator() {
 const [rows, setRows] = useState<RebarElement[]>([
 {
 elementMark: "B1",
 shapeCode: "20",
 diameter: 16,
 numberOfMembers: 1,
 barsPerMember: 4,
 cuttingLength: 5.2,
 totalWeight: 0,
 },
 ]);

 const handleAddRow = () => {
 setRows([
 ...rows,
 {
 elementMark: `B${rows.length + 1}`,
 shapeCode: "20",
 diameter: 12,
 numberOfMembers: 1,
 barsPerMember: 2,
 cuttingLength: 3.0,
 totalWeight: 0,
 },
 ]);
 };

 const handleRemoveRow = (index: number) => {
 setRows(rows.filter((_, i) => i !== index));
 };

 const handleChange = (index: number, field: keyof RebarElement, value: string | number) => {
 const newRows = [...rows];
 // @ts-expect-error Dynamic field assignment
 newRows[index][field] = value;
 setRows(newRows);
 };

 const handleExportCSV = () => {
 const headers = ["Mark", "Shape Code", "Diameter (mm)", "Members", "Bars/Member", "Cutting Length (m)", "Weight (kg)"];
 
 const csvContent = [
 headers.join(","),
 ...rows.map(row => {
 const weight = calculateTotalWeight(row.diameter, row.cuttingLength, row.numberOfMembers * row.barsPerMember);
 return [
 row.elementMark,
 row.shapeCode,
 row.diameter,
 row.numberOfMembers,
 row.barsPerMember,
 row.cuttingLength,
 weight.toFixed(2)
 ].join(",");
 })
 ].join("\n");

 const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
 const url = URL.createObjectURL(blob);
 const link = document.createElement("a");
 link.href = url;
 link.setAttribute("download", "bbs_export.csv");
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 URL.revokeObjectURL(url);
 };

 const handleExportExcel = () => {
 const data = rows.map(row => {
 const weight = calculateTotalWeight(row.diameter, row.cuttingLength, row.numberOfMembers * row.barsPerMember);
 return {
 "Mark": row.elementMark,
 "Shape Code": row.shapeCode,
 "Diameter (mm)": row.diameter,
 "Members": row.numberOfMembers,
 "Bars/Member": row.barsPerMember,
 "Cutting Length (m)": row.cuttingLength,
 "Weight (kg)": parseFloat(weight.toFixed(2))
 };
 });

 const worksheet = XLSX.utils.json_to_sheet(data);
 const workbook = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(workbook, worksheet, "BBS");
 
 // Auto-size columns
 const colWidths = [
 { wch: 10 }, { wch: 12 }, { wch: 15 }, 
 { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 15 }
 ];
 worksheet["!cols"] = colWidths;

 XLSX.writeFile(workbook, "bbs_export.xlsx");
 };

 const totalTonnage = useMemo(() => {
 return rows.reduce((sum, row) => {
 const weight = calculateTotalWeight(row.diameter, row.cuttingLength, row.numberOfMembers * row.barsPerMember);
 return sum + weight;
 }, 0);
 }, [rows]);

 return (
 <div className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-4">
 <div className="max-w-7xl mx-auto space-y-4">
 <header className="flex flex-col md:flex-row md:items-center md:justify-between items-start gap-4 pb-4 border-b border-border">
 <div>
 <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
 <Table2 className="w-6 h-6 text-primary" />
 Bar Bending Schedule (BBS)
 </h1>
 <p className="text-muted-foreground mt-1 text-sm">Real-time parametric rebar weight calculations</p>
 </div>
 
 </header>

 <div className="bg-card rounded-xl border border-border overflow-hidden shadow-2xl">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-background/50 text-muted-foreground text-sm">
 <th className="p-4 font-medium border-b border-border">Mark</th>
 <th className="p-4 font-medium border-b border-border">Shape</th>
 <th className="p-4 font-medium border-b border-border">Dia (mm)</th>
 <th className="p-4 font-medium border-b border-border">Members</th>
 <th className="p-4 font-medium border-b border-border">Bars/Mem</th>
 <th className="p-4 font-medium border-b border-border">Length (m)</th>
 <th className="p-4 font-medium border-b border-border text-right">Weight (kg)</th>
 <th className="p-4 font-medium border-b border-border text-center">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-800/50">
 {rows.map((row, idx) => {
 const calculatedWeight = calculateTotalWeight(row.diameter, row.cuttingLength, row.numberOfMembers * row.barsPerMember);
 return (
 <tr key={idx} className="hover:bg-muted/20 transition-colors group">
 <td className="p-3">
 <input 
 type="text" 
 value={row.elementMark} 
 onChange={(e) => handleChange(idx, "elementMark", e.target.value)}
 className="w-full bg-background/50 border border-border rounded px-3 py-2 text-sm focus:border-blue-700 dark:border-blue-500 focus:outline-none transition"
 />
 </td>
 <td className="p-3">
 <input 
 type="text" 
 value={row.shapeCode} 
 onChange={(e) => handleChange(idx, "shapeCode", e.target.value)}
 className="w-20 bg-background/50 border border-border rounded px-3 py-2 text-sm focus:border-blue-700 dark:border-blue-500 focus:outline-none transition"
 />
 </td>
 <td className="p-3">
 <input 
 type="number" 
 value={row.diameter} 
 onChange={(e) => handleChange(idx, "diameter", parseFloat(e.target.value) || 0)}
 className="w-24 bg-background/50 border border-border rounded px-3 py-2 text-sm focus:border-blue-700 dark:border-blue-500 focus:outline-none transition"
 />
 </td>
 <td className="p-3">
 <input 
 type="number" 
 value={row.numberOfMembers} 
 onChange={(e) => handleChange(idx, "numberOfMembers", parseFloat(e.target.value) || 0)}
 className="w-24 bg-background/50 border border-border rounded px-3 py-2 text-sm focus:border-blue-700 dark:border-blue-500 focus:outline-none transition"
 />
 </td>
 <td className="p-3">
 <input 
 type="number" 
 value={row.barsPerMember} 
 onChange={(e) => handleChange(idx, "barsPerMember", parseFloat(e.target.value) || 0)}
 className="w-24 bg-background/50 border border-border rounded px-3 py-2 text-sm focus:border-blue-700 dark:border-blue-500 focus:outline-none transition"
 />
 </td>
 <td className="p-3">
 <input 
 type="number" 
 value={row.cuttingLength} 
 onChange={(e) => handleChange(idx, "cuttingLength", parseFloat(e.target.value) || 0)}
 className="w-24 bg-background/50 border border-border rounded px-3 py-2 text-sm focus:border-blue-700 dark:border-blue-500 focus:outline-none transition"
 />
 </td>
 <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
 {calculatedWeight.toFixed(2)}
 </td>
 <td className="p-3 text-center">
 <button 
 onClick={() => handleRemoveRow(idx)}
 className="p-2 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-400/10 rounded transition opacity-0 group-hover:opacity-100"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </td>
 </tr>
 )
 })}
 </tbody>
 </table>
 </div>
 
 <div className="bg-background/80 p-6 border-t border-border flex flex-col gap-4">
 <div className="flex justify-between items-center">
 <div className="text-muted-foreground text-sm">
 * Weight calculation is based on standard formula (D²/162.2) × L × Qty.
 </div>
 <div className="flex items-center gap-4">
 <span className="text-muted-foreground">Total Steel Tonnage:</span>
 <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
 {(totalTonnage / 1000).toFixed(3)} <span className="text-xl text-emerald-700 dark:text-emerald-500/50">MT</span>
 </span>
 </div>
 </div>
 <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-border">
 <button 
 onClick={handleExportCSV}
 className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted transition rounded-lg border border-border"
 >
 <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export CSV</span>
 </button>
 <button 
 onClick={handleExportExcel}
 className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 transition rounded-lg border border-green-600 dark:border-green-400 text-foreground shadow-lg shadow-green-900/20"
 >
 <FileSpreadsheet className="w-4 h-4" /> <span className="hidden sm:inline">Export Excel</span>
 </button>
 <button 
 onClick={handleAddRow}
 className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary transition rounded-lg font-medium shadow-lg shadow-blue-500/20"
 >
 <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Row</span>
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
