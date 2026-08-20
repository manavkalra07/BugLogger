import { useNavigate } from "react-router-dom";

function BugCard({ bug }) {

    const navigate = useNavigate();

    function badgeColor(status) {

        if (status === "Open") {
            return "bg-red-100 text-red-700";
        }

        if (status === "In Progress") {
            return "bg-yellow-100 text-yellow-700";
        }

        if (status === "Resolved") {
            return "bg-green-100 text-green-700";
        }

        return "bg-slate-100 text-slate-700";

    }

    return (

        <div className="border rounded-2xl p-5 hover:shadow-md transition">

            <div className="flex justify-between items-start">

                <div>

                    <h2 className="text-xl font-semibold">

                        {bug.title}

                    </h2>

                    <p className="text-slate-500 mt-2">

                        {bug.description}

                    </p>

                </div>

                <span
                    className={`px-3 py-1 rounded-full text-sm ${badgeColor(bug.status)}`}
                >
                    {bug.status}
                </span>

            </div>

            <div className="mt-5 flex justify-end">

                <button
                    onClick={() => navigate(`/bugs/${bug.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    View Details
                </button>

            </div>

        </div>

    );

}

export default BugCard;