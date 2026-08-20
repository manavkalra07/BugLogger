import React from "react";

function BugDescription({ bug }) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-3">
                Description
            </h2>

            <p className="text-slate-600 leading-7">
                {bug.description}
            </p>

            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-3">
                    Steps to Reproduce
                </h2>

                <div className="bg-slate-50 border rounded-xl p-4">
                    <p className="text-slate-600 whitespace-pre-line">
                        {bug.reproduce_steps || "No steps provided."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default BugDescription;
