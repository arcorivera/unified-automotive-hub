import { useState, useEffect } from 'react';
import {
    Plus, Trash2, Search, ChevronDown, Save, Printer,
    User, Calendar, DollarSign, FileText, Info
} from 'lucide-react';

const InvoiceEntry = ({ inventory }: { inventory: any[] }) => {
    // --- HEADER STATE ---
    const [header, setHeader] = useState({
        customerName: '',
        docNo: 'INV-' + Math.floor(Math.random() * 90000 + 10000),
        salesPerson: '',
        custOrderNo: '',
        orderDate: new Date().toISOString().split('T')[0],
        priceCode: 'RETAIL',
        salesRep: '',
        abn: '',
        terms: 'COD',
        availCredit: '5,000.00'
    });

    // --- LINE ITEMS STATE ---
    const [lines, setLines] = useState<any[]>([
        { id: 1, product: '', description: '', order: 0, supply: 0, bOrder: 0, bc: '', priceIncl: 0, gs: 'G', totalPrice: 0, cost: 0, mc: '', sc: '', sbr: '', pc: '' }
    ]);

    // --- ADD / REMOVE LINES ---
    const addLine = () => {
        const newId = lines.length > 0 ? lines[lines.length - 1].id + 1 : 1;
        setLines([...lines, { id: newId, product: '', description: '', order: 0, supply: 0, bOrder: 0, bc: '', priceIncl: 0, gs: 'G', totalPrice: 0, cost: 0, mc: '', sc: '', sbr: '', pc: '' }]);
    };

    const deleteLine = (id: number) => {
        if (lines.length === 1) return;
        setLines(lines.filter(line => line.id !== id));
    };

    // --- AUTO-FILL PRODUCT DATA ---
    const handleProductChange = (id: number, partNum: string) => {
        const part = inventory.find(p => p.partNumber === partNum);
        setLines(lines.map(line => {
            if (line.id === id) {
                return {
                    ...line,
                    product: partNum,
                    description: part ? part.description || part.itemName : '',
                    priceIncl: part ? parseFloat(part.sellingPrice) : 0,
                    cost: part ? parseFloat(part.actualPrice) : 0,
                };
            }
            return line;
        }));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* TOP HEADER SECTION */}
            <div className="grid grid-cols-12 gap-6 bg-card border rounded-xl p-6 shadow-sm">

                {/* Left Column: Customer Selection */}
                <div className="col-span-12 lg:col-span-4 space-y-4 border-r pr-6">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <button className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded">
                                <ChevronDown size={14} className="text-primary" />
                            </button>
                            <input
                                type="text"
                                placeholder="Customer Name"
                                className="w-full bg-background border rounded-md pl-10 pr-3 py-2 text-sm font-bold"
                                value={header.customerName}
                                onChange={(e) => setHeader({ ...header, customerName: e.target.value })}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Doc No."
                            className="w-32 bg-muted/50 border rounded-md px-3 py-2 text-sm font-mono text-right"
                            value={header.docNo}
                            readOnly
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-muted-foreground">ABN</label>
                            <input type="text" className="w-full bg-background border rounded px-2 py-1.5 text-xs" value={header.abn} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-muted-foreground">Avail Credit</label>
                            <input type="text" className="w-full bg-green-50/50 border border-green-200 rounded px-2 py-1.5 text-xs font-bold text-green-700 text-right" value={header.availCredit} readOnly />
                        </div>
                    </div>
                </div>

                {/* Middle/Right Columns: Form Fields */}
                <div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-4">
                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Sales Person</label>
                            <input type="text" className="w-full border rounded px-2 py-1.5 text-xs" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Cust Order #</label>
                            <input type="text" className="w-full border rounded px-2 py-1.5 text-xs" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Order Date</label>
                            <input type="date" className="w-full border rounded px-2 py-1.5 text-xs" value={header.orderDate} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Price Code</label>
                            <select className="w-full border rounded px-2 py-1.5 text-xs bg-background">
                                <option>RETAIL</option>
                                <option>TRADE</option>
                                <option>WHOLESALE</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Sales Rep</label>
                            <input type="text" className="w-full border rounded px-2 py-1.5 text-xs" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Terms</label>
                            <input type="text" className="w-full border rounded px-2 py-1.5 text-xs font-bold" value={header.terms} />
                        </div>
                    </div>
                </div>
            </div>

            {/* LINE ITEMS TABLE */}
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead className="bg-muted/50 border-b">
                            <tr className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground whitespace-nowrap">
                                <th className="px-2 py-3 w-10 text-center">Line</th>
                                <th className="px-2 py-3 w-40">Product</th>
                                <th className="px-2 py-3">Description</th>
                                <th className="px-2 py-3 w-16 text-center">Order</th>
                                <th className="px-2 py-3 w-16 text-center">Supply</th>
                                <th className="px-2 py-3 w-16 text-center">BOrder</th>
                                <th className="px-2 py-3 w-12 text-center">BC</th>
                                <th className="px-2 py-3 w-24 text-right">Price Incl</th>
                                <th className="px-2 py-3 w-10 text-center">GS</th>
                                <th className="px-2 py-3 w-28 text-right">Total Price</th>
                                <th className="px-2 py-3 w-20 text-right">Cost</th>
                                <th className="px-2 py-3 w-12 text-center">MC</th>
                                <th className="px-2 py-3 w-12 text-center">SC</th>
                                <th className="px-2 py-3 w-12 text-center">SBr</th>
                                <th className="px-2 py-3 w-12 text-center">PC</th>
                                <th className="px-2 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {lines.map((line, index) => (
                                <tr key={line.id} className="hover:bg-muted/20">
                                    <td className="px-2 py-1 text-center font-mono text-[10px] text-muted-foreground">{index + 1}</td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="text"
                                            className="w-full border-none bg-transparent p-0 text-xs font-bold focus:ring-0 uppercase"
                                            value={line.product}
                                            onChange={(e) => handleProductChange(line.id, e.target.value)}
                                        />
                                    </td>
                                    <td className="px-2 py-1 text-[10px] italic text-muted-foreground truncate max-w-[200px]">{line.description}</td>
                                    <td className="px-2 py-1"><input type="number" className="w-full border-none bg-transparent p-0 text-xs text-center focus:ring-0" defaultValue={0} /></td>
                                    <td className="px-2 py-1"><input type="number" className="w-full border-none bg-transparent p-0 text-xs text-center focus:ring-0" defaultValue={0} /></td>
                                    <td className="px-2 py-1 text-center text-xs">0</td>
                                    <td className="px-2 py-1 text-center text-xs">S</td>
                                    <td className="px-2 py-1 text-right font-mono text-xs">{line.priceIncl.toFixed(2)}</td>
                                    <td className="px-2 py-1 text-center text-xs">G</td>
                                    <td className="px-2 py-1 text-right font-bold text-xs">0.00</td>
                                    <td className="px-2 py-1 text-right text-xs text-muted-foreground">{line.cost.toFixed(2)}</td>
                                    <td className="px-2 py-1 text-center text-[10px]">01</td>
                                    <td className="px-2 py-1 text-center text-[10px]">WH</td>
                                    <td className="px-2 py-1 text-center text-[10px]">0</td>
                                    <td className="px-2 py-1 text-center text-[10px]">P1</td>
                                    <td className="px-2 py-1 text-center">
                                        <button onClick={() => deleteLine(line.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={12} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-4 bg-muted/30 border-t flex items-center justify-between">
                    <div className="flex gap-2">
                        <button onClick={addLine} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90">
                            <Plus size={14} /> Add Line
                        </button>
                        <button className="flex items-center gap-2 border bg-card px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-muted">
                            <Search size={14} /> Parex Inquiry
                        </button>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-muted-foreground uppercase">Subtotal</p>
                            <p className="text-xl font-black text-primary">$0.00</p>
                        </div>
                        <button className="bg-green-600 text-white px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-green-700">
                            <Save size={16} /> Process Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceEntry;