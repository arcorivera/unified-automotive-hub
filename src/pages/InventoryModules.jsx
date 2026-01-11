import React from 'react';
import {
    CheckCircle2, X, Hash, Tag, Layers, DollarSign, Save, ClipboardList,
    ChevronRight, ArrowLeft, Pencil, Trash2, PlusCircle
} from 'lucide-react';

export const RenderAddPartsForm = ({
    editingId, formData, setFormData, currentUser, saveStatus,
    setEditingId, handleSave, filteredInventory, setSearchParams, activeTab
}) => (
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

export const RenderInquiryTable = ({
    filteredInventory, activeTab, setSearchParams, startEdit, deleteRecord
}) => (
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