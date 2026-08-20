function StatsCard({ title, value }) {

    return (

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

            <p className="text-slate-500 text-sm">

                {title}

            </p>

            <h2 className="mt-3 text-4xl font-bold text-slate-800">

                {value}

            </h2>

        </div>

    );

}

export default StatsCard;