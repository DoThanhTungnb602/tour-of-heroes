import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, Input, forwardRef } from '@angular/core';
import { filter } from 'rxjs/operators';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [NzUploadModule, NzButtonComponent, NzIconModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css',
})
export default class UploadFileComponent {
  uploading = false;
  @Input() fileList!: NzUploadFile[];

  constructor(private http: HttpClient, private msg: NzMessageService) {}

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload(): void {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    // You can use any AJAX library you like
    const req = new HttpRequest(
      'POST',
      'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      formData,
      {
        // reportProgress: true
      }
    );
    this.http
      .request(req)
      .pipe(filter((e) => e instanceof HttpResponse))
      .subscribe(
        () => {
          this.uploading = false;
          this.fileList = [];
          this.msg.success('upload successfully.');
        },
        () => {
          this.uploading = false;
          this.msg.error('upload failed.');
        }
      );
  }
}
