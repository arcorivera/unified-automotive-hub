import React, { useState, useEffect } from 'react';
import { Save, Pencil, Users, Trash2 } from 'lucide-react';

interface User {
    name: string;
    role: string;
    branch: string;
    color: string;
}

interface Customer {
    id: string;
    customerCode: string;
    customerName: string;
    address: string;
    contactNumber: string;
    abn: string;
    terms: string;
    priceCode: string;
    creditLimit: number;
    registeredBy: string;
    timestamp: string;
}

interface CustomerRegistrationProps {
    currentUser: User;
}

const CustomerRegistration: React.FC<CustomerRegistrationProps> = ({ currentUser }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        customerCode: '',
        customerName: '',
        address: '',
        contactNumber: '',
        abn: '',
        terms: 'COD',
        priceCode: 'RETAIL',
        creditLimit: 0
    });

    useEffect(() => {
        const saved = localStorage.getItem('erp_customers_db');
        if (saved) setCustomers(JSON.parse(saved));
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        let updated: Customer[];
        const timestamp = new Date().toLocaleString();

        if (editingId) {
            updated = customers.map(c => c.id === editingId ?
                { ...c, ...formData, timestamp, registeredBy: currentUser.name } : c
            );
        } else {
            const newCustomer: Customer = {
                ...formData,
                id: `CUST-${Date.now()}`,
                registeredBy: currentUser.name,
                timestamp: timestamp
            };
            updated = [...customers, newCustomer];
        }

        localStorage.setItem('erp_customers_db', JSON.stringify(updated));
        setCustomers(updated);
        setFormData({ customerCode: '', customerName: '', address: '', contactNumber: '', abn: '', terms: 'COD', priceCode: 'RETAIL', creditLimit: 0 });
        setEditingId(null);
    };

    const deleteCustomer = (id: string) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            const updated = customers.filter(c => c.id !== id);
            localStorage.setItem('erp_customers_db', JSON.stringify(updated));
            setCustomers(updated);
            if (editingId === id) {
                setEditingId(null);
                setFormData({ customerCode: '', customerName: '', address: '', contactNumber: '', abn: '', terms: 'COD', priceCode: 'RETAIL', creditLimit: 0 });
            }
        }
    };

    const startEdit = (cust: Customer) => {
        setFormData({ ...cust });
        setEditingId(cust.id);
    };

    const inputStyle = "w-full h-8 px-2 bg-slate-900 border border-slate-700 rounded text-[10px] font-bold uppercase text-white placeholder:text-slate-500 outline-blue-500 transition-colors focus:bg-black";

    return (
        <div className="space-y-4 animate-in fade-in duration-500 text-left">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <Users className="text-blue-700" size={18} />
                <h2 className="text-sm font-black text-slate-900 uppercase">Customer Master File</h2>
            </div>

            <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm grid grid-cols-1 md:grid-cols-7 gap-3">
                <div className="md:col-span-1">
                    <label className="text-[7px] font-black text-slate-900 uppercase">Code</label>
                    <input required className={inputStyle} value={formData.customerCode} onChange={e => setFormData({ ...formData, customerCode: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                    <label className="text-[7px] font-black text-slate-900 uppercase">Name / Company</label>
                    <input required className={inputStyle} value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} />
                </div>
                <div>
                    <label className="text-[7px] font-black text-slate-900 uppercase">Contact #</label>
                    <input className={inputStyle} value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} />
                </div>
                <div>
                    <label className="text-[7px] font-black text-slate-900 uppercase">ABN</label>
                    <input className={inputStyle} value={formData.abn} onChange={e => setFormData({ ...formData, abn: e.target.value })} />
                </div>
                <div>
                    <label className="text-[7px] font-black text-slate-900 uppercase">Terms</label>
                    <select className={inputStyle} value={formData.terms} onChange={e => setFormData({ ...formData, terms: e.target.value })}>
                        <option>COD</option><option>7 Days</option><option>15 Days</option><option>30 Days</option>
                    </select>
                </div>
                <div>
                    <label className="text-[7px] font-black text-slate-900 uppercase">Price Code</label>
                    <select className={inputStyle} value={formData.priceCode} onChange={e => setFormData({ ...formData, priceCode: e.target.value })}>
                        <option value="RETAIL">RETAIL</option>
                        <option value="WHOLESALE">WHOLESALE</option>
                        <option value="TRADE">TRADE</option>
                    </select>
                </div>
                <div className="md:col-span-4">
                    <label className="text-[7px] font-black text-slate-900 uppercase">Business Address</label>
                    <input className={inputStyle} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div className="md:col-span-1">
                    <label className="text-[7px] font-black text-slate-900 uppercase">Credit Limit</label>
                    <input type="number" className={inputStyle} value={formData.creditLimit} onChange={e => setFormData({ ...formData, creditLimit: Number(e.target.value) })} />
                </div>
                <div className="md:col-span-2 flex items-end">
                    <button type="submit" className="w-full h-8 bg-blue-700 text-white rounded text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-md">
                        <Save size={14} /> {editingId ? 'Update Record' : 'Save Registration'}
                    </button>
                </div>
            </form>

            <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900 text-white text-[7px] font-black uppercase">
                        <tr>
                            <th className="px-2 py-2 border-r border-slate-700">Code</th>
                            <th className="px-2 py-2 border-r border-slate-700">Name</th>
                            <th className="px-2 py-2 border-r border-slate-700">Contact</th>
                            <th className="px-2 py-2 border-r border-slate-700">Price</th>
                            <th className="px-2 py-2 border-r border-slate-700">Limit</th>
                            <th className="px-2 py-2 border-r border-slate-700">Terms</th>
                            <th className="px-2 py-2 border-r border-slate-700">ABN</th>
                            <th className="px-2 py-2 border-r border-slate-700">Address</th>
                            <th className="px-2 py-2 text-center w-16">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-black">
                        {customers.map(cust => (
                            <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-2 py-2 border-r border-slate-100 text-[10px] font-black text-blue-700">{cust.customerCode}</td>
                                <td className="px-2 py-2 border-r border-slate-100 text-[10px] font-black uppercase">{cust.customerName}</td>
                                <td className="px-2 py-2 border-r border-slate-100 text-[9px] font-bold">{cust.contactNumber || '---'}</td>
                                <td className="px-2 py-2 border-r border-slate-100 text-[9px] font-bold">{cust.priceCode}</td>
                                <td className="px-2 py-2 border-r border-slate-100 text-[9px] font-bold">₱{cust.creditLimit.toLocaleString()}</td>
                                <td className="px-2 py-2 border-r border-slate-100 text-[9px] font-bold">{cust.terms}</td>
                                <td className="px-2 py-2 border-r border-slate-100 text-[9px] font-medium">{cust.abn || '---'}</td>
                                <td className="px-2 py-2 border-r border-slate-100 text-[9px] font-medium italic truncate max-w-[100px]">{cust.address}</td>
                                <td className="px-2 py-2 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <button onClick={() => startEdit(cust)} className="p-1 text-slate-400 hover:text-amber-600 rounded transition-all">
                                            <Pencil size={12} />
                                        </button>
                                        <button onClick={() => deleteCustomer(cust.id)} className="p-1 text-slate-400 hover:text-red-600 rounded transition-all">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerRegistration;