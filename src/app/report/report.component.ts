import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { courseWiseMonths } from '../shared/models/courseWiseMonthsVM';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AttemptService } from '../shared/services/attempt.service';
import { ReportTypeMappingService } from '../shared/services/report-type-mapping.service';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { reportTypesVM } from '../shared/models/ReportTypesVM';
import { PageWiseDataVM } from '../shared/models/pageWiseDataVM';
import { EnrolmentCourseService } from '../shared/services/enrolment-course.service';
import { EnrolmentCourseVM } from '../shared/models/enrolmentCourse';
import { CourseVM } from '../shared/models/coursesVM';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { CourseService } from '../shared/services/course.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit,OnDestroy{

  private subs = new SubSink();
  date = new Date;
  janFirst = new Date(new Date().getFullYear(), 0, 1);
  courseWiseMonths : courseWiseMonths[]=[]
  userCode : string = ''
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];
  userRoleId : number = 0
  reportForm !: FormGroup
  activeTypeIndex: number | undefined;
  reportTypes : reportTypesVM[]=[];
  selectedReportType : reportTypesVM | undefined
  isGetPDFClicked : boolean = false
  allEnrolmentCourses : EnrolmentCourseVM[] = [];
  dropdownCourses : CourseVM[] = [];
  selectedCourses : CourseVM[] = []; 
  selectedYear = new Date;
  allCourses : CourseVM[]=[]


  get getCourse(): AbstractControl { return this.reportForm.get('course') as AbstractControl; }
  get getYear(): AbstractControl { return this.reportForm.get('year') as AbstractControl; }
  get getMonth(): AbstractControl { return this.reportForm.get('month') as AbstractControl; }
  get getYearIncome(): AbstractControl { return this.reportForm.get('yearIncome') as AbstractControl; }
  get getSingleCourse(): AbstractControl { return this.reportForm.get('singleCourse') as AbstractControl; }

  constructor(
      private attemptService : AttemptService,
      private formBuilder: FormBuilder,
      private enrolmentCourseService : EnrolmentCourseService,
      private courseService : CourseService,
      private reportTypeMappingService : ReportTypeMappingService,
      private localStorageService : LocalStorageService,
  ){}


  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  ngOnInit(): void {
    this.buildForm()
    this.getLoginData()
    this.subscription()
  }
  
  buildForm(){
    this.reportForm = this.formBuilder.group({
      course :[null],
      year : [null],
      yearIncome : [this.date],
      month : [null],
      singleCourse:[null]
    })

  }

  subscription(){
    this.formSubscription()
    this.reportTypeMappingService.getReportsUnderRole(this.userRoleId).subscribe(data =>{
      if(data && data.content){
        data.content.forEach(element => {
          this.reportTypes.push(element.reportTypes);
        });
        
      }
    })
  }

  formSubscription(){
    this.subs.sink = this.getCourse.valueChanges.subscribe(data => {
      if(data){
        this.selectedCourses = this.getCourse.value;
      }
    })

    this.subs.sink = this.getSingleCourse.valueChanges.subscribe(data =>{
      if(data){
        this.selectedCourses.push(this.getSingleCourse.value)
      }
    })
  }

  getLoginData(){
    let loginData : any = this.localStorageService.getItem('login');
    this.logedDetails = JSON.parse(loginData)
    this.userCode = this.logedDetails?.usercode ? this.logedDetails?.usercode : ''
    
    switch(this.userCode[0]){
      case 'S' : 
        this.userRoleId = 1
        break;
      case 'F' :
        this.userRoleId = 2
        break;
      case 'A' :
        this.userRoleId = 5
        break;
      case 'T' :
        this.userRoleId = 4
        break;
      case 'M' :
        this.userRoleId = 3
        break;
    }

    
    this.privilages = this.logedDetails?.privilagesDTO ? this.logedDetails?.privilagesDTO : [];
  }

  onAccordionOpen(event : any){
    this.selectedReportType = this.reportTypes[event.index]
    if(this.logedDetails && this.logedDetails.usercode && this.logedDetails.usercode.startsWith('S')){
      this.getEnrolmentCourses()
    }else if(this.logedDetails && this.logedDetails.usercode && this.logedDetails.usercode.startsWith('F')){
      this.getAllCourses()
    }
    
  }

  getAllCourses(){
    this.courseService.getCourses().subscribe(data =>{
      if(data && data.content){
        this.allCourses = data.content
      }
    })
  }

  filterByCourse(){
    this.selectedCourses = this.getCourse.value;
  }

  filterByOneCourse(){
    this.selectedCourses.push(this.getSingleCourse.value)
  }

  filterByYear(){
    this.selectedYear = this.getYear.value
  }
  
  generatePDF():any{
    this.isGetPDFClicked = true;
  }

  getIsGetPDFClicked(event : boolean){
    this.isGetPDFClicked = event;
  }

  getEnrolmentCourses(){
    this.enrolmentCourseService.getEnrolmentCourse().subscribe(data =>{
      if(data){
        this.allEnrolmentCourses = data.content;
        this.getCourses()
      }
    })
  }

  filterByYearForIncomeReport(){
    let year = this.getYearIncome.value.getFullYear();
  }

  filterByMonthrForIncomeReport(){
    let month = this.getMonth.value.getMonth();
  }

  getCourses(){
    this.dropdownCourses = [];
    this.getCourse.reset();
    let studentWiseEnrolmentCourses : EnrolmentCourseVM[] = [];
    studentWiseEnrolmentCourses = this.allEnrolmentCourses.filter(el => el.enrolment?.student?.scode === this.logedDetails?.usercode && el.isActive == true)

    
    studentWiseEnrolmentCourses.forEach(element => {
      if(element && element.course){
        this.dropdownCourses.push(element.course)
      }
    });

  }

}
