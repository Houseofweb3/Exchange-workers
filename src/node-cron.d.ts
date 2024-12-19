declare module 'node-cron' {
    interface ScheduledTask {
        start: () => this;
        stop: () => this;
        destroy: () => this;
        getStatus: () => 'scheduled' | 'running' | 'stopped';
    }

    interface ScheduleOptions {
        scheduled?: boolean;
        timezone?: string;
    }

    function schedule(
        cronExpression: string,
        func: () => void,
        options?: ScheduleOptions
    ): ScheduledTask;

    function validate(cronExpression: string): boolean;
}
