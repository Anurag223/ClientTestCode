import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { FMPHelper } from 'src/Constants/helpers';
import { LoggerService } from 'src/app/base/service/logger.service';
import { BaseComponent } from 'src/app/base/component/base/base.component';


@Component({
  selector: 'lasfile-upload',
  templateUrl: './lasfileupload.component.html',
  styleUrls: ['./lasfileupload.component.scss']
})
export class LasFileUploadComponent extends BaseComponent implements OnInit {
  public progress: number;
  public message: string;
  @Output() public onUploadFinished = new EventEmitter();

    constructor(
        private http: HttpClient,
           loggerService: LoggerService) {
        super('ProgressPanelComponent', loggerService);
    }

  ngOnInit() {
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
      const url = `${FMPHelper.ApplicationSettings.ehcAvatarAPI}/UploadLasFile`;
      this.http.post(url , formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
     
              this.progress = Math.round(100 * event.loaded / event.total);
          }
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
              this.onUploadFinished.emit(event.body);
              this.progress = null;
              this.message = null;
              this.ToasterServiceInstace.ShowInformation('Las file uploaded successfully');
        }
      });
  }
  
  // public uploadFile = (files) => {
  //   if (files.length === 0) {
  //     return;
  //   }

  //   let filesToUpload : File[] = files;
  //   const formData = new FormData();
    
  //   Array.from(filesToUpload).map((file, index) => {
  //     return formData.append('file'+index, file, file.name);
  //   });

  //   this.http.post('https://localhost:5001/api/upload', formData, {reportProgress: true, observe: 'events'})
  //     .subscribe(event => {
  //       if (event.type === HttpEventType.UploadProgress)
  //         this.progress = Math.round(100 * event.loaded / event.total);
  //       else if (event.type === HttpEventType.Response) {
  //         this.message = 'Upload success.';
  //         this.onUploadFinished.emit(event.body);
  //       }
  //     });
  // }
}
