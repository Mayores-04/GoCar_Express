import { useState } from "react";

interface Activity {
  id: string;
  message: string;
  time: string;
}

const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/activities");
      const data = await response.json();

      if (data.success) {
        setActivities(data.activities);
      } else {
        setError("Failed to fetch activities.");
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Error fetching activities.");
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (message: string) => {
    setLoading(true);

    const now = new Date();  
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;  
    const philippinesOffsetInMs = 8 * 60 * 60 * 1000; 
    const philippinesTime = new Date(utcTime + philippinesOffsetInMs); // Philippines time
    
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(philippinesTime);

    const newActivity: Activity = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      time: formattedTime,
    };

    setActivities((prev) => [...prev, newActivity]);

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, time: formattedTime }),
      });

      const data = await response.json();

      if (data.success) {
        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === newActivity.id ? data.activity : activity
          )
        );
      } else {
        setError("Failed to save activity.");
      }
    } catch (err) {
      console.error("Error saving activity:", err);
      setError("Error saving activity.");
    } finally {
      setLoading(false);
    }
  };

  return { activities, addActivity, fetchActivities };
};

export default useActivities;
