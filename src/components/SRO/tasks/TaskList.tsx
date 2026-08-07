"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  ChevronRight,
  Calendar,
  User,
} from "lucide-react";

type TaskStatus = "Pending" | "In Progress" | "Completed";
type Priority = "High" | "Medium" | "Low";

type Task = {
  id: string;
  title: string;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
};

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Submit monthly volunteer hours",
    assignee: "Pedro Manalo",
    assigneeInitials: "PM",
    assigneeColor: "bg-red-400",
    dueDate: "Aug 10",
    priority: "High",
    status: "Pending",
  },
  {
    id: "2",
    title: "Update youth leader profiles",
    assignee: "Felipe Torres",
    assigneeInitials: "FT",
    assigneeColor: "bg-blue-500",
    dueDate: "Aug 15",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: "3",
    title: "Prepare Q2 performance report",
    assignee: "Gloria Mendoza",
    assigneeInitials: "GM",
    assigneeColor: "bg-emerald-500",
    dueDate: "Aug 5",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "4",
    title: "Review volunteer applications",
    assignee: "Pedro Manalo",
    assigneeInitials: "PM",
    assigneeColor: "bg-red-400",
    dueDate: "Aug 8",
    priority: "High",
    status: "Completed",
  },
];

const priorityColors: Record<Priority, string> = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-amber-100 text-amber-600",
  Low: "bg-blue-100 text-blue-600",
};

// const priorityDotColors: Record<Priority, string> = {
//   High: "bg-red-500",
//   Medium: "bg-amber-500",
//   Low: "bg-blue-500",
// };

// w

const statusColors: Record<TaskStatus, string> = {
  Pending: "bg-amber-50 border-amber-200",
  "In Progress": "bg-blue-50 border-blue-200",
  Completed: "bg-emerald-50 border-emerald-200",
};

const statusHeaderColors: Record<TaskStatus, string> = {
  Pending: "text-amber-700",
  "In Progress": "text-blue-700",
  Completed: "text-emerald-700",
};

export function TaskList() {
  const [tasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");

  const filtered = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.assignee.toLowerCase().includes(search.toLowerCase())
  );

  const pendingTasks = filtered.filter((t) => t.status === "Pending");
  const inProgressTasks = filtered.filter((t) => t.status === "In Progress");
  const completedTasks = filtered.filter((t) => t.status === "Completed");

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-shrink-0">
        <Circle size={16} className="text-gray-300" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {task.title}
          </h3>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-1.5">
          <div className="flex items-center gap-1.5">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-semibold text-white ${task.assigneeColor}`}
            >
              {task.assigneeInitials}
            </div>
            <span className="text-xs text-gray-500">{task.assignee}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar size={12} />
            <span>{task.dueDate}</span>
          </div>
        </div>
      </div>
      
      <button className="flex-shrink-0 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition-colors">
        View
      </button>
    </div>
  );

  const TaskColumn = ({ 
    title, 
    tasks, 
    icon, 
    color 
  }: { 
    title: string; 
    tasks: Task[]; 
    icon: React.ReactNode; 
    color: string;
  }) => (
    <div className="flex-1 min-w-[280px]">
      <div className={`rounded-xl border ${statusColors[title as TaskStatus]} p-4`}>
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h2 className={`text-sm font-semibold ${statusHeaderColors[title as TaskStatus]}`}>
            {title}
          </h2>
          <span className={`ml-auto rounded-full ${color} px-2.5 py-0.5 text-xs font-semibold text-white`}>
            {tasks.length}
          </span>
        </div>
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <div className="text-center py-6 text-xs text-gray-400">
              No {title.toLowerCase()} tasks
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">Tasks</h1>
        <p className="text-sm text-gray-500">
          Assign and track tasks across your ROs.
        </p>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search + Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative w-64">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={15} />
              Filter
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-white bg-orange-500 px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              <Plus size={15} />
              Add Task
            </button>
          </div>
        </div>

        {/* Task Columns */}
        <div className="p-5">
          <div className="flex flex-col lg:flex-row gap-5 overflow-x-auto">
            <TaskColumn
              title="Pending"
              tasks={pendingTasks}
              icon={<Clock size={18} className="text-amber-500" />}
              color="bg-amber-500"
            />
            <TaskColumn
              title="In Progress"
              tasks={inProgressTasks}
              icon={<AlertCircle size={18} className="text-blue-500" />}
              color="bg-blue-500"
            />
            <TaskColumn
              title="Completed"
              tasks={completedTasks}
              icon={<CheckCircle size={18} className="text-emerald-500" />}
              color="bg-emerald-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={16} className="text-gray-400" />
            <span className="font-medium">Sarah Johnson</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-400">Senior RO</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Showing {filtered.length} tasks</span>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}