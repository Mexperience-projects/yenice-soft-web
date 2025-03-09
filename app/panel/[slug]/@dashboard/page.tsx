export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto p-2 md:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stats shadow bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="stat">
              <div className="stat-figure text-primary">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="stat-title font-medium text-gray-500">
                Total Visits
              </div>
              <div className="stat-value text-primary text-3xl font-bold">
                25.6K
              </div>
              <div className="stat-desc text-success flex items-center gap-1">
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
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
                21% more than last month
              </div>
            </div>
          </div>

          <div className="stats shadow bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-secondary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="stat-title font-medium text-gray-500">
                Active Personnel
              </div>
              <div className="stat-value text-secondary text-3xl font-bold">
                12
              </div>
              <div className="stat-desc text-gray-500">3 on leave</div>
            </div>
          </div>

          <div className="stats shadow bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="stat">
              <div className="stat-figure text-primary">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="inline-block w-8 h-8 stroke-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>
                </div>
              </div>
              <div className="stat-title font-medium text-gray-500">
                Inventory Items
              </div>
              <div className="stat-value text-primary text-3xl font-bold">
                89
              </div>
              <div className="stat-desc text-warning flex items-center gap-1">
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
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                12 need restocking
              </div>
            </div>
          </div>

          <div className="stats shadow bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="inline-block w-8 h-8 stroke-secondary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                  </svg>
                </div>
              </div>
              <div className="stat-title font-medium text-gray-500">
                Services
              </div>
              <div className="stat-value text-secondary text-3xl font-bold">
                24
              </div>
              <div className="stat-desc text-success flex items-center gap-1">
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
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
                4 (16%) new this week
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart Section */}
          <div className="card bg-white shadow-xl lg:col-span-2 border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300">
            <div className="card-body">
              <h2 className="card-title text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="inline-block w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></span>
                Monthly Visits
              </h2>
              <div className="w-full h-72 mt-4">
                {/* Chart Placeholder */}
                <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-12 h-12 text-secondary"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Chart visualization would appear here
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Showing data for last 6 months
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm text-gray-600">Visits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="text-sm text-gray-600">Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar/Upcoming */}
          <div className="card bg-white shadow-xl border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="inline-block w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></span>
                  Upcoming Events
                </h2>
                <button className="btn btn-sm btn-ghost text-secondary hover:bg-secondary/10">
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                  View All
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="badge badge-lg bg-primary text-white border-0">
                    10 Mar
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Staff Meeting</h3>
                    <p className="text-sm text-gray-500">
                      10:00 AM - Conference Room
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="badge badge-lg bg-secondary text-white border-0">
                    12 Mar
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Inventory Check
                    </h3>
                    <p className="text-sm text-gray-500">2:00 PM - Warehouse</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="badge badge-lg bg-gradient-to-r from-primary to-secondary text-white border-0">
                    15 Mar
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Quarterly Review
                    </h3>
                    <p className="text-sm text-gray-500">
                      9:00 AM - Board Room
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="badge badge-lg bg-gray-200 text-gray-700 border-0">
                    18 Mar
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Training Session
                    </h3>
                    <p className="text-sm text-gray-500">
                      1:00 PM - Training Center
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-actions justify-center mt-4">
                <button className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white btn-sm gap-2">
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
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="card bg-white shadow-xl mb-8 border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="inline-block w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></span>
                Recent Activity
              </h2>
              <div className="flex gap-2">
                <div className="join rounded-lg overflow-hidden border border-gray-200">
                  <button className="join-item btn btn-sm bg-white hover:bg-gray-100 text-gray-700 border-0">
                    Today
                  </button>
                  <button className="join-item btn btn-sm bg-primary hover:bg-primary/90 text-white border-0">
                    Week
                  </button>
                  <button className="join-item btn btn-sm bg-white hover:bg-gray-100 text-gray-700 border-0">
                    Month
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="rounded-l-lg">Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th className="rounded-r-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td>2025-03-06</td>
                    <td>
                      <div className="badge bg-primary text-white border-0">
                        Visit
                      </div>
                    </td>
                    <td>Regular checkup for patient #1234</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-8 rounded-full ring-2 ring-primary/20">
                            <img
                              src="/placeholder.svg?height=32&width=32"
                              alt="Avatar"
                            />
                          </div>
                        </div>
                        <span className="font-medium">Dr. Smith</span>
                      </div>
                    </td>
                    <td>
                      <div className="badge bg-success text-white border-0">
                        Completed
                      </div>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-ghost btn-xs hover:bg-gray-100"
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
                  <tr className="hover:bg-gray-50">
                    <td>2025-03-05</td>
                    <td>
                      <div className="badge bg-secondary text-white border-0">
                        Inventory
                      </div>
                    </td>
                    <td>Restocked medical supplies</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-8 rounded-full ring-2 ring-secondary/20">
                            <img
                              src="/placeholder.svg?height=32&width=32"
                              alt="Avatar"
                            />
                          </div>
                        </div>
                        <span className="font-medium">Jane Cooper</span>
                      </div>
                    </td>
                    <td>
                      <div className="badge bg-success text-white border-0">
                        Completed
                      </div>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-ghost btn-xs hover:bg-gray-100"
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
                  <tr className="hover:bg-gray-50">
                    <td>2025-03-05</td>
                    <td>
                      <div className="badge bg-gradient-to-r from-primary to-secondary text-white border-0">
                        Personnel
                      </div>
                    </td>
                    <td>New staff onboarding</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-8 rounded-full ring-2 ring-primary/20">
                            <img
                              src="/placeholder.svg?height=32&width=32"
                              alt="Avatar"
                            />
                          </div>
                        </div>
                        <span className="font-medium">Robert Fox</span>
                      </div>
                    </td>
                    <td>
                      <div className="badge bg-warning text-white border-0">
                        In Progress
                      </div>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-ghost btn-xs hover:bg-gray-100"
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
                  <tr className="hover:bg-gray-50">
                    <td>2025-03-04</td>
                    <td>
                      <div className="badge bg-secondary text-white border-0">
                        Service
                      </div>
                    </td>
                    <td>Equipment maintenance</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-8 rounded-full ring-2 ring-secondary/20">
                            <img
                              src="/placeholder.svg?height=32&width=32"
                              alt="Avatar"
                            />
                          </div>
                        </div>
                        <span className="font-medium">Leslie Alexander</span>
                      </div>
                    </td>
                    <td>
                      <div className="badge bg-success text-white border-0">
                        Completed
                      </div>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-ghost btn-xs hover:bg-gray-100"
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
              <span className="text-sm text-gray-500">
                Showing 4 of 24 activities
              </span>
              <div className="join rounded-lg overflow-hidden border border-gray-200">
                <button className="join-item btn btn-sm bg-white hover:bg-gray-100 text-gray-700 border-0">
                  «
                </button>
                <button className="join-item btn btn-sm bg-primary hover:bg-primary/90 text-white border-0">
                  1
                </button>
                <button className="join-item btn btn-sm bg-white hover:bg-gray-100 text-gray-700 border-0">
                  2
                </button>
                <button className="join-item btn btn-sm bg-white hover:bg-gray-100 text-gray-700 border-0">
                  3
                </button>
                <button className="join-item btn btn-sm bg-white hover:bg-gray-100 text-gray-700 border-0">
                  »
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-white shadow-xl border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300">
            <div className="card-body">
              <h2 className="card-title text-gray-800">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-secondary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                    />
                  </svg>
                </div>
                Schedule Visit
              </h2>
              <p className="text-gray-600">
                Create a new appointment or schedule a follow-up visit.
              </p>
              <div className="card-actions justify-end mt-2">
                <button className="btn bg-secondary hover:bg-secondary/90 text-white border-0 btn-sm">
                  Schedule Now
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-xl border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300">
            <div className="card-body">
              <h2 className="card-title text-gray-800">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
                Manage Inventory
              </h2>
              <p className="text-gray-600">
                Check stock levels and order new supplies as needed.
              </p>
              <div className="card-actions justify-end mt-2">
                <button className="btn bg-primary hover:bg-primary/90 text-white border-0 btn-sm">
                  View Inventory
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-xl border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300">
            <div className="card-body">
              <h2 className="card-title text-gray-800">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-secondary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                  </svg>
                </div>
                Generate Reports
              </h2>
              <p className="text-gray-600">
                Create custom reports for visits, inventory, and personnel.
              </p>
              <div className="card-actions justify-end mt-2">
                <button className="btn bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0 btn-sm">
                  Create Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Section */}
        <div className="mt-6">
          <div className="alert bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-secondary shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h3 className="font-bold text-gray-800">New Update Available</h3>
              <div className="text-xs text-gray-600">
                System update v2.0.4 is now available. View the changelog for
                details.
              </div>
            </div>
            <button className="btn btn-sm bg-secondary hover:bg-secondary/90 text-white border-0">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
