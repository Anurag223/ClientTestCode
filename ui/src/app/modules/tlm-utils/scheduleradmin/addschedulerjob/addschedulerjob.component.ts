import {
  Component, OnInit, OnDestroy, 
} from '@angular/core';

import { BaseComponent } from 'src/app/base/component/base/base.component';
import { LoggerService } from 'src/app/base/service/logger.service';
import { ScheduleradminService } from 'src/app/modules/tlm-utils/scheduleradmin/scheduleradmin.service';
import 'hammerjs';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fmp-addschedulerjob',
  templateUrl: './addschedulerjob.component.html',
  styleUrls: ['./addschedulerjob.component.scss']
})
export class AddschedulerjobComponent extends BaseComponent implements OnInit, OnDestroy {
  constructor(
    loggerService: LoggerService,
    public schedulerAdminService: ScheduleradminService,
    private route: ActivatedRoute,
    private router: Router)
      {
          super('AddschedulerjobComponent', loggerService);
      }   
      
      ngOnInit(): void {
      }

        createJob(cmms: string,cmmsThrottle: string, context: string,isIncremental: boolean,
          sites: string, strategy: string,cron: string, cronDescription: string, description: string,
           domainType: string,forceReplace: boolean,group: string,jobType: string,
          name: string, version: number):void{
            if(!this.validateString(name))
            {
              this.ToasterServiceInstace.ShowWarning('Please enter job name');
              return;
            }
      
            if(!this.validateString(cron))
            {
              this.ToasterServiceInstace.ShowWarning('Please enter cron');
              return;
            }
            if(!this.validateString(group))
            {
              this.ToasterServiceInstace.ShowWarning('Please enter group');
              return;
            }
            if(!this.validateString(strategy))
            {
              this.ToasterServiceInstace.ShowWarning('Please select strategy');
              return;
            }
            if(!this.validateString(sites))
            {
              this.ToasterServiceInstace.ShowWarning('Please enter sites');
              return;
            }
            if(!this.validateBool(isIncremental))
            {
              this.ToasterServiceInstace.ShowWarning('Please select is incremental');
              return;
            }
            if(!this.validateBool(forceReplace))
            {
              this.ToasterServiceInstace.ShowWarning('Please select force replace');
              return;
            }
          this.schedulerAdminService
        .addSchedulerJob(cmms,cmmsThrottle, context, isIncremental, sites, strategy,cron,
           cronDescription, description, domainType,forceReplace,group,jobType,
          name, version).subscribe(    
                result => { 
                    this.ToasterServiceInstace.ShowSuccess('Scheduler job added successfully');
                    this.RouterInstance.navigateByUrl('/scheduleradmin');
                  },
                    err => this.ToasterServiceInstace.ShowError('Create new scheduler job Failed for job ' + name),
                );  
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
      this.RouterInstance.navigateByUrl('/scheduleradmin');
    }

  ngOnDestroy() {
}

}

