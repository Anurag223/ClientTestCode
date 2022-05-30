import { SafeHtmlPipe } from './safe-html.pipe';
import { DomSanitizer, BrowserModule} from '@angular/platform-browser';
import { inject, TestBed } from '@angular/core/testing';
describe('SafeHtmlPipe', () => {
  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserModule
        ]
      });
  });
  it('create an instance',  inject([DomSanitizer],(DomSanitizer) => {
    const pipe = new SafeHtmlPipe(DomSanitizer);
    expect(pipe).toBeTruthy();
  }));
});
