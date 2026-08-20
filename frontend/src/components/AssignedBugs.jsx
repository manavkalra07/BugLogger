function AssignedBugs({ bugs }) {

    return (

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

            <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-semibold">

                    Assigned To Me

                </h2>

                <button className="text-blue-600 font-medium">

                    View All

                </button>

            </div>

            {
                bugs.length === 0 ?

                (

                    <p className="text-slate-500">

                        No assigned bugs.

                    </p>

                )

                :

                (

                    <div className="space-y-4">

                        {

                            bugs.map((bug) => (

                                <div
                                    key={bug.id}
                                    className="border rounded-xl p-4 hover:bg-slate-50 transition"
                                >

                                    <div className="flex items-center justify-between">

                                        <h3 className="font-semibold text-lg">

                                            {bug.title}

                                        </h3>

                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">

                                            {bug.status}

                                        </span>

                                    </div>

                                    <p className="text-slate-500 mt-2">

                                        {bug.description}

                                    </p>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}

export default AssignedBugs;