import { Component, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DynamicFormService } from '../../services/dynamic-form.service';
import { JsonFormData } from '../../dynamic-form/form/form.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import UploadFileComponent from '../../dynamic-form/upload-file/upload-file.component';

@Component({
  selector: 'app-form-layout-setup',
  standalone: true,
  imports: [
    CommonModule,
    DragulaModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzRadioModule,
    NzSelectModule,
    NzUploadModule,
    NzModalModule,
    NzIconModule,
    UploadFileComponent,
  ],
  templateUrl: './form-layout-setup.component.html',
  styleUrl: './form-layout-setup.component.css',
})
export default class FormLayoutSetupComponent {
  private formService = inject(DynamicFormService);

  public formData: JsonFormData | null = null;

  ngOnInit(): void {
    this.formService.getFormData().subscribe((data) => {
      this.formData = data;
      console.log('Form data: ', this.formData);
    });
  }
}
