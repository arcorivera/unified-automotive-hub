import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Receipt, History, Save, PlusCircle, Trash2,
    ShieldCheck, FileEdit
} from 'lucide-react';

const InvoiceEntry = ({
    inventory,
    setInventory,
    savedInvoices,
    setSavedInvoices,
    currentUser,
    invoiceToEdit,
    setInvoiceToEdit
}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [invoiceHeader, setInvoiceHeader] = useState({
        customer: '',
        customerCode: '',
        custOrderNo: '',
        orderDate: new Date().toISOString().split('T')[0],
        priceCode: 'Retail',
        salesRep: '',
        salesPerson: '',
        abn: '77 123 456 789',
        terms: 'Net 30',
        availCredit: '5,000.00',
        businessAddress: '',
        contactNumber: ''
    });

    const [lineItems, setLineItems] = useState([
        {
            id: 1,
            partNumber: '',
            description: '',
            order: 1,
            supply: 0,
            border: 0,
            bc: '',
            price: 0,
            total: 0,
            cost: 0,
            mc: '',
            sc: '',
            sbr: '',
            pc: '',
            actualPartCode: '',
            itemName: ''
        }
    ]);

    // --- CUSTOMER LOOKUP & REFLECTION LOGIC ---
    useEffect(() => {
        const code = invoiceHeader.customerCode;

        if (code) {
            const savedCustomers = JSON.parse(localStorage.getItem('erp_customers_db') || '[]');
            const found = savedCustomers.find(c => String(c.customerCode).toUpperCase() === String(code).toUpperCase());

            if (found) {
                setInvoiceHeader(prev => ({
                    ...prev,
                    customer: found.customerName || found.name || '',
                    businessAddress: found.businessAddress || found.address || '',
                    contactNumber: found.contactNumber || found.contact || '',
                    availCredit: found.creditLimit || found.availCredit || '0.00'
                }));
            } else {
                // Clear details if code is typed but not found
                setInvoiceHeader(prev => ({
                    ...prev,
                    customer: '',
                    businessAddress: '',
                    contactNumber: '',
                    availCredit: '0.00'
                }));
            }
        } else {
            // Clear details if the code field is deleted/empty
            setInvoiceHeader(prev => ({
                ...prev,
                customer: '',
                businessAddress: '',
                contactNumber: '',
                availCredit: '0.00'
            }));
        }
    }, [invoiceHeader.customerCode]);

    useEffect(() => {
        if (invoiceToEdit) {
            setInvoiceHeader({
                customer: invoiceToEdit.customer || '',
                customerCode: invoiceToEdit.customerCode || '',
                custOrderNo: invoiceToEdit.custOrderNo || '',
                orderDate: invoiceToEdit.orderDate || '',
                priceCode: invoiceToEdit.priceCode || 'Retail',
                salesRep: invoiceToEdit.salesRep || '',
                salesPerson: invoiceToEdit.salesPerson || '',
                abn: invoiceToEdit.abn || '77 123 456 789',
                terms: invoiceToEdit.terms || 'Net 30',
                availCredit: invoiceToEdit.availCredit || '5,000.00',
                businessAddress: invoiceToEdit.businessAddress || '',
                contactNumber: invoiceToEdit.contactNumber || ''
            });

            if (invoiceToEdit.items && invoiceToEdit.items.length > 0) {
                setLineItems(invoiceToEdit.items.map((item, idx) => ({
                    ...item,
                    id: item.id || idx + Date.now()
                })));
            }
        }
    }, [invoiceToEdit]);

    const subtotal = lineItems.reduce((acc, curr) => acc + curr.total, 0);

    const handleProductSearch = (index, value) => {
        const updatedLines = [...lineItems];
        updatedLines[index].partNumber = value;
        const foundItem = inventory.find(item =>
            item.partNumber.toUpperCase() === value.toUpperCase() ||
            item.itemName.toUpperCase() === value.toUpperCase()
        );
        if (foundItem) {
            const stockAvailable = foundItem.quantity || 0;
            updatedLines[index].partNumber = foundItem.partNumber;
            updatedLines[index].description = foundItem.description || '';
            updatedLines[index].itemName = foundItem.itemName;
            updatedLines[index].price = parseFloat(foundItem.sellingPrice) || 0;
            updatedLines[index].cost = parseFloat(foundItem.actualPrice) || 0;
            updatedLines[index].actualPartCode = foundItem.partNumber;
            const requested = updatedLines[index].order;
            updatedLines[index].supply = requested <= stockAvailable ? requested : stockAvailable;
            updatedLines[index].border = requested > stockAvailable ? requested - stockAvailable : 0;
            updatedLines[index].total = updatedLines[index].supply * updatedLines[index].price;
        } else {
            updatedLines[index].description = '';
            updatedLines[index].itemName = '';
            updatedLines[index].price = 0;
            updatedLines[index].supply = 0;
            updatedLines[index].border = 0;
            updatedLines[index].total = 0;
        }
        setLineItems(updatedLines);
    };

    const handleOrderQtyChange = (index, qty) => {
        const updatedLines = [...lineItems];
        const requested = parseInt(qty) || 0;
        updatedLines[index].order = requested;
        const searchKey = updatedLines[index].actualPartCode || updatedLines[index].partNumber;
        const foundItem = inventory.find(item => item.partNumber.toUpperCase() === searchKey.toUpperCase());
        if (foundItem) {
            const stockAvailable = foundItem.quantity || 0;
            updatedLines[index].supply = requested <= stockAvailable ? requested : stockAvailable;
            updatedLines[index].border = requested > stockAvailable ? requested - stockAvailable : 0;
        } else {
            updatedLines[index].supply = 0;
            updatedLines[index].border = requested;
        }
        updatedLines[index].total = updatedLines[index].supply * updatedLines[index].price;
        setLineItems(updatedLines);
    };

    const addNewLine = () => {
        setLineItems([...lineItems, {
            id: Date.now(),
            partNumber: '', description: '', order: 1, supply: 0, border: 0,
            bc: '', price: 0, total: 0, cost: 0, mc: '', sc: '', sbr: '', pc: '',
            actualPartCode: '', itemName: ''
        }]);
    };

    const deleteLine = () => {
        if (lineItems.length > 1) {
            const updatedLines = [...lineItems];
            updatedLines.pop();
            setLineItems(updatedLines);
        }
    };

    const handleSaveInvoice = () => {
        if (!invoiceHeader.customer) { alert("Please enter a Customer Name"); return; }
        const invoiceRecord = {
            ...invoiceHeader,
            items: lineItems.filter(item => item.itemName !== '').map(item => ({
                ...item,
                productCode: item.actualPartCode || item.partNumber,
                productName: item.itemName,
            })),
            id: invoiceToEdit ? invoiceToEdit.id : crypto.randomUUID(),
            timestamp: new Date().toLocaleString(),
            createdBy: invoiceToEdit ? invoiceToEdit.createdBy : currentUser.name,
            lastModifiedBy: currentUser.name,
            updatedAt: invoiceToEdit ? new Date().toLocaleString() : null
        };
        const existingInvoices = JSON.parse(localStorage.getItem('erp_invoices_db') || '[]');
        let updatedInvoices;
        if (invoiceToEdit) {
            updatedInvoices = existingInvoices.map(inv => inv.id === invoiceToEdit.id ? invoiceRecord : inv);
        } else {
            updatedInvoices = [invoiceRecord, ...existingInvoices];
        }
        const updatedInventory = inventory.map(inventoryItem => {
            const soldItem = lineItems.find(line => (line.actualPartCode || line.partNumber).toUpperCase() === inventoryItem.partNumber.toUpperCase());
            if (soldItem && !invoiceToEdit) {
                return { ...inventoryItem, quantity: Math.max(0, inventoryItem.quantity - soldItem.supply) };
            }
            return inventoryItem;
        });
        localStorage.setItem('erp_invoices_db', JSON.stringify(updatedInvoices));
        localStorage.setItem('erp_parts_db', JSON.stringify(updatedInventory));
        setSavedInvoices(updatedInvoices);
        setInventory(updatedInventory);
        alert(invoiceToEdit ? "Changes Updated Successfully!" : "Invoice Saved Successfully!");
        setInvoiceToEdit(null);
        setSearchParams({ tab: 'sales', sub: 'invoice-history' });
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-2 duration-500 text-left space-y-2 w-full">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <h2 className="text-sm font-black text-slate-900 uppercase flex items-center gap-1.5">
                    {invoiceToEdit ? <FileEdit className="w-3.5 h-3.5 text-amber-600" /> : <Receipt className="w-3.5 h-3.5 text-blue-600" />}
                    {invoiceToEdit ? `Editing Invoice: ${invoiceToEdit.id.slice(0, 8)}` : "Invoice Entry"}
                </h2>
                <div className="flex gap-1.5">
                    {invoiceToEdit && (
                        <button onClick={() => { setInvoiceToEdit(null); setSearchParams({ tab: 'sales', sub: 'invoice-history' }); }} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[7px] font-black uppercase flex items-center gap-1">
                            Cancel Edit
                        </button>
                    )}
                    <button onClick={() => setSearchParams({ tab: 'sales', sub: 'invoice-history' })} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[7px] font-black uppercase flex items-center gap-1 hover:bg-slate-200 transition-colors">
                        <History className="w-2.5 h-2.5" /> History
                    </button>
                    <button onClick={handleSaveInvoice} className={`${invoiceToEdit ? 'bg-amber-600' : 'bg-blue-600'} text-white px-2 py-1 rounded text-[7px] font-black uppercase flex items-center gap-1 shadow-sm`}>
                        <Save className="w-2.5 h-2.5" /> {invoiceToEdit ? "Update Changes" : "Save Invoice"}
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-sm grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                <div className="lg:col-span-1 space-y-0.5">
                    <label className="text-[7px] font-black text-slate-500 uppercase">Customer Code</label>
                    <input className="w-full h-7 bg-slate-900 rounded px-2 text-[10px] font-bold text-white outline-none" placeholder="CODE" value={invoiceHeader.customerCode} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, customerCode: e.target.value.toUpperCase() })} />
                </div>
                <div className="lg:col-span-2 space-y-0.5">
                    <label className="text-[7px] font-black text-slate-500 uppercase">Customer Name</label>
                    <input className="w-full h-7 bg-slate-900 rounded px-2 text-[10px] font-bold text-white outline-none" placeholder="FULL NAME" value={invoiceHeader.customer} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, customer: e.target.value })} />
                </div>
                <div className="lg:col-span-2 space-y-0.5">
                    <label className="text-[7px] font-black text-slate-500 uppercase">Business Address</label>
                    <input className="w-full h-7 bg-slate-900 rounded px-2 text-[10px] font-bold text-white outline-none" placeholder="STREET, CITY, ZIP" value={invoiceHeader.businessAddress} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, businessAddress: e.target.value })} />
                </div>
                <div className="lg:col-span-1 space-y-0.5">
                    <label className="text-[7px] font-black text-slate-500 uppercase">Contact #</label>
                    <input className="w-full h-7 bg-slate-900 rounded px-2 text-[10px] font-bold text-white outline-none" placeholder="09XX-XXX-XXXX" value={invoiceHeader.contactNumber} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, contactNumber: e.target.value })} />
                </div>

                <div className="space-y-0.5">
                    <label className="text-[7px] font-black text-slate-500 uppercase">Cust. Order #</label>
                    <input className="w-full h-7 bg-slate-900 rounded px-2 text-[10px] font-bold text-white text-center outline-none" value={invoiceHeader.custOrderNo} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, custOrderNo: e.target.value })} />
                </div>
                <div className="space-y-0.5">
                    <label className="text-[7px] font-black text-slate-500 uppercase">Order Date</label>
                    <input type="date" className="w-full h-7 bg-slate-900 rounded px-1.5 text-[10px] font-bold text-white outline-none" value={invoiceHeader.orderDate} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, orderDate: e.target.value })} />
                </div>
                <div className="space-y-0.5">
                    <label className="text-[7px] font-black text-slate-500 uppercase">Price Code</label>
                    <select className="w-full h-7 bg-slate-900 text-white rounded px-1.5 text-[10px] font-bold outline-none" value={invoiceHeader.priceCode} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, priceCode: e.target.value })}>
                        <option>Retail</option>
                        <option>Trade</option>
                    </select>
                </div>
                <div className="space-y-0.5">
                    <label className="text-[7px] font-black text-slate-500 uppercase">Sales Rep</label>
                    <input className="w-full h-7 bg-slate-900 rounded px-2 text-[10px] font-bold text-white outline-none" value={invoiceHeader.salesRep} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, salesRep: e.target.value })} />
                </div>
                <div className="space-y-0.5">
                    <label className="text-[7px] font-black text-slate-500 uppercase">Sales Person</label>
                    <input className="w-full h-7 bg-slate-900 rounded px-2 text-[10px] font-bold text-white outline-none" value={invoiceHeader.salesPerson} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, salesPerson: e.target.value })} />
                </div>
                <div className="space-y-0.5">
                    <label className="text-[7px] font-black text-slate-500 uppercase">Terms</label>
                    <input className="w-full h-7 bg-slate-900 rounded px-2 text-[10px] font-bold text-white outline-none" value={invoiceHeader.terms} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, terms: e.target.value })} />
                </div>

                <div className="space-y-0.5">
                    <label className="text-[7px] font-black text-green-600 uppercase">Avail. Credit</label>
                    <input className="w-full h-7 bg-slate-900 rounded px-2 text-[10px] font-black text-green-400 outline-none" value={invoiceHeader.availCredit} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, availCredit: e.target.value })} />
                </div>
                <div className="space-y-0.5">
                    <label className="text-[7px] font-black text-slate-600 uppercase">ABN</label>
                    <input disabled className="w-full h-7 bg-slate-900 rounded px-2 text-[10px] font-bold text-slate-400 outline-none border border-slate-700" value={invoiceHeader.abn} />
                </div>
            </div>

            <div className="flex gap-1.5 pt-2">
                <button onClick={addNewLine} className="flex items-center gap-1 px-2 py-1 border border-green-200 rounded text-[7px] font-black uppercase bg-green-50 text-green-700 hover:bg-green-100 transition-all">
                    <PlusCircle size={10} /> Add Line
                </button>
                <button onClick={deleteLine} className="flex items-center gap-1 px-2 py-1 border border-red-200 rounded text-[7px] font-black uppercase bg-red-50 text-red-700 hover:bg-red-100 transition-all">
                    <Trash2 size={10} /> Remove Line
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1400px]">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                {['#', 'Product Code', 'Description', 'Order', 'Supply', 'Border', 'BC', 'Price', 'Total', 'MC', 'SC', 'SBR', 'PC'].map((col) => (
                                    <th key={col} className="px-1.5 py-1 text-[7px] font-black uppercase text-center border-r border-slate-700">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {lineItems.map((item, index) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-1 py-1 text-[9px] font-black text-slate-400 text-center bg-slate-50/50">{String(index + 1).padStart(2, '0')}</td>
                                    <td className="px-1 py-0.5 border-r border-slate-100 w-28">
                                        <input className="w-full text-center font-bold text-[10px] text-white outline-none bg-slate-900 rounded h-6 px-1" placeholder="SEARCH..." value={item.partNumber} onChange={(e) => handleProductSearch(index, e.target.value)} />
                                    </td>
                                    <td className="px-1 py-0.5 border-r border-slate-100 min-w-[250px]">
                                        <div className="w-full h-6 flex items-center px-1.5 bg-slate-50 rounded text-[10px] overflow-hidden whitespace-nowrap">
                                            <span className="text-blue-600 font-black shrink-0 uppercase">{item.itemName}</span>
                                            {item.description && <span className="text-slate-900 font-medium ml-1 truncate">| {item.description}</span>}
                                        </div>
                                    </td>
                                    <td className="px-1 py-0.5 border-r border-slate-100 w-14">
                                        <input type="number" className="w-full text-center font-bold text-[10px] text-white bg-slate-900 rounded h-6 outline-none" value={item.order} onChange={(e) => handleOrderQtyChange(index, e.target.value)} />
                                    </td>
                                    <td className="px-1 py-0.5 border-r border-slate-100 text-center font-bold text-blue-600 text-[10px]">{item.supply}</td>
                                    <td className="px-1 py-0.5 border-r border-slate-100 text-center font-bold text-red-500 text-[10px]">{item.border}</td>
                                    <td className="px-1 py-0.5 border-r border-slate-100 w-12">
                                        <input className="w-full text-center text-[9px] font-bold bg-slate-50 rounded h-6 outline-none uppercase" value={item.bc} onChange={(e) => {
                                            const updated = [...lineItems]; updated[index].bc = e.target.value; setLineItems(updated);
                                        }} />
                                    </td>
                                    <td className="px-1 py-0.5 border-r border-slate-100 text-center font-mono font-bold text-slate-900 text-[9px]">₱{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="px-1 py-0.5 border-r border-slate-100 text-center font-black text-blue-600 text-[9px]">₱{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    {['mc', 'sc', 'sbr', 'pc'].map(field => (
                                        <td key={field} className="px-1 py-0.5 border-r border-slate-100 w-12">
                                            <input className="w-full text-center text-[9px] bg-slate-50 rounded h-6 outline-none uppercase" value={item[field]} onChange={(e) => {
                                                const updated = [...lineItems]; updated[index][field] = e.target.value; setLineItems(updated);
                                            }} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-end pt-1">
                <div className="bg-slate-900 text-white rounded-lg p-2 min-w-[180px] space-y-1 shadow-lg">
                    <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase"><span>Subtotal:</span> <span>₱{subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase"><span>Tax (12%):</span> <span>₱{(subtotal * 0.12).toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm font-black border-t border-slate-700 pt-1 text-blue-400 tracking-tighter uppercase"><span>Grand Total:</span> <span>₱{(subtotal * 1.12).toLocaleString()}</span></div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceEntry;