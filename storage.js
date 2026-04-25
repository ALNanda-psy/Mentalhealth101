const StorageService = {
    keys: {
        MORNING: 'sleep_diary_morning',
        NIGHT: 'sleep_diary_night'
    },

    saveMorningLog(data) {
        const logs = this.getMorningLogs();
        // Use date string as ID (YYYY-MM-DD format)
        const dateKey = new Date().toISOString().split('T')[0];
        logs[dateKey] = { ...data, timestamp: new Date().toISOString() };
        localStorage.setItem(this.keys.MORNING, JSON.stringify(logs));
        return true;
    },

    getMorningLogs() {
        const data = localStorage.getItem(this.keys.MORNING);
        return data ? JSON.parse(data) : {};
    },

    saveNightLog(data) {
        const logs = this.getNightLogs();
        const dateKey = new Date().toISOString().split('T')[0];
        logs[dateKey] = { ...data, timestamp: new Date().toISOString() };
        localStorage.setItem(this.keys.NIGHT, JSON.stringify(logs));
        return true;
    },

    getNightLogs() {
        const data = localStorage.getItem(this.keys.NIGHT);
        return data ? JSON.parse(data) : {};
    },

    getWeeklyData() {
        const morningLogs = this.getMorningLogs();
        const nightLogs = this.getNightLogs();
        
        // Generate last 7 days keys
        const weeklyData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            
            weeklyData.push({
                date: dateKey,
                dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
                morning: morningLogs[dateKey] || null,
                night: nightLogs[dateKey] || null
            });
        }
        
        return weeklyData;
    },
    
    // Seed some mock data for the weekly report if empty
    seedMockDataIfEmpty() {
        if (Object.keys(this.getMorningLogs()).length === 0) {
            const logs = {};
            const qualityOptions = ['very good', 'good', 'bad', 'very bad'];
            const feelingOptions = ['refreshed', 'groggy', 'alert', 'tired'];
            
            for (let i = 1; i <= 6; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateKey = d.toISOString().split('T')[0];
                logs[dateKey] = {
                    dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'long' }),
                    bedTime: "22:30",
                    sleepHours: (Math.random() * 3 + 5).toFixed(1), // 5-8 hours
                    fallAsleepMinutes: Math.floor(Math.random() * 40) + 10,
                    quality: qualityOptions[Math.floor(Math.random() * qualityOptions.length)],
                    feeling: feelingOptions[Math.floor(Math.random() * feelingOptions.length)],
                    awakenings: Math.floor(Math.random() * 3),
                    timestamp: d.toISOString()
                };
            }
            localStorage.setItem(this.keys.MORNING, JSON.stringify(logs));
        }
        
        if (Object.keys(this.getNightLogs()).length === 0) {
             const logs = {};
             for (let i = 1; i <= 6; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateKey = d.toISOString().split('T')[0];
                logs[dateKey] = {
                    caffeineMorning: Math.floor(Math.random() * 3),
                    caffeineAfternoon: Math.floor(Math.random() * 2),
                    caffeineEvening: 0,
                    exerciseMinutes: Math.floor(Math.random() * 60),
                    mood: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)]
                };
             }
             localStorage.setItem(this.keys.NIGHT, JSON.stringify(logs));
        }
    }
};

// Initialize with some mock data for the demo
StorageService.seedMockDataIfEmpty();
