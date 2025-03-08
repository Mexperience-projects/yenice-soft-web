"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  FileText,
  Package,
  Plus,
  ShoppingBag,
  Users,
  BarChart3,
  CalendarDays,
} from "lucide-react";

// Import the types
import type {
  ServicesType,
  PersonelType,
  VisitType,
  ClientType,
  ItemsType,
} from "@/lib/types";

export default function DashboardPage() {
  // State for dashboard data
  const [visits, setVisits] = useState<VisitType[]>([]);
  const [personnel, setPersonnel] = useState<PersonelType[]>([]);
  const [services, setServices] = useState<ServicesType[]>([]);
  const [items, setItems] = useState<ItemsType[]>([]);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("week");

  // Mock data loading effect
  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const mockData = {
      visits: [
        {
          id: 1,
          client: [1],
          service: [1],
          items: 3,
          datetime: new Date(),
          payments: 1,
        },
        {
          id: 2,
          client: [2],
          service: [2],
          items: 2,
          datetime: new Date(),
          payments: 2,
        },
        {
          id: 3,
          client: [3],
          service: [1],
          items: 1,
          datetime: new Date(),
          payments: 3,
        },
      ] as VisitType[],
      personnel: [
        { id: 1, name: "Dr. Smith", description: "Specialist", visits: [] },
        { id: 2, name: "Jane Cooper", description: "Nurse", visits: [] },
        { id: 3, name: "Robert Fox", description: "Technician", visits: [] },
      ] as PersonelType[],
      services: [
        {
          id: 1,
          name: "Regular Checkup",
          price: 100,
          description: "Standard checkup",
          personel: [1],
          items: 2,
          personel_fixed_fee: 50,
          personel_precent_fee: 10,
        },
        {
          id: 2,
          name: "Specialized Treatment",
          price: 250,
          description: "Advanced care",
          personel: [1, 2],
          items: 4,
          personel_fixed_fee: 100,
          personel_precent_fee: 15,
        },
      ] as ServicesType[],
      items: [
        { id: 1, item: 101, name: "Bandages", price: 5, count: 100 },
        { id: 2, item: 102, name: "Antiseptic", price: 10, count: 50 },
        { id: 3, item: 103, name: "Gloves", price: 2, count: 200 },
      ] as ItemsType[],
      clients: [
        {
          id: 1,
          name: "John Doe",
          nationalCo: "1234567890",
          birthdate: new Date(1980, 5, 15),
          gender: 1,
        },
        {
          id: 2,
          name: "Jane Smith",
          nationalCo: "0987654321",
          birthdate: new Date(1992, 8, 22),
          gender: 2,
        },
        {
          id: 3,
          name: "Alex Johnson",
          nationalCo: "5678901234",
          birthdate: new Date(1975, 2, 10),
          gender: 1,
        },
      ] as ClientType[],
    };

    // Set the mock data to state
    setVisits(mockData.visits);
    setPersonnel(mockData.personnel);
    setServices(mockData.services);
    setItems(mockData.items);
    setClients(mockData.clients);
    setLoading(false);
  }, []);

  // Calculate dashboard statistics
  const totalVisits = visits.length;
  const activePersonnel = personnel.length;
  const inventoryItems = items.length;
  const totalServices = services.length;
  const lowStockItems = items.filter((item) => item.count < 20).length;

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-base-200">
      <div className="mx-auto p-2 md:p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Visits</div>
              <div className="stat-value text-primary">{totalVisits}</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Active Personnel</div>
              <div className="stat-value text-secondary">{activePersonnel}</div>
              <div className="stat-desc">3 on leave</div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-accent">
                <Package className="w-8 h-8" />
              </div>
              <div className="stat-title">Inventory Items</div>
              <div className="stat-value">{inventoryItems}</div>
              <div className="stat-desc text-warning">
                {lowStockItems} need restocking
              </div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-info">
                <FileText className="w-8 h-8" />
              </div>
              <div className="stat-title">Services</div>
              <div className="stat-value text-info">{totalServices}</div>
              <div className="stat-desc">↗︎ 4 (16%) new this week</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart Section */}
          <div className="card bg-base-100 shadow-xl lg:col-span-2">
            <div className="card-body">
              <h2 className="card-title">Monthly Visits</h2>
              <div className="w-full h-72 mt-4">
                {/* Chart Placeholder */}
                <div className="w-full h-full bg-base-200 rounded-box flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <BarChart3 className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-sm text-base-content/70">
                      Chart visualization would appear here
                    </p>
                    <p className="text-xs text-base-content/50 mt-2">
                      Showing data for last 6 months
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm">Visits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="text-sm">Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <span className="text-sm">Revenue</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar/Upcoming */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Upcoming Visits</h2>
                <button className="btn btn-sm btn-ghost">
                  <CalendarDays className="w-4 h-4" />
                  <span className="hidden sm:inline">View All</span>
                </button>
              </div>

              <div className="space-y-4">
                {visits.map((visit, index) => {
                  const client = clients.find((c) => c.id === visit.client[0]);
                  const service = services.find(
                    (s) => s.id === visit.service[0]
                  );

                  return (
                    <div key={visit.id} className="flex items-start gap-3">
                      <div
                        className={`badge badge-${
                          index % 3 === 0
                            ? "primary"
                            : index % 3 === 1
                            ? "secondary"
                            : "accent"
                        } badge-lg`}
                      >
                        {formatDate(visit.datetime)}
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {client?.name || "Unknown Client"}
                        </h3>
                        <p className="text-sm text-base-content/70">
                          {service?.name || "Unknown Service"}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {visits.length === 0 && (
                  <div className="text-center py-4 text-base-content/70">
                    No upcoming visits scheduled
                  </div>
                )}
              </div>

              <div className="card-actions justify-center mt-4">
                <button className="btn btn-outline btn-sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Schedule Visit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Recent Activity</h2>
              <div className="flex gap-2">
                <div className="join">
                  <button
                    className={`join-item btn btn-sm ${
                      activeTab === "today" ? "btn-active" : ""
                    }`}
                    onClick={() => setActiveTab("today")}
                  >
                    Today
                  </button>
                  <button
                    className={`join-item btn btn-sm ${
                      activeTab === "week" ? "btn-active" : ""
                    }`}
                    onClick={() => setActiveTab("week")}
                  >
                    Week
                  </button>
                  <button
                    className={`join-item btn btn-sm ${
                      activeTab === "month" ? "btn-active" : ""
                    }`}
                    onClick={() => setActiveTab("month")}
                  >
                    Month
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((visit, index) => {
                    const client = clients.find(
                      (c) => c.id === visit.client[0]
                    );
                    const service = services.find(
                      (s) => s.id === visit.service[0]
                    );
                    const assignedPersonnel = personnel.find(
                      (p) => service?.personel.includes(p.id)
                    );

                    return (
                      <tr key={visit.id}>
                        <td>{formatDate(visit.datetime)}</td>
                        <td>
                          <div className="badge badge-primary">Visit</div>
                        </td>
                        <td>
                          {service?.name} for {client?.name}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="avatar">
                              <div className="w-8 rounded-full">
                                <img
                                  src={`/placeholder.svg?height=32&width=32&text=${
                                    assignedPersonnel?.name.charAt(0) || "?"
                                  }`}
                                  alt="Avatar"
                                />
                              </div>
                            </div>
                            <span>
                              {assignedPersonnel?.name || "Unassigned"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div
                            className={`badge ${
                              index % 3 === 0
                                ? "badge-success"
                                : index % 3 === 1
                                ? "badge-warning"
                                : "badge-info"
                            }`}
                          >
                            {index % 3 === 0
                              ? "Completed"
                              : index % 3 === 1
                              ? "In Progress"
                              : "Scheduled"}
                          </div>
                        </td>
                        <td>
                          <div className="dropdown dropdown-end">
                            <div
                              tabIndex={0}
                              role="button"
                              className="btn btn-ghost btn-xs"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                                />
                              </svg>
                            </div>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                            >
                              <li>
                                <a>View Details</a>
                              </li>
                              <li>
                                <a>Edit</a>
                              </li>
                              <li>
                                <a>Archive</a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Additional mock rows for inventory and personnel activities */}
                  <tr>
                    <td>{formatDate(new Date())}</td>
                    <td>
                      <div className="badge badge-secondary">Inventory</div>
                    </td>
                    <td>Restocked medical supplies</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src="/placeholder.svg?height=32&width=32&text=J"
                              alt="Avatar"
                            />
                          </div>
                        </div>
                        <span>Jane Cooper</span>
                      </div>
                    </td>
                    <td>
                      <div className="badge badge-success">Completed</div>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-ghost btn-xs"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                            />
                          </svg>
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                        >
                          <li>
                            <a>View Details</a>
                          </li>
                          <li>
                            <a>Edit</a>
                          </li>
                          <li>
                            <a>Archive</a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-base-content/70">
                Showing {Math.min(visits.length + 1, 5)} of {visits.length + 10}{" "}
                activities
              </span>
              <div className="join">
                <button className="join-item btn btn-sm">«</button>
                <button className="join-item btn btn-sm btn-active">1</button>
                <button className="join-item btn btn-sm">2</button>
                <button className="join-item btn btn-sm">3</button>
                <button className="join-item btn btn-sm">»</button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                <CalendarDays className="w-6 h-6 text-primary" />
                Schedule Visit
              </h2>
              <p>Create a new appointment or schedule a follow-up visit.</p>
              <div className="card-actions justify-end mt-2">
                <button className="btn btn-primary btn-sm">Schedule Now</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                <ShoppingBag className="w-6 h-6 text-secondary" />
                Manage Inventory
              </h2>
              <p>Check stock levels and order new supplies as needed.</p>
              <div className="card-actions justify-end mt-2">
                <button className="btn btn-secondary btn-sm">
                  View Inventory
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                <FileText className="w-6 h-6 text-accent" />
                Generate Reports
              </h2>
              <p>Create custom reports for visits, inventory, and personnel.</p>
              <div className="card-actions justify-end mt-2">
                <button className="btn btn-accent btn-sm">Create Report</button>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Section */}
        <div className="mt-6">
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h3 className="font-bold">New Update Available</h3>
              <div className="text-xs">
                System update v2.0.4 is now available. View the changelog for
                details.
              </div>
            </div>
            <button className="btn btn-sm">View</button>
          </div>
        </div>
      </div>
    </div>
  );
}
