import {
  Component, OnInit, OnDestroy, 
} from '@angular/core';

import { BaseComponent } from 'src/app/base/component/base/base.component';
import { LoggerService } from 'src/app/base/service/logger.service';
import { ScheduleradminService } from 'src/app/modules/tlm-utils/scheduleradmin/scheduleradmin.service';
import { SchedulerJobContext, AddSchedulerJobModel } from 'src/app/modules/tlm-utils/models/schedulermodel';
import 'hammerjs';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fmp-updateschedulerjob',
  templateUrl: './updateschedulerjob.component.html',
  styleUrls: ['./updateschedulerjob.component.scss']
})
export class UpdateschedulerjobComponent  extends BaseComponent implements OnInit, OnDestroy {
  schedulerjobData:AddSchedulerJobModel;
  action:string;
  constructor(loggerService: LoggerService,
    public schedulerAdminService: ScheduleradminService,
    private route: ActivatedRoute,
    private router: Router) 
    { 
      super('UpdateschedulerjobComponent', loggerService);
    }

    ngOnInit(): void {
      this.schedulerjobData=history.state;      
    }

      createJob(jobData:AddSchedulerJobModel):void{
        if(!this.validateString(jobData.jobContext.name))
        {
          this.ToasterServiceInstace.ShowWarning('Please enter job name');
          return;
        }
  
        if(!this.validateString(jobData.jobContext.cron))
        {
          this.ToasterServiceInstace.ShowWarning('Please enter cron');
          return;
        }
        if(!this.validateString(jobData.jobContext.group))
        {
          this.ToasterServiceInstace.ShowWarning('Please enter group');
          return;
        }
        if(!this.validateString(jobData.jobContext.strategy))
        {
          this.ToasterServiceInstace.ShowWarning('Please select strategy');
          return;
        }
        if(!this.validateString(jobData.jobContext.sites))
        {
          this.ToasterServiceInstace.ShowWarning('Please enter sites');
          return;
        }
        if(!this.validateBool(jobData.jobContext.isIncremental))
        {
          this.ToasterServiceInstace.ShowWarning('Please select is incremental');
          return;
        }
        if(!this.validateBool(jobData.jobContext.forceReplace))
        {
          this.ToasterServiceInstace.ShowWarning('Please select force replace');
          return;
        }
      this.schedulerAdminService
                .copySchedulerJob(jobData).subscribe(    
              result => { 
                  this.ToasterServiceInstace.ShowSuccess('Scheduler job added successfully');
                  this.RouterInstance.navigateByUrl('/scheduleradmin');
                },
                  err => this.ToasterServiceInstace.ShowError('Create new scheduler job Failed for job ' + jobData.jobContext.name),
              );  
  }

  updateJob(jobData:AddSchedulerJobModel):void{
    if(!this.validateString(jobData.jobContext.name))
      {
        this.ToasterServiceInstace.ShowWarning('Please enter job name');
        return;
      }

      if(!this.validateString(jobData.jobContext.cron))
      {
        this.ToasterServiceInstace.ShowWarning('Please enter cron');
        return;
      }
      if(!this.validateString(jobData.jobContext.group))
      {
        this.ToasterServiceInstace.ShowWarning('Please enter group');
        return;
      }
      if(!this.validateString(jobData.jobContext.strategy))
      {
        this.ToasterServiceInstace.ShowWarning('Please select strategy');
        return;
      }
      if(!this.validateString(jobData.jobContext.sites))
      {
        this.ToasterServiceInstace.ShowWarning('Please enter sites');
        return;
      }
      if(!this.validateBool(jobData.jobContext.isIncremental))
      {
        this.ToasterServiceInstace.ShowWarning('Please select is incremental');
        return;
      }
      if(!this.validateBool(jobData.jobContext.forceReplace))
      {
        this.ToasterServiceInstace.ShowWarning('Please select force replace');
        return;
      }
            this.schedulerAdminService.updateSchedulerJob(jobData).subscribe(success => {
              if (success) {
                this.ToasterServiceInstace.ShowSuccess('Scheduler job updated successfully');
                this.RouterInstance.navigateByUrl('/scheduleradmin');
              } else {
                this.ToasterServiceInstace.ShowWarning('Scheduler job has not changed.');
              }
            }, err => {
              this.WriteErrorLog('Scheduler job update failed.', err);
              this.ToasterServiceInstace.ShowError('Update scheduler job Failed for job ' + jobData.jobContext.name);
            });

}

validateBool(boolInput: boolean):boolean{
  if(String(boolInput) != "true" && String(boolInput) != "false")
  {
    return false;
  }
  else
  {
    return true;
  }
}

validateString(stringInput: string):boolean{
  if(stringInput == null || stringInput =='' || stringInput == undefined)
      {
        return false;
      }
      else
      {
        return true;
      }
}

  cancel(): void {
    this.schedulerjobData = null;    
    this.RouterInstance.navigateByUrl('/scheduleradmin');
  }

  ngOnDestroy() {
    this.schedulerjobData = null;
}
}
