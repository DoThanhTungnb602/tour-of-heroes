import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  forwardRef,
  inject,
} from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';

import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {
  NzUploadComponent,
  NzUploadFile,
  NzUploadModule,
} from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PlusOutline } from '@ant-design/icons-angular/icons';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import UploadFileComponent from '../upload-file/upload-file.component';

interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: boolean;
  maxLength?: boolean;
  pattern?: string;
  nullValidator?: boolean;
}

interface JsonFormControlOptions {
  min?: string;
  max?: string;
  step?: string;
  icon?: string;
}

type ControlType =
  | 'text'
  | 'number'
  | 'password'
  | 'email'
  | 'search'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'checkbox'
  | 'date'
  | 'radio'
  | 'uploadImage'
  | 'uploadMultiImage'
  | 'uploadFiles'
  | 'select';

interface JsonFormControls {
  name: string;
  label: string;
  value: string;
  type: ControlType;
  options?: JsonFormControlOptions;
  radioOptions?: {
    label: string;
    value: string;
  }[];
  selectOptions?: {
    label: string;
    value: string;
  }[];
  required: boolean;
  validators: JsonFormValidators;
  fileList?: NzUploadFile[];
}

export interface JsonFormData {
  controls: JsonFormControls[];
  formLayout: 'horizontal' | 'vertical' | 'inline';
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NzUploadComponent),
      multi: true,
    },
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export default class FormComponent implements OnChanges {
  private formBuilder = inject(FormBuilder);
  private msg = inject(NzMessageService);

  @Input() formData!: JsonFormData;

  public form: FormGroup = this.formBuilder.group({});
  loading = false;
  avatarUrl?: string;
  fileList: NzUploadFile[] = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-xxx',
      percent: 50,
      name: 'image.png',
      status: 'uploading',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-5',
      name: 'image.png',
      status: 'error',
    },
  ];
  previewImage: string | undefined = '';
  previewVisible = false;

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['formData'].firstChange) {
      this.createForm(this.formData.controls);
    }
  }

  createForm(controls: JsonFormControls[]): void {
    for (const control of controls) {
      if (
        control.type === 'uploadImage' ||
        control.type === 'uploadMultiImage' ||
        control.type === 'uploadFiles'
      ) {
        continue;
      }
      const validators: ValidatorFn[] = [];

      for (const [key, value] of Object.entries(control.validators)) {
        switch (key) {
          case 'min':
            validators.push(Validators.min(value));
            break;
          case 'max':
            validators.push(Validators.max(value));
            break;
          case 'required':
            if (value) {
              validators.push(Validators.required);
            }
            break;
          case 'requiredTrue':
            if (value) {
              validators.push(Validators.requiredTrue);
            }
            break;
          case 'email':
            if (value) {
              validators.push(Validators.email);
            }
            break;
          case 'minLength':
            validators.push(Validators.minLength(value));
            break;
          case 'maxLength':
            validators.push(Validators.maxLength(value));
            break;
          case 'pattern':
            validators.push(Validators.pattern(value));
            break;
          case 'nullValidator':
            if (value) {
              validators.push(Validators.nullValidator);
            }
            break;
          default:
            break;
        }
      }

      this.form.addControl(
        control.name,
        this.formBuilder.control(control.value, validators)
      );
    }
  }

  beforeUpload = (
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  onSubmit(): void {
    console.log('Is form valid: ', this.form.valid);
    console.log('Form value: ', this.form.value);
  }

  constructor(private fb: NonNullableFormBuilder) {}
}
