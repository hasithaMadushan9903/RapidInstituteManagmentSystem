import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RapidSystemComponent } from './rapid-system/rapid-system.component';
import { ManageStudentComponent } from './manage-student/manage-student.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StepsModule } from 'primeng/steps';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ManageCourseComponent } from './manage-course/manage-course.component';
import { ManageHallComponent } from './manage-hall/manage-hall.component';
import {InputNumberModule} from 'primeng/inputnumber';
import {ConfirmationService, MessageService} from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ManageSubjectComponent } from './manage-subject/manage-subject.component';
import { ManageTeachersComponent } from './manage-teachers/manage-teachers.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ManageEnrolmentComponent } from './manage-enrolment/manage-enrolment.component';
import { ManageGradeComponent } from './manage-grade/manage-grade.component';
import { ManageClassFeeComponent } from './manage-class-fee/manage-class-fee.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ManageAttendanceComponent } from './manage-attendance/manage-attendance.component';
import { ToastModule } from 'primeng/toast';
import { ReciptTemplateComponent } from './recipt-template/recipt-template.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { CapitalizeEachWordDirective } from './directives/capitalize-each-word.directive';
import { AppIconsComponent } from './app-icons/app-icons.component';
import { ManageActionComponent } from './manage-action/manage-action.component';
import { ManagePrivilageComponent } from './manage-privilage/manage-privilage.component';
import { ManageOtherEmployeeComponent } from './manage-other-employee/manage-other-employee.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PasswordModule } from 'primeng/password';
import { ManageSalaryPaymentsComponent } from './manage-salary-payments/manage-salary-payments.component';
import { ChartModule } from 'primeng/chart';
import { TeacherPaymentRecpitTemplateComponent } from './teacher-payment-recpit-template/teacher-payment-recpit-template.component';
import { ManageNotificationComponent } from './manage-notification/manage-notification.component';
import { ManageLeaveComponent } from './manage-leave/manage-leave.component';
import { NumericDirective } from './directives/numeric.directive';
import { TwoDecimalNumericDirective } from './directives/two-decimal-numeric.directive';
import { UppercaseLettersDirective } from './directives/uppercase-letters.directive';
import { QuizzComponent } from './quizz/quizz.component';
import { ReportComponent } from './report/report.component';
import { AccordionModule } from 'primeng/accordion';
import { StudentQuizReportComponent } from './report/student-quiz-report/student-quiz-report.component';
import { TeacehrQuizReportComponent } from './report/teacehr-quiz-report/teacehr-quiz-report.component';
import { ManageQuizReportComponent } from './report/manage-quiz-report/manage-quiz-report.component';
import { IncomeReportComponent } from './report/income-report/income-report.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ExpencesReportComponent } from './report/expences-report/expences-report.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AttendanceReportComponent } from './report/attendance-report/attendance-report.component';
import { FrontDeskIncomeReportComponent } from './report/front-desk-income-report/front-desk-income-report.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './refund-policy/refund-policy.component';
import { ManageClassRecordingsComponent } from './manage-class-recordings/manage-class-recordings.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';

// import { LoginPageComponent } from './login-page/login-page.component';


@NgModule({
  declarations: [
    AppComponent,
    RapidSystemComponent,
    ManageStudentComponent,
    DashboardComponent,
    ManageCourseComponent,
    ManageHallComponent,
    ManageSubjectComponent,
    ManageTeachersComponent,
    ManageEnrolmentComponent,
    ManageGradeComponent,
    ManageClassFeeComponent,
    ManageAttendanceComponent,
    ReciptTemplateComponent,
    ManageRoleComponent,
    CapitalizeEachWordDirective,
    AppIconsComponent,
    ManageActionComponent,
    ManagePrivilageComponent,
    ManageOtherEmployeeComponent,
    LoginPageComponent,
    ManageSalaryPaymentsComponent,
    TeacherPaymentRecpitTemplateComponent,
    ManageNotificationComponent,
    ManageLeaveComponent,
    NumericDirective,
    TwoDecimalNumericDirective,
    UppercaseLettersDirective,
    QuizzComponent,
    ReportComponent,
    StudentQuizReportComponent,
    TeacehrQuizReportComponent,
    ManageQuizReportComponent,
    IncomeReportComponent,
    ExpencesReportComponent,
    AttendanceReportComponent,
    FrontDeskIncomeReportComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    RefundPolicyComponent,
    ManageClassRecordingsComponent,
    PaymentSuccessComponent,
    // LoginPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    BrowserAnimationsModule,
    StepsModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    NgbModule,
    TableModule,
    ToastModule,
    FileUploadModule,
    AccordionModule,
    HttpClientModule,
    CardModule,
    ImageCropperModule,
    CheckboxModule,
    ConfirmDialogModule,
    InputNumberModule,
    OverlayPanelModule,
    MessagesModule,
    MultiSelectModule,
    PasswordModule,
    ChartModule,
  ],
  providers: [ConfirmationService,MessageService,{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
