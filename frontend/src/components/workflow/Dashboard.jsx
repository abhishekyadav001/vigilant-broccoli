import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getWorkflows } from "../../store/slices/workflowSlice";
import { ChartBarIcon, DocumentTextIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { workflows, loading } = useSelector((state) => state.workflow);

  useEffect(() => {
    dispatch(getWorkflows());
  }, [dispatch]);

  const stats = [
    {
      name: "Total Workflows",
      value: workflows.length,
      icon: DocumentTextIcon,
      color: "bg-blue-500",
    },
    {
      name: "Active Workflows",
      value: workflows.filter((w) => w.status === "active").length,
      icon: ChartBarIcon,
      color: "bg-green-500",
    },
    {
      name: "Team Members",
      value: "5",
      icon: UserGroupIcon,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <Link
          to="/workflows/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Create Workflow
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${item.color}`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Workflows */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Workflows</h3>
        </div>
        <div className="border-t border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No workflows found</p>
              <Link
                to="/workflows/create"
                className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-500"
              >
                Create your first workflow
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {workflows.slice(0, 5).map((workflow) => (
                <li key={workflow._id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-primary-600 truncate">{workflow.name}</p>
                      <div className="ml-2 flex flex-shrink-0">
                        <p
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            workflow.status === "active"
                              ? "bg-green-100 text-green-800"
                              : workflow.status === "inactive"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {workflow.status}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold text-gray-500">
                        {new Date(workflow.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
