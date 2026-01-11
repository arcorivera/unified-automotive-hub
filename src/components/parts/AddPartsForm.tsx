import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    CheckCircle2, Hash, Tag, Save, History, PlusCircle, Pencil, ChevronRight
} from 'lucide-react';

const AddPartsForm = ({
    inventory,
    setInventory,
    currentUser,
    editingId,
    setEditingId,
    formData,
    setFormData,
    saveStatus,
    setSaveStatus
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'sales';

    const handleSave = () => {
        if (!formData.partNumber || !formData.itemName) { alert("Fill required fields"); return; }
        setSaveStatus('saving');
        const nowTimestamp = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        let updatedDb;

        if (editingId) {
            updatedDb = inventory.map(item =>
                item.id === editingId
                    ? {
                        ...item,
                        ...formData,
                        lastModifiedBy: currentUser.name,
                        updatedAt: nowTimestamp
                    }
                    : item
            );
        } else {
            updatedDb = [
                {
                    ...formData,
                    id: crypto.randomUUID(),
                    registeredBy: currentUser.name,
                    timestamp: nowTimestamp,
                    createdAt: nowTimestamp
                },
                ...inventory
            ];
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

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-left">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase">Product Registration</h2>
                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Operator: {currentUser.name}</p>
                </div>
                <div className="flex items-center gap-2">
                    {saveStatus === 'success' && <div className="text-green-500 text-[8px] font-black flex items-center gap-1 animate-bounce"><CheckCircle2 size={10} /> SAVED</div>}
                    <button onClick={() => { setEditingId(null); setFormData({ partNumber: '', itemName: '', description: '', quantity: 0, actualPrice: '', sellingPrice: '' }); }} className="px-2 py-1 border rounded text-[7px] font-black uppercase text-slate-500 hover:bg-slate-50">Reset</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                <div className="lg:col-span-8 space-y-2">
                    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="space-y-0.5">
                                <label className="text-[7px] font-black uppercase text-slate-500 flex items-center gap-1"><Hash size={10} className="text-blue-600" /> Part Number/Code</label>
                                <input type="text" value={formData.partNumber} onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })} className="w-full h-7 bg-slate-900 text-white rounded px-2 text-[10px] font-bold outline-none focus:ring-1 focus:ring-blue-500" placeholder="CODE" />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[7px] font-black uppercase text-slate-500 flex items-center gap-1"><Tag size={10} className="text-blue-600" /> Item Name</label>
                                <input type="text" value={formData.itemName} onChange={(e) => setFormData({ ...formData, itemName: e.target.value })} className="w-full h-7 bg-slate-900 text-white rounded px-2 text-[10px] font-bold outline-none focus:ring-1 focus:ring-blue-500" placeholder="NAME" />
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-[7px] font-black uppercase text-slate-500">Detailed Description</label>
                            <textarea rows={1} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-900 text-white rounded px-2 py-1 text-[10px] font-medium outline-none resize-none focus:ring-1 focus:ring-blue-500" placeholder="Specifications..."></textarea>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-0.5">
                                <label className="text-[7px] font-black uppercase text-slate-500">Stock Qty</label>
                                <input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} className="w-full h-7 bg-slate-900 text-white rounded text-center text-[10px] font-bold outline-none" />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[7px] font-black uppercase text-slate-500">Cost Price (₱)</label>
                                <input type="number" value={formData.actualPrice} onChange={(e) => setFormData({ ...formData, actualPrice: e.target.value })} className="w-full h-7 bg-slate-900 text-white rounded text-center text-[10px] font-bold outline-none" />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[7px] font-black uppercase text-slate-500">Selling Price (₱)</label>
                                <input type="number" value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })} className="w-full h-7 bg-slate-900 text-white rounded text-center text-[10px] font-bold outline-none" />
                            </div>
                        </div>
                        <button onClick={handleSave} disabled={saveStatus === 'saving'} className={`w-full py-1.5 rounded text-[8px] font-black uppercase tracking-widest text-white shadow-md transition-all ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            <Save size={10} className="inline mr-1" /> {editingId ? 'Update Product Record' : 'Submit Registration'}
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-4 h-full">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 h-full flex flex-col shadow-lg">
                        <h3 className="text-[7px] font-black uppercase text-blue-400 flex items-center gap-1.5 mb-2"><History size={10} /> Recent Activity</h3>
                        <div className="space-y-1.5 overflow-y-auto max-h-[220px] pr-1 scrollbar-hide">
                            {inventory.slice(0, 5).map((item) => (
                                <div key={item.id} className="bg-slate-800 border-l-2 border-blue-500 p-1.5 rounded hover:bg-slate-700/50 transition-colors">
                                    <p className="text-[8px] font-black text-blue-400">{item.partNumber}</p>
                                    <p className="text-[8px] font-bold truncate text-white uppercase">{item.itemName}</p>
                                    <div className="mt-1 pt-1 border-t border-slate-700 border-dashed space-y-0.5">
                                        <p className="text-[6px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                            <PlusCircle size={7} className="text-blue-500" /> {item.registeredBy} | {item.timestamp}
                                        </p>
                                        {item.lastModifiedBy && (
                                            <p className="text-[6px] font-bold text-amber-500 uppercase flex items-center gap-1">
                                                <Pencil size={7} /> {item.lastModifiedBy} | {item.updatedAt}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setSearchParams({ tab: activeTab, sub: 'inquiries' })} className="mt-auto pt-2 text-center text-[7px] font-black uppercase text-blue-400 hover:text-blue-300 transition-colors">Master List Enquiry <ChevronRight size={8} className="inline" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPartsForm;