'use client';

import { useState } from 'react';
import SectionHeader from '../ui/section-header';

export interface ActiveProject {
  id: string;
  title: string;
  clientName: string;
  value: number;
  currencyCode: string;
  status: 'In Progress' | 'Awaiting Client' | 'Completed';
  startDate: string;
  dueDate: string;
}

export const INITIAL_PROJECTS: ActiveProject[] = [
  {
    id: 'proj-1',
    title: 'Website Redesign & Brand Integration',
    clientName: 'Acme Corp',
    value: 75000,
    currencyCode: 'USD',
    status: 'In Progress',
    startDate: '2026-08-15',
    dueDate: '2026-09-30',
  },
  {
    id: 'proj-2',
    title: 'SaaS MVP Development',
    clientName: 'Starlight Labs',
    value: 120000,
    currencyCode: 'USD',
    status: 'Awaiting Client',
    startDate: '2026-09-01',
    dueDate: '2026-10-15',
  },
  {
    id: 'proj-3',
    title: 'Portfolio Audit & SEO Setup',
    clientName: 'Studio Nine',
    value: 35000,
    currencyCode: 'USD',
    status: 'Completed',
    startDate: '2026-07-01',
    dueDate: '2026-08-01',
  },
];

export default function ProjectsView() {
  const [projects, setProjects] = useState<ActiveProject[]>(INITIAL_PROJECTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newValue, setNewValue] = useState(50000);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const project: ActiveProject = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      clientName: newClient || 'Client',
      value: Number(newValue) || 0,
      currencyCode: 'USD',
      status: 'In Progress',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setProjects([project, ...projects]);
    setNewTitle('');
    setNewClient('');
    setShowAddForm(false);
  };

  const getStatusBadge = (status: ActiveProject['status']) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-0.5 bg-ledger-text text-ledger-cream border border-ledger-text font-bold">
            In Progress
          </span>
        );
      case 'Awaiting Client':
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-0.5 bg-ledger-accent text-ledger-dark border border-ledger-text font-bold">
            Awaiting Client
          </span>
        );
      case 'Completed':
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-0.5 bg-ledger-paper text-ledger-grey border border-ledger-grey font-bold">
            Completed
          </span>
        );
    }
  };

  return (
    <div data-tour="projects-view" className="space-y-8 animate-fade-in">
      <SectionHeader
        badge="DEAL EXECUTION"
        title="Active Projects"
        subtitle="Track active freelance contracts converted from proposals."
        action={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-oxblood px-5 py-3 hover:bg-ledger-dark transition-colors border border-ledger-text font-bold"
          >
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-ledger-grey mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Next.js Web App"
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
          </div>
          <button
            type="submit"
            className="font-mono text-[10px] uppercase tracking-[0.1em] bg-ledger-text text-ledger-cream px-5 py-2.5 border border-ledger-text hover:bg-ledger-dark"
          >
            Save Project
          </button>
        </form>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="border-2 border-ledger-text p-6 bg-ledger-cream flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                {getStatusBadge(proj.status)}
                <h3 className="font-serif text-xl text-ledger-text font-bold">
                  {proj.title}
                </h3>
              </div>
              <p className="font-mono text-xs text-ledger-grey">
                Client: <span className="text-ledger-text font-semibold">{proj.clientName}</span> | Start: {proj.startDate} | Due: {proj.dueDate}
              </p>
            </div>

            <div className="text-left md:text-right font-mono">
              <span className="text-[10px] uppercase tracking-widest text-ledger-grey block">
                Contract Value
              </span>
              <span className="font-serif text-2xl font-bold text-ledger-text">
                ${proj.value.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
