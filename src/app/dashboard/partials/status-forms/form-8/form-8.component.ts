import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidationService } from '../../../../helpers/service/form-validation.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../project/service/project.service';

@Component({
  selector: 'app-form-8',
  templateUrl: './form-8.component.html',
  styleUrl: './form-8.component.css',
})
export class Form8Component implements OnInit, OnChanges {
  @Input() isRefreshDataInput!: number;

  FormGroupData!: FormGroup;
  installationFileToUpload: File | null = null;
  installationStatus = [
    {
      status: 1,
      statusName: 'Unloading',
      isStarted: true,
      completed: 0,
    },
    {
      status: 2,
      statusName: 'Caracus Assembly',
      isStarted: false,
      completed: 0,
    },
    {
      status: 3,
      statusName: 'Accessories Installation',
      isStarted: false,
      completed: 0,
    },
    {
      status: 4,
      statusName: 'Shutter Fitting',
      isStarted: false,
      completed: 0,
    },
    {
      status: 5,
      statusName: 'Cleaning',
      isStarted: false,
      completed: 0,
    },
    {
      status: 6,
      statusName: 'Client Signature',
      isStarted: false,
      completed: 0,
    },
  ];

  WagesAdded = [
    {
      empName: '',
      perHourWage: 0,
      totalHour: 0,
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private _FormValidationService: FormValidationService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private _ProjectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.FormGroupData = this.formBuilder.group({
      // file: [''],
      dayWorkNote: ['', [Validators.required]],
      inCharge: ['', [Validators.required]],
      serviceAfter: ['', [Validators.required]],
    });

    // Take the Project Data
    const { id } = this.route.snapshot.queryParams;
    this._ProjectService.getProjectById(id).subscribe((res) => {
      const { installationData } = res.data;

      if (installationData) {
        this.FormGroupData.patchValue({
          inCharge: installationData.inCharge,
          serviceAfter: installationData.serviceAfter,
        });

        for (let i = 1; i <= this.installationStatus.length; i++) {
          this.installationStatus[i - 1].completed =
            installationData.installationStatus[i].percentCompleted;
          this.installationStatus[i - 1].isStarted =
            installationData.installationStatus[i].isStarted;
        }

        const savedWages: any[] = [];

        installationData.workersData.forEach((el: any) => {
          savedWages.push({
            empName: el.name,
            perHourWage: el.perHourWage,
            totalHour: el.hours,
          });
        });

        this.WagesAdded = savedWages;
      }
    });
  }

  ngOnChanges(changes: any): void {
    if (changes.isRefreshDataInput) {
      this.ngOnInit();
    }
  }

  // Validate File size on Add file
  validateFileSize(event: Event) {
    // Check the File size more the 5mb and if true
    const { files } = event.target as HTMLInputElement;

    if (files) {
      // Check the is File
      if (!this._FormValidationService.isValidImagePdfFileType(files)) {
        this.FormGroupData.patchValue({
          file: '',
        });

        this.FormGroupData.controls['file'].setErrors({
          invalidFile: true,
        });

        return;
      }

      // Check the File size
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      const selectFile = files[0];

      if (selectFile?.size > maxSize) {
        this.FormGroupData.patchValue({
          file: '',
        });

        this.FormGroupData.controls['file'].setErrors({
          maxSize: true,
        });
        return;
      }

      this.installationFileToUpload = files[0];
    }
  }

  // Change the range option and change the starter
  onChangeTheRange(event: any, status: number) {
    const { value } = event.target;
    let isValid = true;

    if (status > 1) {
      for (let i = 0; i < status - 1; i++) {
        if (
          !this.installationStatus[i].isStarted ||
          this.installationStatus[i].completed !== 100 ||
          this.installationStatus[i].completed < value
        ) {
          isValid = false;

          break;
        }
      }
    }

    // Check Others are Completed
    if (isValid) {
      this.installationStatus[status].isStarted = true;
    }
  }

  // Get the total values
  get getGrossTotalValue() {
    let result = 0;

    this.WagesAdded.forEach((el) => {
      const subTotal = el.perHourWage * el.totalHour;

      result += subTotal;
    });

    return result;
  }

  // Remove the data from the Selected array
  removeWages(index: number) {
    if (this.WagesAdded.length > 1) {
      this.WagesAdded.splice(index, 1);
    }
  }

  // Check the Values are fully Valid
  validateTheSelectedMaterial() {
    let isValid = true;

    this.WagesAdded.forEach((el) => {
      if (!el.empName || el.perHourWage < 1 || el.totalHour < 1) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Add the Wages to the selected array
  addWagesSection() {
    if (this.validateTheSelectedMaterial()) {
      this.WagesAdded.push({
        empName: '',
        perHourWage: 0,
        totalHour: 0,
      });
    } else {
      this.toastr.error('Please Fill the Wages table completly ..!', 'Error');
    }
  }

  formSubmit(type: string) {
    // Check the form validation is complete
    if (this.FormGroupData.invalid) {
      this.FormGroupData.markAllAsTouched();
      return;
    }

    if (type === 'APPROVE') {
      let isAllStatusComplete = true;

      this.installationStatus.forEach((el) => {
        if (el.completed < 100) {
          isAllStatusComplete = false;
        }
      });

      if (!isAllStatusComplete) {
        this.toastr.error('Fill all production 100%', 'Error');
        return;
      }
    }

    const { dayWorkNote, inCharge, serviceAfter } = this.FormGroupData.controls;

    const object: any = {
      isApproved: type === 'SUBMIT' ? false : true,
      inCharge: inCharge.value,
      serviceAfter: serviceAfter.value,
      installationStatus: null,
      dayWorkNote: dayWorkNote.value,
      workersData: [],
    };

    this.WagesAdded.forEach((el) => {
      object.workersData.push({
        name: el.empName,
        hours: el.totalHour,
        perHourWage: el.perHourWage,
        subTotal: Number(el.perHourWage * el.totalHour),
      });
    });

    // Set installtion Status
    const installationStatus: any = {};

    this.installationStatus.forEach((el) => {
      installationStatus[el.status] = {
        percentCompleted: el.completed,
        isStarted: el.isStarted,
      };
    });

    object.installationStatus = installationStatus;

    // Take the Project ID form the query params
    const { id } = this.route.snapshot.queryParams;

    // Send the APi for change the Status or submit
    this._ProjectService.approveStatusInstallation(object, id).subscribe({
      next: () => {
        this.toastr.success('Successfully update project status', 'Success');
        this._ProjectService.$ProjectNavigateDataTransfer.emit();
      },
      error: (err) => {
        this.toastr.error(err.error.message, 'Error');
      },
    });
  }
}
