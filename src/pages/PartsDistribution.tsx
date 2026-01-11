import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import InvoiceEntry from '@/components/parts/InvoiceEntry';
import AddPartsForm from '@/components/parts/AddPartsForm';
import CustomerRegistration from '@/components/parts/CustomerRegistration';
import {
  Search, MapPin, UserCog, Receipt, ArrowLeft, Pencil, Trash2, CheckCircle2, ShieldCheck
} from 'lucide-react';

const PartsDistribution = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'sales';
  const activeSub = searchParams.get('sub') || 'Dashboard';
  const [searchTerm, setSearchTerm] = useState('');

  const [savedInvoices, setSavedInvoices] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [editingId, setEditingId] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);

  const availableUsers = [
    { name: "John Doe", id: "EMP-0882", role: "Administrator", branch: "Main Branch", color: "bg-blue-600" },
    { name: "Jane Smith", id: "EMP-0912", role: "Sales Manager", branch: "North Outlet", color: "bg-purple-600" },
    { name: "Mike Ross", id: "EMP-0745", role: "Inventory Clerk", branch: "Main Branch", color: "bg-emerald-600" }
  ];

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('erp_active_user');
    return savedUser ? JSON.parse(savedUser) : availableUsers[0];
  });

  const handleUserSwitch = (user) => {
    setCurrentUser(user);
    localStorage.setItem('erp_active_user', JSON.stringify(user));
  };

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

  const startEdit = (item) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setSearchParams({ tab: activeTab, sub: 'add-parts' });
  };

  const deleteRecord = (id) => {
    if (!confirm("Delete record?")) return;
    const updated = inventory.filter(i => i.id !== id);
    localStorage.setItem('erp_parts_db', JSON.stringify(updated));
    setInventory(updated);
  };

  const handleEditInvoice = (e, inv) => {
    e.stopPropagation();
    if (!confirm("Load this invoice into Entry mode for editing?")) return;
    setInvoiceToEdit(inv);
    setSearchParams({ tab: activeTab, sub: 'invoice-entry' });
  };

  const deleteInvoice = (e, id) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this invoice from history?")) return;
    const updated = savedInvoices.filter(inv => inv.id !== id);
    localStorage.setItem('erp_invoices_db', JSON.stringify(updated));
    setSavedInvoices(updated);
  };

  const [formData, setFormData] = useState({
    partNumber: '', itemName: '', description: '', quantity: 0, actualPrice: '', sellingPrice: '',
  });

  const rowBorder = "border-t border-b border-slate-300";

  const renderInquiryTable = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-left">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => setSearchParams({ tab: activeTab, sub: 'add-parts' })} className="p-1 hover:bg-slate-100 rounded transition-all text-slate-500">
          <ArrowLeft size={14} />
        </button>
        <h2 className="text-sm font-black text-slate-900 uppercase">Master List Enquiry</h2>
      </div>
      <div className="bg-white border-x border-t-2 border-b-2 border-slate-900 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-2 py-1.5 text-[7px] font-black uppercase border-r border-slate-700">Product Info</th>
              <th className="px-2 py-1.5 text-[7px] font-black uppercase border-r border-slate-700">Description</th>
              <th className="px-2 py-1.5 text-[7px] font-black uppercase border-r border-slate-700">Registered By</th>
              <th className="px-2 py-1.5 text-[7px] font-black uppercase border-r border-slate-700">Edited By</th>
              <th className="px-2 py-1.5 text-[7px] font-black uppercase text-center border-r border-slate-700 w-16">Stock</th>
              <th className="px-2 py-1.5 text-[7px] font-black uppercase text-right w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className={`px-2 py-1 border-r border-slate-200 ${rowBorder}`}>
                  <p className="font-black text-blue-700 text-[10px]">{item.partNumber}</p>
                  <p className="text-[8px] font-bold text-slate-900 uppercase">{item.itemName}</p>
                </td>
                <td className={`px-2 py-1 border-r border-slate-200 text-[8px] text-slate-900 font-medium max-w-xs ${rowBorder}`}>{item.description || '---'}</td>
                <td className={`px-2 py-1 border-r border-slate-200 ${rowBorder}`}>
                  <div className="text-[7px] font-bold text-slate-900 uppercase">{item.registeredBy}</div>
                  <div className="text-[7px] text-slate-600">{item.timestamp}</div>
                </td>
                <td className={`px-2 py-1 border-r border-slate-200 ${rowBorder}`}>
                  {item.lastModifiedBy ? (
                    <>
                      <div className="text-[7px] font-bold text-amber-700 uppercase">{item.lastModifiedBy}</div>
                      <div className="text-[7px] text-slate-600">{item.updatedAt}</div>
                    </>
                  ) : <span className="text-[7px] text-slate-400 font-bold uppercase">No Edits</span>}
                </td>
                <td className={`px-2 py-1 text-center font-black border-r border-slate-200 text-[10px] text-slate-900 ${rowBorder}`}>{item.quantity}</td>
                <td className={`px-2 py-1 text-right ${rowBorder}`}>
                  <div className="flex justify-end gap-1">
                    <button onClick={() => startEdit(item)} className="p-0.5 text-slate-600 hover:text-amber-600"><Pencil size={10} /></button>
                    <button onClick={() => deleteRecord(item.id)} className="p-0.5 text-slate-600 hover:text-red-600"><Trash2 size={10} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInvoiceHistory = () => {
    if (viewingInvoice) {
      const subtotal = viewingInvoice.items.reduce((acc, curr) => acc + curr.total, 0);
      const tax = subtotal * 0.12;
      const finalTotal = subtotal + tax;

      // Eto yung inayos ko: Random Alphanumeric (Letters + Numbers)
      const randomAlphanumeric = viewingInvoice.id
        ? viewingInvoice.id.split('-').pop().substring(0, 8).toUpperCase()
        : Math.random().toString(36).substring(2, 10).toUpperCase();

      return (
        <div className="animate-in fade-in slide-in-from-right-2 duration-500 text-left space-y-2 w-full">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h2 className="text-sm font-black text-slate-900 uppercase flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-blue-700" /> Invoice Record: {randomAlphanumeric}
            </h2>
            <button onClick={() => setViewingInvoice(null)} className="bg-slate-900 text-white px-2 py-1 rounded text-[7px] font-black uppercase flex items-center gap-1 shadow-sm">
              <ArrowLeft className="w-2.5 h-2.5" /> Back to History
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg flex justify-between items-center">
              <div className="text-[7px] font-black text-blue-900 uppercase">Created By:</div>
              <div className="text-[9px] font-bold text-blue-700">{viewingInvoice.createdBy} on {viewingInvoice.timestamp}</div>
            </div>
            {viewingInvoice.lastModifiedBy && (
              <div className="bg-amber-50 border border-amber-200 p-2 rounded-lg flex justify-between items-center">
                <div className="text-[7px] font-black text-amber-900 uppercase">Last Edit:</div>
                <div className="text-[9px] font-bold text-amber-700">{viewingInvoice.lastModifiedBy} on {viewingInvoice.updatedAt}</div>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="space-y-0.5">
              <label className="text-[7px] font-black text-slate-600 uppercase">Code / Doc No.</label>
              <div className="h-7 bg-blue-50 border border-blue-200 rounded flex items-center px-2 text-[10px] font-black text-blue-700">
                {viewingInvoice.customerCode}
              </div>
            </div>

            <div className="space-y-0.5 md:col-span-2">
              <label className="text-[7px] font-black text-slate-600 uppercase">Customer Name</label>
              <div className="h-7 bg-slate-50 border rounded flex items-center px-2 text-[10px] font-black text-slate-900 uppercase">
                {viewingInvoice.customer}
              </div>
            </div>

            <div className="space-y-0.5"><label className="text-[7px] font-black text-slate-600 uppercase">Sales Person</label><div className="h-7 bg-slate-50 border rounded flex items-center px-2 text-[10px] font-bold text-slate-900">{viewingInvoice.salesPerson}</div></div>
            <div className="space-y-0.5"><label className="text-[7px] font-black text-slate-600 uppercase">Cust Order #</label><div className="h-7 bg-slate-50 border rounded flex items-center px-2 text-[10px] font-bold text-slate-900">{viewingInvoice.custOrderNo || '---'}</div></div>
            <div className="space-y-0.5"><label className="text-[7px] font-black text-slate-600 uppercase">Order Date</label><div className="h-7 bg-slate-50 border rounded flex items-center px-2 text-[10px] font-bold text-slate-900">{viewingInvoice.orderDate}</div></div>

            <div className="space-y-0.5"><label className="text-[7px] font-black text-slate-600 uppercase">Price Code</label><div className="h-7 bg-slate-50 border rounded flex items-center px-2 text-[10px] font-bold text-blue-700 uppercase">{viewingInvoice.priceCode}</div></div>
            <div className="space-y-0.5 md:col-span-3"><label className="text-[7px] font-black text-slate-600 uppercase">Business Address</label><div className="h-7 bg-slate-50 border rounded flex items-center px-2 text-[10px] font-bold text-slate-900">{viewingInvoice.businessAddress || '---'}</div></div>
            <div className="space-y-0.5 md:col-span-2"><label className="text-[7px] font-black text-slate-600 uppercase">Contact #</label><div className="h-7 bg-slate-50 border rounded flex items-center px-2 text-[10px] font-bold text-slate-900">{viewingInvoice.contactNumber || '---'}</div></div>

            <div className="space-y-0.5"><label className="text-[7px] font-black text-slate-600 uppercase">Sales Rep</label><div className="h-7 bg-slate-50 border rounded flex items-center px-2 text-[10px] font-bold text-slate-900">{viewingInvoice.salesRep || '---'}</div></div>
            <div className="space-y-0.5"><label className="text-[7px] font-black text-slate-600 uppercase">ABN</label><div className="h-7 bg-slate-50 border rounded flex items-center px-2 text-[10px] font-bold text-slate-900">{viewingInvoice.abn}</div></div>
            <div className="space-y-0.5"><label className="text-[7px] font-black text-slate-600 uppercase">Terms</label><div className="h-7 bg-slate-50 border rounded flex items-center px-2 text-[10px] font-bold text-slate-900">{viewingInvoice.terms}</div></div>
            <div className="space-y-0.5 md:col-span-3"><label className="text-[7px] font-black text-slate-600 uppercase">Avail. Credit</label><div className="h-7 bg-green-50 border border-green-200 rounded flex items-center px-2 text-[10px] font-black text-green-800">₱{viewingInvoice.availCredit}</div></div>
          </div>

          <div className="bg-white border-x border-t-2 border-b-2 border-slate-900 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0 min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    {['#', 'Product', 'Description', 'Order', 'BC', 'Price', 'Total', 'MC', 'SC', 'SBR', 'PC'].map((col) => (
                      <th key={col} className="px-1.5 py-1 text-[7px] font-black uppercase text-center border-r border-slate-700">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {viewingInvoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className={`px-1 py-1 text-[9px] font-black text-slate-500 text-center ${rowBorder}`}>{index + 1}</td>
                      <td className={`px-1 py-0.5 border-r border-slate-200 font-bold text-[10px] text-blue-700 text-center ${rowBorder}`}>{item.itemName}</td>
                      <td className={`px-1 py-0.5 border-r border-slate-200 text-[10px] text-slate-900 font-medium ${rowBorder}`}>{item.description || '---'}</td>
                      <td className={`px-1 py-0.5 border-r border-slate-200 text-center font-bold text-[10px] text-slate-900 ${rowBorder}`}>{item.order}</td>
                      <td className={`px-1 py-0.5 border-r border-slate-200 text-center text-[9px] text-slate-900 ${rowBorder}`}>{item.bc}</td>
                      <td className={`px-1 py-0.5 border-r border-slate-200 text-center font-mono font-bold text-[9px] text-slate-900 ${rowBorder}`}>₱{item.price.toLocaleString()}</td>
                      <td className={`px-1 py-0.5 border-r border-slate-200 text-center font-black text-blue-700 text-[9px] ${rowBorder}`}>₱{item.total.toLocaleString()}</td>
                      <td className={`px-1 py-0.5 border-r border-slate-200 text-center text-[9px] text-slate-900 ${rowBorder}`}>{item.mc}</td>
                      <td className={`px-1 py-0.5 border-r border-slate-200 text-center text-[9px] text-slate-900 ${rowBorder}`}>{item.sc}</td>
                      <td className={`px-1 py-0.5 border-r border-slate-200 text-center text-[9px] text-slate-900 ${rowBorder}`}>{item.sbr}</td>
                      <td className={`px-1 py-0.5 text-center text-[9px] text-slate-900 font-bold ${rowBorder}`}>{item.pc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-slate-50 flex justify-end border-t border-slate-200">
              <div className="w-64 space-y-1">
                <div className="flex justify-between text-[11px] font-black text-blue-700 uppercase border-t border-slate-200 pt-1"><span>Grand Total:</span><span>₱{finalTotal.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border-x border-t-2 border-b-2 border-slate-900 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0 min-w-[2200px]">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 w-32">Code / Doc No.</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 w-48">Customer Name</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 w-64">Address & Contact</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 text-center w-28">Cust Order#</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 text-center w-16">Order</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 w-40">Product Name</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 w-56">Product Description</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 text-right w-24">Price</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 text-center w-28">Date#</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 text-center w-24">Price Code</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 w-32">Sales Person</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 w-32">Sales Rep</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 w-40">Created By</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase border-r border-slate-700 w-40">Modified By</th>
                <th className="px-2 py-2 text-[8px] font-black uppercase text-center w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {savedInvoices.map((inv) => (
                inv.items?.map((item, idx) => (
                  <tr key={`${inv.id}-${idx}`} onClick={() => setViewingInvoice(inv)} className="hover:bg-blue-50 transition-colors cursor-pointer group">
                    <td className={`px-2 py-1.5 text-[10px] font-black text-blue-700 border-r border-slate-200 ${rowBorder}`}>
                      {inv.customerCode}
                    </td>
                    <td className={`px-2 py-1.5 text-[10px] font-black text-slate-900 uppercase border-r border-slate-200 ${rowBorder}`}>{inv.customer}</td>
                    <td className={`px-2 py-1.5 border-r border-slate-200 ${rowBorder}`}>
                      <div className="text-[8px] font-bold text-slate-900 truncate uppercase">{inv.businessAddress || 'NO ADDRESS'}</div>
                      <div className="text-[8px] font-black text-slate-500">{inv.contactNumber || 'NO CONTACT'}</div>
                    </td>
                    <td className={`px-2 py-1.5 text-[10px] font-bold text-center border-r border-slate-200 text-slate-900 ${rowBorder}`}>{inv.custOrderNo || '---'}</td>
                    <td className={`px-2 py-1.5 text-[10px] font-black text-center border-r border-slate-200 text-slate-900 ${rowBorder}`}>{item.order}</td>
                    <td className={`px-2 py-1.5 text-[10px] font-bold text-slate-900 border-r border-slate-200 uppercase ${rowBorder}`}>{item.itemName}</td>
                    <td className={`px-2 py-1.5 text-[9px] text-slate-900 border-r border-slate-200 truncate max-w-[200px] font-medium ${rowBorder}`}>{item.description || '---'}</td>
                    <td className={`px-2 py-1.5 text-[10px] font-mono font-black text-right border-r border-slate-200 text-slate-900 ${rowBorder}`}>₱{item.price?.toLocaleString()}</td>
                    <td className={`px-2 py-1.5 text-[10px] font-bold text-center border-r border-slate-200 text-slate-900 ${rowBorder}`}>{inv.orderDate}</td>
                    <td className={`px-2 py-1.5 text-[10px] font-black text-blue-700 text-center border-r border-slate-200 ${rowBorder}`}>{inv.priceCode}</td>
                    <td className={`px-2 py-1.5 text-[10px] font-bold border-r border-slate-200 text-slate-900 uppercase ${rowBorder}`}>{inv.salesPerson || '---'}</td>
                    <td className={`px-2 py-1.5 text-[10px] font-bold border-r border-slate-200 text-slate-900 uppercase ${rowBorder}`}>{inv.salesRep || '---'}</td>
                    <td className={`px-2 py-1.5 border-r border-slate-200 ${rowBorder}`}>
                      <div className="text-[8px] font-black text-slate-900 uppercase leading-none mb-0.5">{inv.createdBy}</div>
                      <div className="text-[7px] text-slate-500 font-bold">{inv.timestamp}</div>
                    </td>
                    <td className={`px-2 py-1.5 border-r border-slate-200 ${rowBorder}`}>
                      {inv.lastModifiedBy ? (
                        <>
                          <div className="text-[8px] font-black text-amber-700 uppercase leading-none mb-0.5">{inv.lastModifiedBy}</div>
                          <div className="text-[7px] text-slate-500 font-bold">{inv.updatedAt}</div>
                        </>
                      ) : <div className="text-[7px] font-bold text-slate-300 uppercase">Original</div>}
                    </td>
                    <td className={`px-2 py-1.5 text-center ${rowBorder}`} onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={(e) => handleEditInvoice(e, inv)} className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200 hover:bg-amber-100"><Pencil size={10} /></button>
                        <button onClick={(e) => deleteInvoice(e, inv.id)} className="text-[8px] font-black uppercase text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200 hover:bg-red-100"><Trash2 size={10} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden text-left">
      <Sidebar activeModule="parts" onModuleChange={() => { }} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen max-w-[calc(100vw-256px)] overflow-hidden">
        <header className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg">
              <MapPin size={12} className="text-blue-700" />
              <p className="text-[8px] font-black text-blue-900 uppercase">{currentUser.branch}</p>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-500" />
              <input type="text" placeholder="Search Masterlist..." className="w-full h-8 bg-slate-900 rounded-lg py-1 pl-8 pr-4 text-[10px] font-bold text-white outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-black text-slate-900 leading-none uppercase">{currentUser.name}</p>
              <p className="text-[7px] font-bold text-blue-600 uppercase">{currentUser.role}</p>
            </div>
            <div className="group relative">
              <button className={`w-8 h-8 ${currentUser.color} rounded-lg flex items-center justify-center text-white shadow-md transition-transform hover:scale-105`}>
                <UserCog size={16} />
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] p-2 text-left">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Switch Account</p>
                </div>
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSwitch(user)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors mb-1 ${currentUser.id === user.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`w-7 h-7 ${user.color} rounded-md flex items-center justify-center text-white text-[10px] font-black`}>
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-[10px] font-black text-slate-900 uppercase leading-tight">{user.name}</p>
                      <p className="text-[8px] font-bold text-slate-500">{user.role}</p>
                    </div>
                    {currentUser.id === user.id && <CheckCircle2 size={12} className="text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 pt-3 overflow-y-auto">
          {activeSub === 'add-parts' && (
            <AddPartsForm
              inventory={inventory} setInventory={setInventory}
              currentUser={currentUser} editingId={editingId} setEditingId={setEditingId}
              formData={formData} setFormData={setFormData}
              saveStatus={saveStatus} setSaveStatus={setSaveStatus}
            />
          )}
          {activeSub === 'customer-reg' && (
            <CustomerRegistration currentUser={currentUser} />
          )}
          {activeSub === 'invoice-entry' && (
            <InvoiceEntry
              inventory={inventory}
              setInventory={setInventory}
              savedInvoices={savedInvoices}
              setSavedInvoices={setSavedInvoices}
              currentUser={currentUser}
              invoiceToEdit={invoiceToEdit}
              setInvoiceToEdit={setInvoiceToEdit}
            />
          )}
          {activeSub === 'inquiries' && renderInquiryTable()}
          {activeSub === 'invoice-history' && renderInvoiceHistory()}
        </main>
      </div>
    </div>
  );
};

export default PartsDistribution;