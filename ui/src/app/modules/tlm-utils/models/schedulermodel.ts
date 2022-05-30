

export interface SchedulerJobContext{
    
        cmms: string,
        cmmsThrottle: string,
        context:string,
        forSites: string[],
        isIncremental: boolean,
        sites:string,
        strategy: string,
        cron: string,
        cronDescription: string,
        description: string,
        domainType: string,
        forceReplace: boolean,
        group: string,
        jobType: string,
        name: string,
        version: number
      
}

export interface SchedulerModel{
    jobContext: SchedulerJobContext[];
      status: string;
      lastRun: string;
      nextRun: string;
}

export interface AddSchedulerJobModel{
        id: string;
        jobContext: SchedulerJobContext;
          status: string;
          lastRun: string;
          nextRun: string;
          action: string;
    };