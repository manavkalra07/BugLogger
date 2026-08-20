import { useEffect, useState } from "react";
import { getActivities } from "../../api/bugApi";

function ActivityTimeline({ bugId }) {
    const [activities, setActivities] = useState([]);

    async function fetchActivities() {
        try {
            const data = await getActivities(bugId);
            setActivities(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchActivities();
    }, [bugId]);

    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">
                Activity Timeline
            </h2>

            <div className="border rounded-xl divide-y">

                {activities.length === 0 ? (
                    <div className="p-5 text-slate-500">
                        No activity yet.
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="p-5"
                        >
                            <div className="font-medium">
                                {activity.name}
                            </div>

                            <div className="text-slate-600 mt-1">
                                {activity.action}
                            </div>

                            <div className="text-sm text-slate-400 mt-2">
                                {new Date(activity.created_at).toLocaleString()}
                            </div>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
}

export default ActivityTimeline;