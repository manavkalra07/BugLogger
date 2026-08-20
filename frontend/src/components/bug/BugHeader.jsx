import React from "react";

function BugHeader({ bug, onEdit, onDelete }) {
    return (
        <div className="flex justify-between items-start gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">
                    {bug.title}
                </h1>
                <span className="inline-block mt-4 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
                    {bug.status}
                </span>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onEdit}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                >
                    Edit
                </button>

                <button
                    onClick={onDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default BugHeader;
