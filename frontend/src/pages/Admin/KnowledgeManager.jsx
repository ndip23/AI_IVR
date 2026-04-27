import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Database, Plus, Trash2, Brain, Loader2, AlertCircle } from 'lucide-react';

export default function KnowledgeManager() {
  const [docs, setDocs] = useState([]);
  const [newDoc, setNewDoc] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Load Real Data from MongoDB on page load
  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('http://localhost:5000/api/admin/knowledge', config);
      setDocs(res.data);
    } catch (err) {
      console.error("Failed to load knowledge base", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Add new document to MongoDB
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDoc.trim()) return;

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.post('http://localhost:5000/api/admin/knowledge', { text: newDoc }, config);
      
      setDocs([res.data, ...docs]); // Update UI instantly
      setNewDoc("");
      toast.success('New policy added to database!');
    } catch (err) {
      toast.error("Failed to save to database");
    }
  };

  // 3. Delete document from MongoDB
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure? The AI will lose this knowledge.")) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/admin/knowledge/${id}`, config);
      
      setDocs(docs.filter(doc => doc._id !== id));
      toast.success('Policy deleted.');
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // 4. THE SYNC: Forward MongoDB data to Python AI Engine
  const handleSync = async () => {
    setIsSyncing(true);
    
    // 1. Create a Loading Toast and store its ID
    const syncToast = toast.loading('Syncing with AI Engine... Please wait.');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // Node.js will fetch all MongoDB docs and POST them to Python Port 8000
      const res = await axios.post('http://localhost:5000/api/admin/sync', {}, config);
      
      // 2. Update the existing toast to SUCCESS
      const vectorCount = res.data.pythonResponse.vector_count || docs.length;
      toast.success(`AI Brain Updated! (${vectorCount} rules vectorized)`, {
        id: syncToast, // This tells react-hot-toast to replace the loading message
      });

    } catch (err) {
      // 3. Update the existing toast to ERROR
      const errorMessage = err.response?.data?.message || "Sync failed. Is Python app.py running?";
      toast.error(errorMessage, {
        id: syncToast,
      });
      console.error("Sync Error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Database className="text-blue-600"/> AI Knowledge Base
        </h1>
        <p className="text-slate-500 mt-1 font-medium text-sm uppercase tracking-widest">Training Data Management</p>
      </div>

      {/* Add Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 border-l-4 border-l-blue-600">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase"><Plus size={18}/> New Knowledge Entry</h3>
        <div className="flex gap-3">
          <textarea 
            className="flex-1 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none h-28 text-sm transition-all bg-slate-50 focus:bg-white"
            placeholder="Enter a fact, rule, or FAQ. e.g. 'We offer a student discount of 15% with valid ID.'"
            value={newDoc}
            onChange={(e) => setNewDoc(e.target.value)}
          />
          <button onClick={handleAdd} className="bg-blue-600 text-white px-8 rounded-xl hover:bg-blue-700 font-bold self-end py-3 shadow-lg shadow-blue-100 transition-all active:scale-95">
            Add
          </button>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 bg-slate-50 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-blue-600 text-white px-2 py-0.5 rounded uppercase">{docs.length}</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Policies</span>
          </div>
          <button 
            onClick={handleSync}
            disabled={isSyncing || docs.length === 0}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 disabled:bg-slate-300 shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            {isSyncing ? <Loader2 className="animate-spin" size={16}/> : <Brain size={16}/>}
            {isSyncing ? "Syncing..." : "Sync AI Brain"}
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-20 text-center flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-slate-300" size={32} />
              <p className="text-slate-400 text-sm font-medium">Fetching Knowledge Base...</p>
            </div>
          ) : docs.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center gap-3">
              <AlertCircle className="text-slate-200" size={48} />
              <p className="text-slate-400 text-sm font-medium">No knowledge entries found. System is currently untrained.</p>
            </div>
          ) : (
            docs.map((doc) => (
              <div key={doc._id} className="p-5 flex justify-between items-start group hover:bg-blue-50/30 transition-all">
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                  <p className="text-slate-700 text-[15px] leading-relaxed max-w-2xl">{doc.text}</p>
                </div>
                <button 
                  onClick={() => handleDelete(doc._id)}
                  className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all bg-white rounded-lg shadow-sm border border-slate-100"
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}