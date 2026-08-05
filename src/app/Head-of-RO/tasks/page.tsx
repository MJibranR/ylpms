"use client";

import { useMemo, useState } from "react";
import { Search, Filter, Plus, Clock, Check, Pencil, Trash2 } from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

type Priority = "High" | "Medium" | "Low";
type Status = "Pending" | "In Progress" | "Done";

type Task = {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  priority: Priority;
  status: Status;
};

const initialTasks: Task[] = [
  {
    id: "1",
    task: "Review Q2 volunteer reports",
    assignee: "All SROs",
    dueDate: "Aug 10, 2026",
    priority: "High",
    status: "Pending",
  },
  {
    id: "2",
    task: "Onboard 3 new ROs in NCR",
    assignee: "Maria Santos",
    dueDate: "Aug 15, 2026",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: "3",
    task: "Conduct youth leader training",
    assignee: "Jose Reyes",
    dueDate: "Aug 20, 2026",
    priority: "High",
    status: "Pending",
  },
  {
    id: "4",
    task: "Update volunteer database",
    assignee: "All ROs",
    dueDate: "Jul 31, 2026",
    priority: "Low",
    status: "Done",
  },
  {
    id: "5",
    task: "Submit region analytics report",
    assignee: "Ana Cruz",
    dueDate: "Aug 5, 2026",
    priority: "High",
    status: "In Progress",
  },
];

const priorityStyles: Record<Priority, string> = {
  High: "bg-red-100 text-red-500",
  Medium: "bg-amber-100 text-amber-600",
  Low: "bg-gray-100 text-gray-400",
};

const statusStyles: Record<Status, string> = {
  Pending: "bg-amber-100 text-amber-600",
  "In Progress": "bg-blue-100 text-blue-600",
  Done: "bg-emerald-100 text-emerald-600",
};

export default function TasksPage() {
  const [tasks] = useState<Task[]>(initialTasks);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (t) =>
        t.task.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        t.priority.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
    );
  }, [tasks, query]);

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage all assigned tasks.
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8622C]/30 focus:border-[#E8622C]"
              />
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-[#E8622C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#d9551f] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New
            </button>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
                    <th className="px-6 py-3.5">Task</th>
                    <th className="px-6 py-3.5">Assignee</th>
                    <th className="px-6 py-3.5">Due Date</th>
                    <th className="px-6 py-3.5">Priority</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/60">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {t.task}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {t.assignee}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          {t.dueDate}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[t.priority]}`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[t.status]}`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            aria-label={`Mark "${t.task}" complete`}
                            className="text-gray-400 hover:text-emerald-500"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Edit "${t.task}"`}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete "${t.task}"`}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center text-sm text-gray-400"
                      >
                        No tasks match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}