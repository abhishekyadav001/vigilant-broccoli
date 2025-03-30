import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkflow } from "../../store/slices/workflowSlice";
import { ChartBarIcon, ClockIcon, UserIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function WorkflowDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentWorkflow, workflows } = useSelector((state) => state.workflow);

  useEffect(() => {
    const workflow = workflows.find((w) => w._id === id);
    if (workflow) {
      dispatch(setCurrentWorkflow(workflow));
    } else {
      toast.error("Workflow not found");
      navigate("/workflows");
    }
  }, [id, workflows, dispatch, navigate]);

  if (!currentWorkflow) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStepStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <button onClick={() => navigate("/workflows")} className="mr-4 text-gray-500 hover:text-gray-700">
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {currentWorkflow.name}
            </h2>
          </div>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <ChartBarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                  currentWorkflow.status
                )}`}
              >
                {currentWorkflow.status}
              </span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              Created {new Date(currentWorkflow.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              Created by {currentWorkflow.createdBy?.name || "Unknown"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Workflow Details</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {currentWorkflow.description || "No description provided"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Workflow Steps</h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {currentWorkflow.steps.map((step, index) => (
                  <li key={index} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-medium">{index + 1}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">{step.name}</h4>
                          <p className="text-sm text-gray-500">{step.description}</p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStepStatusColor(
                            step.status
                          )}`}
                        >
                          {step.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button type="button" onClick={() => navigate("/workflows")} className="btn-secondary">
            Back to Workflows
          </button>
          <button type="button" onClick={() => navigate(`/workflows/${id}/edit`)} className="btn-primary">
            Edit Workflow
          </button>
        </div>
      </div>
    </div>
  );
}
