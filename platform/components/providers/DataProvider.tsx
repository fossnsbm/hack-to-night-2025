'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getLeaderboard, getRecentActivity } from '@/actions/teams';

// Types for notifications and leaderboard updates
type Notification = {
  teamName: string;
  challengeTitle: string;
  points: number;
  timestamp: Date;
};

type LeaderboardTeam = {
  id: number;
  name: string;
  score: number;
  createdAt: Date;
};

// Context type
type DataContextType = {
  isUpdating: boolean; 
  notifications: Notification[];
  leaderboard: LeaderboardTeam[];
};

const initialContext: DataContextType = {
  isUpdating: false,
  notifications: [],
  leaderboard: [],
};

const DataContext = createContext<DataContextType>(initialContext);

export function useDataUpdates() {
  return useContext(DataContext);
}

type DataProviderProps = {
  children: ReactNode;
};

export function DataProvider({ children }: DataProviderProps) {
  const [isPolling, setIsPolling] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Function to fetch data
  const fetchUpdates = async () => {
    try {
      // Fetch leaderboard
      const leaderboardData = await getLeaderboard();
      if (leaderboardData?.length > 0) {
        setLeaderboard(leaderboardData);
      }

      // Fetch recent activity for notifications
      const activityData = await getRecentActivity(20);
      if (activityData?.length > 0) {
        // Check if we have new notifications since last update
        const newActivity = activityData.filter(activity => {
          const activityTime = new Date(activity.timestamp);
          return activityTime > lastUpdated;
        });

        // If new activity exists, add it to notifications
        if (newActivity.length > 0) {
          setNotifications(prev => {
            const combined = [...newActivity, ...prev];
            // Keep only the most recent 20 notifications
            return combined.slice(0, 20);
          });
          
          // Update last updated timestamp
          setLastUpdated(new Date());
        }
      }
      
      // Mark as polling actively
      setIsPolling(true);
    } catch (error) {
      console.error('Error polling for updates:', error);
      setIsPolling(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUpdates();
  }, []);

  // Set up polling interval
  useEffect(() => {
    // Poll every 10 seconds
    const pollInterval = setInterval(() => {
      fetchUpdates();
    }, 10000);

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  // Provide context value
  const value = {
    isUpdating: isPolling,
    notifications,
    leaderboard,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
} 