'use client';

import { useState, useEffect } from 'react';
import SectionHeader from '../ui/section-header';
import EmptyState from '../ui/empty-state';
import CurrencySelector from '../forms/currency-selector';
import { formatCurrency } from '@/lib/quote-utils';
import { getStoredProjects, saveStoredProjects } from '@/lib/project-utils';
import { Trash2, FolderPlus, Calendar, Building2, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

export interface ActiveProject {
  id: string;
  quoteId?: string;
  title: string;
  clientName: string;
  value: number;
  currencyCode: string;
  status: 'In Progress' | 'Awaiting Client' | 'Completed' | 'Canceled';
  startDate: string;
  dueDate: string;
}

export const INITIAL_PROJECTS: ActiveProject[] = [];

export default function ProjectsView() {
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newValue, setNewValue] = useState(5000);
  const [newCurrencyCode, setNewCurrencyCode] = useState('USD');
  const [newStatus, setNewStatus] = useState<ActiveProject['status']>('In Progress');

  useEffect(() => {
    setProjects(getStoredProjects());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveStoredProjects(projects);
    }
  }, [projects, isLoaded]);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const project: ActiveProject = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      clientName: newClient || 'Client',
      value: Number(newValue) || 0,
      currencyCode: newCurrencyCode || 'USD',
      status: newStatus,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setProjects([project, ...projects]);
    setNewTitle('');
    setNewClient('');
    setShowAddForm(false);
  };

  const handleUpdateStatus = (id: string, status: ActiveProject['status']) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to remove this project?')) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const getStatusBadge = (status: ActiveProject['status']) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 bg-ledger-text text-ledger-cream border border-ledger-text font-bold inline-flex items-center gap-1">
            <Clock className="h-3 w-3 text-ledger-accent shrink-0" />
            In Progress
          </span>
        );
      case 'Awaiting Client':
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 bg-ledger-accent text-ledger-dark border border-ledger-text font-bold inline-flex items-center gap-1">
            <AlertCircle className="h-3 w-3 shrink-0" />
            Awaiting Client
          </span>
        );
      case 'Completed':
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 bg-emerald-800 text-white border border-ledger-text font-bold inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 shrink-0" />
            Completed
          </span>
        );
      case 'Canceled':
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 bg-ledger-oxblood text-ledger-cream border border-ledger-text font-bold inline-flex items-center gap-1">
            <XCircle className="h-3 w-3 shrink-0" />
            Canceled
          </span>
        );
    }
  };

  return (
    <div data-tour="projects-view" className="space-y-8 animate-fade-in">
      <SectionHeader
        badge="DEAL EXECUTION & TRACKING"
        title="Active Projects"
        subtitle="Track freelance contracts converted from proposals or added manually."
        action={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-oxblood px-5 py-3 hover:bg-ledger-dark transition-colors border border-ledger-text font-bold inline-flex items-center gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            {showAddForm ? 'Cancel' : '+ Add Project'}
          </button>
        }
      />

      {showAddForm && (
        <form
          onSubmit={handleAddProject}
          className="border-2 border-ledger-text p-6 bg-ledger-paper space-y-4 font-mono text-xs"
        >
          <h3 className="font-serif text-2xl text-ledger-text font-bold">
            Add Active Project
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-ledger-grey mb-1">
                Project Title *
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Website Redesign"
                className="w-full p-2.5 bg-ledger-cream border border-ledger-text font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-ledger-grey mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full p-2.5 bg-ledger-cream border border-ledger-text font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-ledger-grey mb-1">
                Project Value
              </label>
              <input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(Number(e.target.value))}
                className="w-full p-2.5 bg-ledger-cream border border-ledger-text font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-ledger-grey mb-1">
                Currency
              </label>
              <CurrencySelector
                currencyCode={newCurrencyCode}
                onChange={setNewCurrencyCode}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-ledger-grey mb-1">
                Initial Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ActiveProject['status'])}
                className="p-2.5 bg-ledger-cream border border-ledger-text font-mono text-xs font-bold"
              >
                <option value="In Progress">In Progress</option>
                <option value="Awaiting Client">Awaiting Client</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="font-mono text-[10px] uppercase tracking-[0.1em] bg-ledger-text text-ledger-cream px-5 py-2.5 border border-ledger-text hover:bg-ledger-dark font-bold"
            >
              Save Project
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <EmptyState
          title="No Active Projects"
          message="Convert a proposal from your Quotes Workspace or add a new project manually using the button above."
          actionLabel="+ Add First Project"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="border-2 border-ledger-text p-6 bg-ledger-cream flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-3 flex-wrap">
                  {getStatusBadge(proj.status)}

                  {/* Interactive Status Switcher */}
                  <select
                    value={proj.status}
                    onChange={(e) =>
                      handleUpdateStatus(
                        proj.id,
                        e.target.value as ActiveProject['status']
                      )
                    }
                    className="font-mono text-[10px] uppercase tracking-wider p-1 bg-ledger-paper border border-ledger-text text-ledger-text font-bold cursor-pointer"
                  >
                    <option value="In Progress">Status: In Progress</option>
                    <option value="Awaiting Client">Status: Awaiting Client</option>
                    <option value="Completed">Status: Completed</option>
                    <option value="Canceled">Status: Canceled</option>
                  </select>
                </div>

                <h3 className="font-serif text-2xl text-ledger-text font-bold">
                  {proj.title}
                </h3>

                <div className="flex items-center gap-4 font-mono text-xs text-ledger-grey flex-wrap">
                  <span className="flex items-center gap-1 text-ledger-text font-semibold">
                    <Building2 className="h-3.5 w-3.5 text-ledger-grey" />
                    {proj.clientName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-ledger-grey" />
                    Start: {proj.startDate} | Due: {proj.dueDate}
                  </span>
                </div>
              </div>

              {/* Value & Actions */}
              <div className="flex items-center justify-between md:flex-col md:items-end gap-3 font-mono border-t md:border-t-0 pt-3 md:pt-0 border-ledger-text/20">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase tracking-widest text-ledger-grey block">
                    Contract Value
                  </span>
                  <span className="font-serif text-2xl font-bold text-ledger-text">
                    {formatCurrency(proj.value, proj.currencyCode)}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteProject(proj.id)}
                  title="Delete project"
                  className="p-2 text-ledger-grey hover:text-ledger-oxblood hover:bg-ledger-warm border border-transparent hover:border-ledger-text transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
