import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import FormComponent, { JsonFormData } from '../form/form.component';
import { DynamicFormService } from '../../services/dynamic-form.service';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, FormComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.css',
})
export default class DynamicFormComponent implements OnInit {
  private formService = inject(DynamicFormService);

  public formData!: JsonFormData;

  ngOnInit(): void {
    this.formService.getFormData().subscribe((data) => {
      this.formData = data;
    });
  }
}
