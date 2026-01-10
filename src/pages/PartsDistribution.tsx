import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  FileText, PlusCircle, ClipboardList, ArrowLeftRight, Printer,
  Calculator, Barcode, LockKeyholeOpen, Search, BarChart3,
  Save, RotateCcw, PackageSearch, Hash, Tag, Layers, DollarSign,
  User, Calendar, Clock, Info, CheckCircle2, Users, ListFilter, Trash2, UserCog,
  ChevronRight, ArrowLeft, Pencil, X, History, SearchX, Receipt, ChevronDown, MapPin, Bell, Settings
} from 'lucide-react';

const PartsDistribution = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'sales';
  const activeSub = searchParams.get('sub') || 'Dashboard';

  const [searchTerm, setSearchTerm] = useState('');

  // --- STATE FOR SAVED INVOICES ---
  const [savedInvoices, setSavedInvoices] = useState([]);

  const availableUsers = [
    { name: "John Doe", id: "EMP-0882", role: "Administrator", branch: "Main Branch", color: "bg-red-500" },
    { name: "Sarah Smith", id: "EMP-0915", role: "Inventory Manager", branch: "Main Branch", color: "bg-blue-500" },
    { name: "Mike Ross", id: "EMP-1104", role: "Sales Clerk", branch: "Main Branch", color: "bg-green-500" }
  ];
  const [currentUser, setCurrentUser] = useState(availableUsers[0]);

  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    partNumber: '', itemName: '', description: '', quantity: 0, actualPrice: '', sellingPrice: '',
  });

  const [invoiceHeader, setInvoiceHeader] = useState({
    customer: '',
    custOrderNo: '',
    orderDate: new Date().toISOString().split('T')[0],
    priceCode: 'Retail',
    salesRep: ''
  });

  // --- INVOICE LINE ITEMS STATE ---
  const [lineItems, setLineItems] = useState([
    { id: 1, partNumber: '', description: '', qty: 1, price: 0, total: 0 }
  ]);

  const [inventory, setInventory] = useState([]);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [editingId, setEditingId] = useState(null);

  // --- LOAD DATA ON MOUNT ---
  useEffect(() => {
    const invData = localStorage.getItem('erp_parts_db');
    if (invData) setInventory(JSON.parse(invData));

    const invDb = localStorage.getItem('erp_invoices_db');
    if (invDb) setSavedInvoices(JSON.parse(invDb));
  }, [activeSub]);

  const filteredInventory = inventory.filter(item =>
    item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- AUTO-LOOKUP LOGIC FOR INVOICE ---
  const handlePartNumberChange = (index, value) => {
    const updatedLines = [...lineItems];
    updatedLines[index].partNumber = value;

    // Find item in inventory
    const foundItem = inventory.find(item => item.partNumber.toUpperCase() === value.toUpperCase());

    if (foundItem) {
      updatedLines[index].description = foundItem.itemName; // Gamitin ang itemName bilang primary description
      updatedLines[index].price = parseFloat(foundItem.sellingPrice) || 0;
      updatedLines[index].total = updatedLines[index].qty * updatedLines[index].price;
    } else {
      // Clear fields if code not found
      updatedLines[index].description = '';
      updatedLines[index].price = 0;
      updatedLines[index].total = 0;
    }

    setLineItems(updatedLines);
  };

  const handleQtyChange = (index, qty) => {
    const updatedLines = [...lineItems];
    updatedLines[index].qty = parseInt(qty) || 0;
    updatedLines[index].total = updatedLines[index].qty * updatedLines[index].price;
    setLineItems(updatedLines);
  };

  const addNewLine = () => {
    setLineItems([...lineItems, { id: Date.now(), partNumber: '', description: '', qty: 1, price: 0, total: 0 }]);
  };

  // --- ACTIONS ---
  const handleSaveInvoice = () => {
    if (!invoiceHeader.customer) {
      alert("Please enter a Customer Name/ID before saving.");
      return;
    }
    const invoiceRecord = {
      ...invoiceHeader,
      items: lineItems,
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleString(),
      type: 'INVOICE',
      createdBy: currentUser.name
    };
    const existing = JSON.parse(localStorage.getItem('erp_invoices_db') || '[]');
    const updated = [invoiceRecord, ...existing];
    localStorage.setItem('erp_invoices_db', JSON.stringify(updated));
    setSavedInvoices(updated);

    alert("Invoice Saved Successfully!");
    setSearchParams({ tab: 'sales', sub: 'invoice-history' });
  };

  const handleSave = () => {
    if (!formData.partNumber || !formData.itemName) {
      alert("Please enter at least a Part Number and Item Name.");
      return;
    }
    setSaveStatus('saving');
    let updatedDb;
    const nowTimestamp = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (editingId) {
      updatedDb = inventory.map(item =>
        item.id === editingId
          ? { ...item, ...formData, lastModifiedBy: currentUser.name, updatedAt: nowTimestamp }
          : item
      );
    } else {
      const newRecord = {
        ...formData,
        id: crypto.randomUUID(),
        registeredBy: currentUser.name,
        registeredById: currentUser.id,
        timestamp: nowTimestamp,
        createdAt: nowTimestamp
      };
      updatedDb = [newRecord, ...inventory];
    }

    localStorage.setItem('erp_parts_db', JSON.stringify(updatedDb));
    setInventory(updatedDb);

    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('idle');
        if (editingId) setSearchParams({ tab: activeTab, sub: 'inquiries' });
        setEditingId(null);
      }, 1500);
      setFormData({ partNumber: '', itemName: '', description: '', quantity: 0, actualPrice: '', sellingPrice: '' });
    }, 600);
  };

  const startEdit = (item) => {
    setFormData({
      partNumber: item.partNumber,
      itemName: item.itemName,
      description: item.description,
      quantity: item.quantity,
      actualPrice: item.actualPrice,
      sellingPrice: item.sellingPrice,
    });
    setEditingId(item.id);
    setSearchParams({ tab: activeTab, sub: 'add-parts' });
  };

  const deleteRecord = (id) => {
    if (!confirm("Are you sure you want to delete this part?")) return;
    const updatedDb = inventory.filter(item => item.id !== id);
    localStorage.setItem('erp_parts_db', JSON.stringify(updatedDb));
    setInventory(updatedDb);
  };

  // --- REUSABLE STYLES ---
  const blackInput = "w-full h-12 bg-slate-900 border-none rounded-xl px-4 text-lg font-bold text-white text-center outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600";
  const labelStyle = "text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1";

  // --- RENDER METHODS ---

  const renderInvoiceHistory = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="flex items-center justify-between mb-6 border-b-2 border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" /> Saved Invoices
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Transaction Archive</p>
        </div>
        <button
          onClick={() => setSearchParams({ tab: 'sales', sub: 'invoice-entry' })}
          className="bg-blue-600 text-white px-4 py-2 rounded text-[10px] font-black uppercase flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-200"
        >
          <PlusCircle size={14} /> New Invoice
        </button>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r border-slate-700">Date</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r border-slate-700">Customer</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r border-slate-700 text-center">Order #</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r border-slate-700 text-center">Rep</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-100">
            {savedInvoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest bg-slate-50/50">
                  <SearchX className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  No Invoices Found in Database
                </td>
              </tr>
            ) : (
              savedInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-black text-slate-900">{inv.orderDate}</div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase">{inv.timestamp}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-blue-600 uppercase tracking-tight">{inv.customer}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase italic">Code: {inv.priceCode}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-slate-600">
                    {inv.custOrderNo || '---'}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-900">
                    <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-black uppercase">
                      {inv.createdBy?.split(' ')[0] || 'System'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-blue-600 transition-all">
                      <Printer size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInvoiceEntryForm = () => {
    const subtotal = lineItems.reduce((acc, curr) => acc + curr.total, 0);

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left space-y-4 w-full">
        {/* HEADER SECTION - COMPACT */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-lg font-black text-slate-900 uppercase flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" /> Invoice Entry
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSearchParams({ tab: 'sales', sub: 'invoice-history' })}
              className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 hover:bg-slate-200 transition-colors"
            >
              <History className="w-3.5 h-3.5" /> History
            </button>
            <button
              onClick={handleSaveInvoice}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 shadow-md shadow-blue-200"
            >
              <Save className="w-3.5 h-3.5" /> Save Invoice
            </button>
          </div>
        </div>

        {/* COMPACT FORM GRID */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2 space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Customer / Doc No.</label>
            <div className="flex h-9">
              <div className="bg-slate-800 border-r border-slate-700 rounded-l-lg px-2 flex items-center">
                <ChevronDown size={14} className="text-white" />
              </div>
              <input
                className="w-full bg-slate-900 rounded-r-lg px-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-600"
                placeholder="SEARCH CUSTOMER..."
                value={invoiceHeader.customer}
                onChange={(e) => setInvoiceHeader({ ...invoiceHeader, customer: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Sales Rep</label>
            <input readOnly className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm font-bold text-slate-600" value={currentUser.name.split(' ')[0]} />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Order #</label>
            <input className="w-full h-9 bg-slate-900 rounded-lg px-3 text-sm font-bold text-white text-center outline-none focus:ring-2 focus:ring-blue-500" value={invoiceHeader.custOrderNo} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, custOrderNo: e.target.value })} />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Date</label>
            <input type="date" className="w-full h-9 bg-slate-900 rounded-lg px-2 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-500" value={invoiceHeader.orderDate} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, orderDate: e.target.value })} />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Price Code</label>
            <select className="w-full h-9 bg-slate-900 text-white rounded-lg px-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" value={invoiceHeader.priceCode} onChange={(e) => setInvoiceHeader({ ...invoiceHeader, priceCode: e.target.value })}>
              <option>Retail</option>
              <option>Trade</option>
            </select>
          </div>
        </div>

        {/* LINE ITEMS CONTROLS */}
        <div className="flex gap-2">
          <button onClick={addNewLine} className="flex items-center gap-1.5 px-3 py-1.5 border border-green-200 rounded-lg text-[9px] font-black uppercase bg-green-50 text-green-700 hover:bg-green-100 transition-all">
            <PlusCircle size={14} /> Add Line
          </button>
        </div>

        {/* COMPACT TABLE */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  {['Line', 'Product Code', 'Description', 'Qty', 'Supply', 'Unit', 'Price', 'Total'].map((col) => (
                    <th key={col} className="px-3 py-2.5 text-[9px] font-black uppercase text-center border-r border-slate-700">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lineItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 text-xs font-black text-slate-400 text-center bg-slate-50/50">{String(index + 1).padStart(2, '0')}</td>
                    <td className="px-2 py-1.5 border-r border-slate-100 w-40">
                      <input
                        className="w-full text-center font-bold text-sm text-white outline-none bg-slate-900 rounded-md h-8 px-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="ENTER CODE"
                        value={item.partNumber}
                        onChange={(e) => handlePartNumberChange(index, e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-1.5 border-r border-slate-100">
                      <input
                        className="w-full text-left font-medium text-sm text-slate-700 outline-none bg-slate-50 rounded-md h-8 px-3"
                        placeholder="Item description will auto-fill..."
                        value={item.description}
                        readOnly
                      />
                    </td>
                    <td className="px-2 py-1.5 border-r border-slate-100 w-20">
                      <input
                        type="number"
                        className="w-full text-center font-bold text-sm text-white bg-slate-900 rounded-md h-8 outline-none"
                        value={item.qty}
                        onChange={(e) => handleQtyChange(index, e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-center font-bold text-slate-900 text-sm">{item.qty}</td>
                    <td className="px-3 py-2 border-r border-slate-100 text-center font-bold text-slate-500 text-[10px]">EA</td>
                    <td className="px-3 py-2 border-r border-slate-100 text-center font-mono font-bold text-slate-900 text-sm">
                      ₱{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2 text-center font-black text-blue-600 text-sm">
                      ₱{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOTALS SUMMARY */}
        <div className="flex justify-end pt-2">
          <div className="bg-slate-900 text-white rounded-xl p-4 min-w-[250px] space-y-2 shadow-xl">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase"><span>Subtotal:</span> <span>₱{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase"><span>Tax (12%):</span> <span>₱{(subtotal * 0.12).toLocaleString()}</span></div>
            <div className="flex justify-between text-lg font-black border-t border-slate-700 pt-2 text-blue-400 uppercase tracking-tighter"><span>Grand Total:</span> <span>₱{(subtotal * 1.12).toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddPartsForm = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            {editingId ? 'Edit Product Details' : 'Product Registration'}
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            {editingId ? `Modifying Code: ${formData.partNumber}` : `Recording entries as ${currentUser.name}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === 'success' && <div className="text-green-500 text-[10px] font-black flex items-center gap-1 animate-bounce"><CheckCircle2 size={12} /> {editingId ? 'UPDATED' : 'REGISTERED'}</div>}
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ partNumber: '', itemName: '', description: '', quantity: 0, actualPrice: '', sellingPrice: '' });
            }}
            className="px-3 py-1.5 border rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all text-slate-500 flex items-center gap-2"
          >
            {editingId ? <><X size={12} /> Cancel Edit</> : 'Reset Form'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Hash className="w-3 h-3 text-blue-600" /> Product Code
                </label>
                <input
                  type="text"
                  value={formData.partNumber}
                  onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                  className="w-full h-9 bg-slate-900 text-white rounded-lg px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. PC-10023"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Tag className="w-3 h-3 text-blue-600" /> Item Name
                </label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full h-9 bg-slate-900 text-white rounded-lg px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Engine Component"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-500">Detailed Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 text-sm font-medium text-left outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Specifications..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Layers size={12} /> Quantity</label>
                <input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} className="w-full h-9 bg-slate-900 text-white rounded-lg px-3 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><DollarSign size={12} /> Cost</label>
                <input type="number" value={formData.actualPrice} onChange={(e) => setFormData({ ...formData, actualPrice: e.target.value })} className="w-full h-9 bg-slate-900 text-white rounded-lg px-3 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><DollarSign size={12} /> Selling</label>
                <input type="number" value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })} className="w-full h-9 bg-slate-900 text-white rounded-lg px-3 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <button onClick={handleSave} disabled={saveStatus === 'saving'} className={`w-full py-3 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'}`}>
              <Save size={14} /> {saveStatus === 'saving' ? 'Processing...' : editingId ? 'Update Product Record' : 'Submit Product Registration'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-full flex flex-col shadow-xl">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2 mb-3"><ClipboardList size={12} /> Recent Entries</h3>
            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-2 scrollbar-hide">
              {filteredInventory.slice(0, 8).map((item) => (
                <div key={item.id} className={`bg-slate-800 border rounded-lg p-2.5 border-l-4 transition-all ${item.lastModifiedBy ? 'border-l-amber-500 border-slate-700' : 'border-l-blue-500 border-slate-700'}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-blue-400">{item.partNumber}</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase truncate text-white">{item.itemName}</p>
                  <div className="mt-2 pt-2 border-t border-slate-700 border-dashed space-y-1">
                    <div className="flex items-center gap-2 text-[7px] font-bold text-slate-400 uppercase">
                      <PlusCircle size={8} className="text-blue-500" /> Reg By: {item.registeredBy} <span className="opacity-50">{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setSearchParams({ tab: activeTab, sub: 'inquiries' })} className="mt-auto pt-3 flex items-center justify-center gap-2 text-[9px] font-black uppercase text-blue-400 hover:underline">View Product Inquiry <ChevronRight size={12} /></button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInquiryTable = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSearchParams({ tab: activeTab, sub: 'add-parts' })} className="p-1.5 hover:bg-slate-100 rounded-lg group transition-all">
            <ArrowLeft size={18} className="text-slate-500 group-hover:text-blue-600" />
          </button>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Product Master List</h2>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest border-r border-slate-700">Code & Description</th>
              <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-center border-r border-slate-700 w-24">Stock</th>
              <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest border-r border-slate-700">Audit Trail</th>
              <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 border-r text-slate-900">
                  <p className="font-black text-blue-600 text-sm tracking-tight">{item.partNumber}</p>
                  <p className="text-[10px] font-bold text-slate-800 uppercase leading-none">{item.itemName}</p>
                  {item.description && (
                    <p className="text-[10px] text-slate-400 italic mt-1.5 line-clamp-1 border-t border-slate-50 pt-1">{item.description}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-center font-black border-r text-sm text-slate-900">{item.quantity}</td>
                <td className="px-4 py-3 border-r">
                  <div className="space-y-1 text-[8px] font-bold uppercase">
                    <div className="text-slate-500 flex items-center gap-1"><PlusCircle size={10} className="text-blue-500" /> Reg: {item.registeredBy}</div>
                    {item.lastModifiedBy && <div className="text-amber-600 flex items-center gap-1"><Pencil size={10} /> Edit: {item.lastModifiedBy}</div>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => startEdit(item)} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-all"><Pencil size={14} /></button>
                    <button onClick={() => deleteRecord(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden text-left">
      <Sidebar activeModule="parts" onModuleChange={() => { }} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen max-w-[calc(100vw-256px)] overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-8 flex-1">
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl shadow-sm">
              <MapPin size={18} className="text-blue-600" />
              <div>
                <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest leading-none mb-1">{currentUser.branch || "Main Branch"}</p>
                <p className="text-[8px] font-bold text-blue-400 uppercase tracking-tighter">Terminal Active</p>
              </div>
            </div>
            <div className="relative w-full max-w-lg group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 group-focus-within:text-white transition-colors z-10" />

              <input
                type="text"
                placeholder="Search inventory, invoices, or customers..."
                className="w-full h-12 bg-slate-900 border-none rounded-2xl py-2 pl-12 pr-6 text-sm font-bold text-white outline-none focus:ring-4 focus:ring-blue-500/30 transition-all placeholder:text-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <button className="relative p-3 text-slate-400 hover:bg-slate-50 hover:text-blue-600 rounded-2xl transition-all group">
                <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all">
                <Settings size={22} />
              </button>
            </div>
            <div className="h-10 w-[2px] bg-slate-100 mx-1"></div>
            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden xl:block">
                <p className="text-[11px] font-black text-slate-900 uppercase leading-none mb-1">{currentUser.name}</p>
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest italic">{currentUser.role}</p>
              </div>
              <div className="relative group cursor-pointer">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:bg-blue-600 transition-all hover:scale-105 active:scale-95">
                  <UserCog size={22} />
                </div>
                <select
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  value={availableUsers.findIndex(u => u.id === currentUser.id)}
                  onChange={(e) => setCurrentUser(availableUsers[parseInt(e.target.value)])}
                >
                  {availableUsers.map((u, i) => <option key={u.id} value={i}>{u.name} ({u.role})</option>)}
                </select>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 pt-6 overflow-y-auto">
          <section className="w-full pb-20">
            {activeSub === 'add-parts' && renderAddPartsForm()}
            {activeSub === 'invoice-entry' && renderInvoiceEntryForm()}
            {activeSub === 'inquiries' && renderInquiryTable()}
            {activeSub === 'invoice-history' && renderInvoiceHistory()}
          </section>
        </main>
      </div>
    </div>
  );
};

export default PartsDistribution;