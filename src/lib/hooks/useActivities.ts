import { useState } from "react";

interface Activity {
  id: string;
  message: string;
  time: string;
}

const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/activities");
      const data = await response.json();

      if (data.success) {
        setActivities(data.activities);
      } else {
        setError("Failed to fetch activities.");
      }
    } catch (err) {
      setError("Error fetching activities.");
    }
  };

  const addActivity = async (message: string) => {
    setLoading(true);
  
    // Get the current date and convert it to Philippine Time (PHT, UTC +8)
    const philippinesTime = new Date();
    const philippinesOffset = 8 * 60; // Philippines is UTC +8 hours
    const localTime = new Date(
      philippinesTime.getTime() + philippinesOffset * 60 * 1000
    );
  
    // Format the time to show in the desired format (e.g., hh:mm AM/PM)
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(localTime);
  
    // Optimistically add the new activity to the UI first
    const newActivity: Activity = {
      id: `${Date.now()}-${Math.random()}`, // Use Date.now() and Math.random() for unique id
      message,
      time: formattedTime, // Use the correctly formatted time
    };
  
    setActivities((prev) => [...prev, newActivity]);
  
    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, time: formattedTime }), // Send formatted time to the database
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
      setError("Error saving activity.");
    } finally {
      setLoading(false);
    }
  };

  return { activities, addActivity, fetchActivities, loading, error };
};

export default useActivities;