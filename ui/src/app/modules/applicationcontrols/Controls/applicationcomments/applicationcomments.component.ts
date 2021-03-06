/* Schlumberger Private
Copyright 2018 Schlumberger.  All rights reserved in Schlumberger
authored and generated code (including the selection and arrangement of
the source code base regardless of the authorship of individual files),
but not including any copyright interest(s) owned by a third party
related to source code or object code authored or generated by
non-Schlumberger personnel.

This source code includes Schlumberger confidential and/or proprietary
information and may include Schlumberger trade secrets. Any use,
disclosure and/or reproduction is prohibited unless authorized in
writing. */
import {
  Component,
  OnInit,
  Input,
  Output,
  Renderer,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { Subject ,  merge ,  from ,  Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import {
  User,
  Message,
  SendMessageEvent,
  Action,
} from '@progress/kendo-angular-conversational-ui';
import { LoggerService } from 'src/app/base/service/logger.service';
import { BaseComponent } from 'src/app/base/component/base/base.component';
import { UserProfileViewModel } from 'src/app/base/models/userprofile';
import { UserprofileService } from 'src/app/base/userprofile/userprofile.service';
import {
  CustomComment,
  CustomSendMessageEvent,
} from './applicationcomments.model';

@Component({
  selector: 'app-fmp-applicationcomments',
  templateUrl: './applicationcomments.component.html',
  styleUrls: ['./applicationcomments.component.scss'],
})
export class ApplicationcommentsComponent extends BaseComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  public feed: Observable<CustomComment[]>;
  public currentUser: User;
  private local: Subject<any> = new Subject<CustomComment>();
  public parentId = 0;
  private parentMessage: string;
  public userProfileViewModel: UserProfileViewModel;
  public ele: any;

  @Input() allMessages: CustomComment[];
  @Input() isReplyEnabled: boolean;
  @Input() maxlength: string;
  @Input() bayName: string;
  @Output() commentMessage: EventEmitter<string> = new EventEmitter();
  @ViewChild('chat', { static: false }) private chat;
  constructor(
    _loggerService: LoggerService,
    private _userProfileService: UserprofileService,
    private renderer: Renderer,
  ) {
    super('ApplicationcommentsComponent', _loggerService);
    this.WriteDebugLog('ApplicationcommentsComponent => constructor');
    this.userProfileViewModel = new UserProfileViewModel(
      this._userProfileService.dataModel,
    );
    this.currentUser = {
      id: this.userProfileViewModel.data.user.ldapAlias,
      name: this.userProfileViewModel.data.user.ldapAlias,
    };
  }

  ngOnInit() {}

  ngOnChanges() {
    this.WriteDebugLog('ApplicationcommentsComponent => ngOnChanges');
    this.allMessages.sort(function(a, b) {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    this.feed = merge(from(this.allMessages), this.local).pipe(
      scan((a, c) => [...a, c], []),
    );
  }

  public sendMessage(e: CustomSendMessageEvent): void {
    const parentMessage = this.parentMessage ? this.parentMessage + '<br>' : '';
    if (e.message.text.trim().length > 0) {
      e.message.id = this.allMessages.length + 1;
      e.message.parentId = 0;
      e.message.parentMessage = '';
      e.message.bayName =
        this.bayName && this.bayName.length > 0 ? `- ${this.bayName}` : '';
      if (this.parentId > 0) {
        e.message.parentId = this.parentId;
        e.message.parentMessage = this.parentMessage;
      }
      this.parentId = 0;
      this.parentMessage = '';
      this.local.next(e.message);
      this.commentMessage.emit(parentMessage + e.message.text);
    }
  }
  public replyClick(message: CustomComment): void {
    this.parentId = message.id;
    this.parentMessage = message.text;
  }

  public cancelClick(): void {
    this.parentId = 0;
    this.parentMessage = '';
  }

  public onReplyMessageClick(parentId: string) {
    const x = document.querySelector('#navigate_' + parentId);
    if (x) {
      x.scrollIntoView();
    }
  }
  public ngAfterViewInit() {
    this.chat.messageInput.nativeElement.setAttribute(
      'maxLength',
      this.maxlength,
    );
  }
  ngOnDestroy() {
    this.allMessages = [];
  }
}
