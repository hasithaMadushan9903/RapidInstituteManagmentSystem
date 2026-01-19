import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { AdAccountServiceService } from '../shared/services/ad-account-service.service';
import { ADAccountVM } from '../shared/models/adAccountVM';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { MessageService } from 'primeng/api';
import { ParentService } from '../shared/services/parent.service';
import { parentVM } from '../shared/models/parentVM';
import { addressVM } from '../shared/models/addressVM';
import { studentVM } from '../shared/models/studentVM';
import { StudentService } from '../shared/services/student.service';
import { roleVM } from '../shared/models/roleVM';
import { CourseVM } from '../shared/models/coursesVM';
import { EnrolmentVM } from '../shared/models/enrolmentVM';
import { EnrolmentCourseVM } from '../shared/models/enrolmentCourse';
import { EnrolmentService } from '../shared/services/enrolment.service';
import { ClassFeeVM } from '../shared/models/classFeeVM';
import { ClassFeeCourseVM } from '../shared/models/classFeeCourseVM';
import { MonthVM } from '../shared/models/monthVM';
import { courseWiseMonths } from '../shared/models/courseWiseMonthsVM';
import { ClassFeeService } from '../shared/services/class-fee.service';
import { reciptTemplateDataVM } from '../shared/models/reciptTemplateDataVM';
import { GradeService } from '../shared/services/grade.service';
import { GradeVM } from '../shared/models/gradeVM';
import { SubjectVM } from '../shared/models/subjectVM';
import { EnrolmentCourseService } from '../shared/services/enrolment-course.service';
import { MonthService } from '../shared/services/month.service';
import { RoleService } from '../shared/services/role.service';
import { teacherVM } from '../shared/models/teachersVM';
import { CourseService } from '../shared/services/course.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  today = new Date();
  months : MonthVM[] = [];
  maxDate !: Date;
  isloading : boolean = false;
  studentDetailForm !: FormGroup;
  parentDetailForm !: FormGroup;
  classFeeForm !: FormGroup;
  parentSearchForm !:FormGroup;
  loginForm !: FormGroup;
  enrollmentForm !: FormGroup;
  payingMethodForm !: FormGroup
  cardDetailsForm !: FormGroup;
  logedDetails : loginDetailsVM | undefined;
  isStudentFormVisible : boolean = false;
  isSearchParent : boolean = false;
  courses : CourseVM[] = [];
  studentTableData : studentVM[] = [];
  studentAllData : studentVM[] = [];
  courseTimes : string[] = [];
  courseDates : string[] = [];
  instructors : teacherVM[]=[]
  enrolledCourses : CourseVM[] = [];
  grades : GradeVM[]= [];
  subjects : SubjectVM[] = [];
  activeStepIndex : number =0;
  total : number =0;
  enrollments : EnrolmentVM = {};
  adAccountDetails : ADAccountVM = {};
  searchedParent : parentVM | undefined;
  proceedClassFeePayment : ClassFeeVM | undefined;
  reciptTemplateData : reciptTemplateDataVM | undefined;
  isASearchedParent : boolean = false;
  istacLoaded : boolean = false
  isprivacyLoaded : boolean = false
  isRefundLoaded : boolean = false
  allEnrolmentCourses : EnrolmentCourseVM[]=[];
  role : roleVM|undefined
  student : studentVM | undefined;
  addmisionFee : number = 1500;
  relationships : any[] = [{name:'Mother'},{name:'Father'},{name:'Sister'},{name:'Brother'},{name:'Grand Mother'},{name:'Grand Father'},{name:'Aunty'},{name:'Uncle'},{name:'Gardian'}]; 
  dates : any[] = [{date:"Monday"},{date:"Tuesday"},{date:"Wednesday"},{date:"Thursday"},{date:"Friday"},{date:"Saturday"},{date:"Sunday"}]

  steps = [
    { label: 'Student Form' },
    { label: 'Parant Form'},
    { label: 'Student Enrolment'},
    { label: 'Student Payment'},
    { label: 'Recipt'},
    { label: 'Login Details'}
  ];


  @Output() isLogginSuccess = new EventEmitter<boolean>();

  get getLoginUserCode(): AbstractControl { return this.loginForm.get('userName') as AbstractControl; }
  get getLoginPassword(): AbstractControl { return this.loginForm.get('password') as AbstractControl; }

  //form controllers for the student detail form
  get getStudentFullName(): AbstractControl { return this.studentDetailForm.get('fullName') as AbstractControl; }
  get getStudentContactNumber(): AbstractControl { return this.studentDetailForm.get('contactNumber') as AbstractControl; }
  get getStudentBirthday(): AbstractControl { return this.studentDetailForm.get('birthday') as AbstractControl; }
  get getStudentGender(): AbstractControl { return this.studentDetailForm.get('gender') as AbstractControl; }
  get getStudenthouseNo(): AbstractControl { return this.studentDetailForm.get('houseNo') as AbstractControl; }
  get getStudentDistrict(): AbstractControl { return this.studentDetailForm.get('district') as AbstractControl; }
  get getStudentLane(): AbstractControl { return this.studentDetailForm.get('lane') as AbstractControl; }
  get getStudentCity(): AbstractControl { return this.studentDetailForm.get('city') as AbstractControl; }
  get getStudentCallingName(): AbstractControl { return this.studentDetailForm.get('callingName') as AbstractControl; }
  get getStudentSchool(): AbstractControl { return this.studentDetailForm.get('school') as AbstractControl; }
  get getStudentEmail(): AbstractControl { return this.studentDetailForm.get('email') as AbstractControl; }

  get getParentFullName(): AbstractControl { return this.parentDetailForm.get('fullName') as AbstractControl; }
  get getParentTitle(): AbstractControl { return this.parentDetailForm.get('title') as AbstractControl; }
  get getParentNIC(): AbstractControl { return this.parentDetailForm.get('NIC') as AbstractControl; }
  get getParentBirthaday(): AbstractControl { return this.parentDetailForm.get('birthday') as AbstractControl; }
  get getParentRelationship(): AbstractControl { return this.parentDetailForm.get('relationship') as AbstractControl; }
  get getParentOccupation(): AbstractControl { return this.parentDetailForm.get('occupation') as AbstractControl; }
  get getParentContactNumber(): AbstractControl { return this.parentDetailForm.get('contactNumber') as AbstractControl; }
  get getParentEmail(): AbstractControl { return this.parentDetailForm.get('email') as AbstractControl; }

  get getFirstFourDigit(): AbstractControl { return this.cardDetailsForm.get('firstFourDigit') as AbstractControl; }
  get getSecondFourDigit(): AbstractControl { return this.cardDetailsForm.get('secondFourDigit') as AbstractControl; }
  get getThirdFourDigit(): AbstractControl { return this.cardDetailsForm.get('thirdhFourDigit') as AbstractControl; }
  get getFourthFourDigit(): AbstractControl { return this.cardDetailsForm.get('fourthFourDigit') as AbstractControl; }
  get getExpirDate(): AbstractControl { return this.cardDetailsForm.get('expirDate') as AbstractControl; }
  get getCVC(): AbstractControl { return this.cardDetailsForm.get('CVC') as AbstractControl; }

    //form controllers for the enrolments
  get getTheGrade(): AbstractControl { return this.enrollmentForm.get('grade') as AbstractControl; }
  get getTheSubject(): AbstractControl { return this.enrollmentForm.get('subject') as AbstractControl; }
  get getTheInstructor(): AbstractControl { return this.enrollmentForm.get('instructor') as AbstractControl; }
  get getTheTime(): AbstractControl { return this.enrollmentForm.get('time') as AbstractControl; }
  get getTheDate(): AbstractControl { return this.enrollmentForm.get('date') as AbstractControl; }

  //form controllers for the parent search form
  get getNicNo(): AbstractControl { return this.parentSearchForm.get('nicNo') as AbstractControl; }

  get getHasPaymentDone(): AbstractControl { return this.classFeeForm.get('hasPaymentDone') as AbstractControl; }

  get getPayingMethod(): AbstractControl { return this.payingMethodForm.get('method') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private adAccountService : AdAccountServiceService,
    private localStorageService : LocalStorageService,
    private messageService: MessageService,
    private gradeServise : GradeService,
    private parentService : ParentService,
    private studentServices : StudentService,
    private courseServices : CourseService,
    private enrolmentService : EnrolmentService,
    private classFeeService : ClassFeeService,
    private enrolmentCoursesService : EnrolmentCourseService,
    private monthService : MonthService,
    private roleService : RoleService,
  ){
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 5);
  }


  ngOnInit(): void {
    this.buildForms()
    this.getCourses()
    // this.getEmployee()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  buildForms(){
    this.loginForm = this.formBuilder.group({
      userName : ['',Validators.required],
      password : ['',Validators.required]

    })

    this.studentDetailForm = this.formBuilder.group({
      fullName : ['', [Validators.required,Validators.pattern(/^(?!.*\d)(\b\w+\b[\s]+){1,}\b\w+\b$/)]],
      contactNumber : ['' , [Validators.required, Validators.pattern(/^([0][7][01245678][0-9]{7})|([\\+][9][4][7][01245678][0-9]{7})|([0][1-9][1-9][0-9]{7})$/)]],
      birthday : ['' , Validators.required],
      gender : ['', Validators.required],
      houseNo:['', Validators.required],
      lane:[''],
      city:['',Validators.required],
      district : ['',Validators.required],
      callingName:['',[Validators.required,Validators.pattern(/^[A-Za-z]+$/)]],
      school:['',[Validators.required,Validators.pattern(/^(?!.*\d)(\b\w+\b[\s]+){1,}\b\w+\b$/)]],
      email : ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
    });

    this.parentDetailForm = this.formBuilder.group({
      fullName:['',[Validators.required,Validators.pattern(/^(?!.*\d)(\b\w+\b[\s]+){1,}\b\w+\b$/)]],
      title:['',[Validators.required,Validators.pattern(/^[A-Za-z]{1,4}$/)]],
      NIC:[{value : '',disabled:true},[Validators.required, Validators.pattern(/^([1][9][0-9]{10})|([2][0][0-9]{10})|([0-9]{9}[V])$/)]],
      birthday:['',Validators.required],
      relationship:['',[Validators.required]],
      occupation: ['',[Validators.required,Validators.pattern(/^(?!.*\d)[A-Za-z]+(?: [A-Za-z]+)*$/)]],
      contactNumber : ['',[Validators.required, Validators.pattern(/^([0][7][01245678][0-9]{7})|([\\+][9][4][7][01245678][0-9]{7})|([0][1-9][1-9][0-9]{7})$/)]],
      email : ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
    })

    this.enrollmentForm = this.formBuilder.group({
      grade:['',Validators.required],
      subject:[{value: '', disabled: true},Validators.required],
      instructor:[{value: '', disabled: true},Validators.required],
      time:[{value: '', disabled: true},Validators.required],
      date:[{value: '', disabled: true},Validators.required]

    })

    this.payingMethodForm = this.formBuilder.group({
      method : ['' , Validators.required]
    });

    this.parentSearchForm = this.formBuilder.group({
      nicNo : ['',[Validators.required, Validators.pattern(/^([1][9][0-9]{10})|([2][0][0-9]{10})|([0-9]{9}[V])$/)]]
    })

    this.classFeeForm = this.formBuilder.group({
      hasPaymentDone:['',Validators.required]
    })

    this.cardDetailsForm = this.formBuilder.group({
      firstFourDigit : [null,[Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      secondFourDigit : [null,[Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      thirdhFourDigit : [null,[Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      fourthFourDigit : [null,[Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      expirDate : [null, Validators.required],
      CVC : [null, [Validators.required, Validators.pattern(/^[0-9]{3}$/)]]
    })
  }

  nextClick(){
    this.activeStepIndex = this.activeStepIndex + 1;
  }

  loadTheContent(){
    this.isStudentFormVisible = false;
  }

  getsubjects(){
    this.subjects = [];
    let uniqueSubjects : SubjectVM[];
    this.courses.forEach(element => {
      if(element.grade.id === this.getTheGrade.value.id && !this.subjects.includes(element.subject)){
        this.subjects.push(element.subject)
      }
    });

    uniqueSubjects = this.subjects.filter((subject, index, self) =>
      index === self.findIndex((s) => (
          s.id === subject.id
      ))
    );

    this.subjects = uniqueSubjects;
    this.getTheSubject?.enable();
  }

  openStudentForm(StudentFormVisibility : boolean){
    this.isStudentFormVisible = StudentFormVisibility;
  }

  login(){
    let loginDetails : ADAccountVM;

    loginDetails = {
      userCode : this.getLoginUserCode.value,
      passWord : this.getLoginPassword.value
    }
    

    this.subs.sink = this.adAccountService.login(loginDetails).subscribe(data =>{
      if(data && data.content && data.content.loginDetails && data.code == "00"){
        
        this.logedDetails = data.content.loginDetails;
        
        this.localStorageService.setItem('login',JSON.stringify(this.logedDetails));
        this.localStorageService.setItem('token',data.content.token);
        this.isLogginSuccess.emit(this.logedDetails.isLoginSuccess);
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The entered credentials are incorrect or account has been terminated'});
      }
    })
  }

  classfeeWithAddmision() : number{
    let amount : number = 0;
    this.enrolledCourses.forEach(element => {
      amount = amount+element.classFeeAmount;
    });
    this.total = amount+this.addmisionFee;
    return amount+this.addmisionFee;
  }

  getCourses(){
    this.isloading = true
    this.subs.sink = this.courseServices.getCourses().subscribe(data =>{
      if(data){
        this.isloading = false;
        this.courses = data.content;
        this.getGrade();
      }
    });
  }

  getGrade(){
    this.isloading = true;
    this.subs.sink = this.gradeServise.getGrades().subscribe(data => {
      if(data){
        this.grades = data.content
        this.getMonths();
      } 
      this.isloading = false;
    })
    
  }

  getMonths(){
    this.isloading = true
    this.subs.sink = this.monthService.getMonths().subscribe(data =>{
      if(data){
        this.isloading = false
        this.months = data.content;
        this.getEnrolmentCourses()
      }
    })
  }

  getEnrolmentCourses(){
    this.isloading = true
    this.subs.sink = this.enrolmentCoursesService.getEnrolmentCourse().subscribe(data =>{
      if(data && data.content){
        this.allEnrolmentCourses = data.content;
        this.getRole();
      }
      this.isloading = false
    })
  }

  getRole(){
    this.isloading = true
    this.subs.sink = this.roleService.getRoles().subscribe(data =>{
      if(data && data.content){
        this.role = data.content.find(el => el.id && el.id == 1);
        this.isloading = false;
      }
    })
  }

  removeCourse(course : any){
    this.enrolledCourses.forEach((element,index) => {
      if(element.id === course.id){
        this.enrolledCourses.splice(index,1);
      }
    });
  }

  getInstructors(){
    let uniqueInstructors : teacherVM[];
    this.instructors = [];
    this.courses.forEach(element => {
      if(element.grade.id === this.getTheGrade.value.id && element.subject.id === this.getTheSubject.value.id){
        this.instructors.push(element.teacher);
      }
    });

    uniqueInstructors = this.instructors.filter((instructor, index, self) =>
      index === self.findIndex((i) => (
          i.id === instructor.id
      ))
    );

    this.instructors = uniqueInstructors;
    this.getTheInstructor?.enable();
  }

  getDates(){
    this.courseDates = [];
    this.courses.forEach(element => {
      if(element.grade.id === this.getTheGrade.value.id && element.subject.id === this.getTheSubject.value.id && element.teacher === this.getTheInstructor.value){
        this.courseDates.push(element.date);
      }
    });
    this.getTheDate?.enable();
    
  }

  getTimes(){
    this.courseTimes = [];
    this.courses.forEach(element => {
      if(element.grade.id === this.getTheGrade.value.id && element.subject.id === this.getTheSubject.value.id && element.teacher === this.getTheInstructor.value && element.date === this.getTheDate.value){
        this.courseTimes.push(element.startTime);
      }
    });
    this.getTheTime?.enable();
  }

  loadTerms(typeEnum : number){
    if(typeEnum == 1){
      this.istacLoaded = true
    }else if (typeEnum = 2){
      this.isprivacyLoaded = true
    }else if(typeEnum == 3){
      this.isRefundLoaded = true
    }
  }

  closeTerms(){
    this.istacLoaded = false
    this.isprivacyLoaded = false
    this.isRefundLoaded = false
  }

  searchParent(){
    let searchedNIC = this.getNicNo.value;
    this.isSearchParent = true;
    this.parentDetailForm.reset();
    let relationship : any

    this.subs.sink = this.parentService.getParentById(searchedNIC).subscribe(data => {
      if(data && data.content && data.code == "00"){
        this.searchedParent = data.content;
        this.getParentFullName.patchValue(data?.content?.fullName);
        this.getParentBirthaday.patchValue(data?.content?.birthday);
        this.getParentBirthaday.disable();
        this.getParentContactNumber.patchValue(data?.content?.contactNumber);
        this.getParentNIC.patchValue(data?.content?.nic);
        this.getParentOccupation.patchValue(data?.content?.occupation);

        relationship = this.relationships.find(el => el.name == data?.content?.relationship)
        this.getParentRelationship.patchValue(relationship);

        this.getParentTitle.patchValue(data?.content?.title);
        this.getParentEmail.patchValue(data.content.email)
        this.isASearchedParent = true;
      }else{
        let dobString : string
        dobString = this.getBirthdayByNic(searchedNIC);
        let dob = new Date(dobString)
        this.getParentBirthaday.patchValue(dob);
        this.getParentBirthaday.disable();
        this.isASearchedParent = false;
      }
    })
    this.getParentNIC.patchValue(searchedNIC)
    
  }

  closeQuickStudentCreationPopup(){
   this.enrollmentForm.reset();
   this.parentDetailForm.reset();
   this.studentDetailForm.reset(); 
   this.isSearchParent = false;
   this.isStudentFormVisible = false;

   this.activeStepIndex = 0
  }

  getBirthdayByNic(nicNo : string) :string{
    let birthYear: any;
    let birthMonth: any;
    let birthDate: any;
    let dob : any
 
    if (nicNo.length === 10) {
      birthYear = nicNo.substring(0, 2);
      birthYear = '19' + birthYear;
      birthDate = nicNo.substring(2, 5);
      birthDate = parseInt(birthDate);

      if (birthDate > 500) {
        birthDate = birthDate - 500;
      }

        if (birthDate > 335) {
          birthDate = birthDate - 335;
          birthMonth = 12;
        } else if (birthDate > 305) {
          birthDate = birthDate - 305;
          birthMonth = 11;
        } else if (birthDate > 274) {
          birthDate = birthDate - 274;
          birthMonth = 10;
        } else if (birthDate > 244) {
          birthDate = birthDate - 244;
          birthMonth = 9;
        } else if (birthDate > 213) {
          birthDate = birthDate - 213;
          birthMonth = 8;
        } else if (birthDate > 182) {
          birthDate = birthDate - 182;
          birthMonth = 7;
        } else if (birthDate > 152) {
          birthDate = birthDate - 152;
          birthMonth = 6;
        } else if (birthDate > 121) {
          birthDate = birthDate - 121;
          birthMonth = 5;
        } else if (birthDate > 91) {
          birthDate = birthDate - 91;
          birthMonth = 4;
        } else if (birthDate > 60) {
          birthDate = birthDate - 60;
          birthMonth = 3;
        } else if (birthDate < 32) {
          birthMonth = 1;
        } else if (birthDate > 31) {
          birthDate = birthDate - 31;
          birthMonth = 2;
        }

    } else {
      birthYear = nicNo.substring(0, 4);
      birthDate = nicNo.substring(4, 7);
      birthDate = parseInt(birthDate);
      if (birthDate > 500) {
        birthDate = birthDate - 500;
      }

        if (birthDate > 335) {
          birthDate = birthDate - 335;
          birthMonth = 12;
        } else if (birthDate > 305) {
          birthDate = birthDate - 305;
          birthMonth = 11;
        } else if (birthDate > 274) {
          birthDate = birthDate - 274;
          birthMonth = 10;
        } else if (birthDate > 244) {
          birthDate = birthDate - 244;
          birthMonth = 9;
        } else if (birthDate > 213) {
          birthDate = birthDate - 213;
          birthMonth = 8;
        } else if (birthDate > 182) {
          birthDate = birthDate - 182;
          birthMonth = 7;
        } else if (birthDate > 152) {
          birthDate = birthDate - 152;
          birthMonth = 6;
        } else if (birthDate > 121) {
          birthDate = birthDate - 121;
          birthMonth = 5;
        } else if (birthDate > 91) {
          birthDate = birthDate - 91;
          birthMonth = 4;
        } else if (birthDate > 60) {
          birthDate = birthDate - 60;
          birthMonth = 3;
        } else if (birthDate < 32) {
          birthMonth = 1;
        } else if (birthDate > 31) {
          birthDate = birthDate - 31;
          birthMonth = 2;
        }
    }
    // let timeDiff = Math.abs(Date.now() - new Date(birthYear).getTime());
    // let fullbirthYear = new Date(birthYear).getFullYear();
    dob = `${birthYear}-${birthMonth}-${birthDate}`

    return dob
    
  }

  submitAndNextClick(){
    let id = 0;
    let parent : parentVM;
    if(this.isASearchedParent){
      parent = {
        id : this.searchedParent?.id,
        fullName : this.getParentFullName.value,
        title : this.getParentTitle.value,
        nic : this.getParentNIC.value,
        birthday : this.getParentBirthaday.value,
        relationship: this.getParentRelationship.value.name,
        occupation : this.getParentOccupation.value,
        contactNumber : this.getParentContactNumber.value,
        isActive : true,
        email : this.getParentEmail.value
      }
    }else{
      parent = {
        fullName : this.getParentFullName.value,
        title : this.getParentTitle.value,
        nic : this.getParentNIC.value,
        birthday : this.getParentBirthaday.value.toLocaleDateString(),
        relationship: this.getParentRelationship.value.name,
        occupation : this.getParentOccupation.value,
        contactNumber : this.getParentContactNumber.value,
        isActive : true,
        email : this.getParentEmail.value
      };
    }
    

    let address : addressVM = {
      houseNo : this.getStudenthouseNo.value,
      lane : this.getStudentLane.value,
      city : this.getStudentCity.value,
      district : this.getStudentCity.value
    }

    let student : studentVM = {
      fullName : this.getStudentFullName.value,
      callingName : this.getStudentCallingName.value,
      birthDay : this.getStudentBirthday.value.toLocaleDateString(),
      gender : this.getStudentGender.value,
      isActive : true,
      contactNumber : this.getStudentContactNumber.value,
      address : address,
      parent : parent,
      school : this.getStudentSchool.value,
      isAdmisionPaid : false,
      email : this.getStudentEmail.value,
      role : this.role,
    }
    
    this.subs.sink = this.studentServices.createStudent(student).subscribe(data => {
      if(data && data.content && data.content.id && data.content.id > 0){
        this.student = data.content;
        this.studentAllData.push(this.student);
        this.studentTableData = this.studentAllData;
        this.studentTableData.reverse();
        this.activeStepIndex = this.activeStepIndex + 1;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student Registered' });
        
      }
    });
  }

  addClass(){
    this.courses.forEach(element => {
      if(element.grade.id === this.getTheGrade.value.id && element.subject.id === this.getTheSubject.value.id && element.teacher === this.getTheInstructor.value && element.date === this.getTheDate.value && element.startTime === this.getTheTime.value){
        this.enrolledCourses.push(element);
      }
    });

    this.enrollmentForm.reset();
  }
  
  previousClick(){
    this.activeStepIndex = this.activeStepIndex - 1;
  }

  enrollCourses(){
    let enrolment : EnrolmentVM;
    let enrolmentCourse :EnrolmentCourseVM[] = [];
    let e : EnrolmentCourseVM;

    this.enrolledCourses.forEach(element => {
      e = {
        course : element,
        isActive : true
      }
      enrolmentCourse.push(e);
    });

    enrolment = {
      enrolmentCourses : enrolmentCourse,
      student : this.student
    }
    
    this.subs.sink = this.enrolmentService.addEnrolment(enrolment).subscribe(data => {
      if(data && data.content){
        this.enrollments = data.content;
        this.activeStepIndex = this.activeStepIndex +1;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student Enrolled' });
      }
    });
  }

  proceddPayment(){
    let todayMonth : number = this.today.getMonth() + 1;
    let classFee : ClassFeeVM;
    let classFeeCourses : ClassFeeCourseVM[]=[];
    let cf : ClassFeeCourseVM;
    let cfa : ClassFeeCourseVM;
    let month : MonthVM;
    month = this.months[-1];
    
    this.months.forEach(element => {
      if(element.id == todayMonth){
        month = element;
      }
    });

    this.enrolledCourses.forEach(element => {
      cf = {
        course : element,
        amount : element.classFeeAmount,
        isAddmision : 0,
        month : month
      }
      classFeeCourses.push(cf);
    });

    cfa = {
      amount : this.addmisionFee,
      isAddmision : 1,
      month : month
    }
    classFeeCourses.push(cfa);

    classFee = {
      classFeeCourse : classFeeCourses,
      student : this.student,
      isActive : true
    }

    this.subs.sink = this.classFeeService.addStudentClassFees(classFee).subscribe(data =>{
      if(data && data.content && data.content.classFeeCourse){
        this.proceedClassFeePayment = data.content;
        let classFeeCourses : ClassFeeCourseVM[]=[]; 
        let classFeeCourse : courseWiseMonths
        let payingCourseWiseMonths : courseWiseMonths[]=[];
        
        classFeeCourses = data.content.classFeeCourse;
        classFeeCourses.forEach(element => {
          if(element.course){
            let c = payingCourseWiseMonths.find(el => el.course && el.course.id && element && element.course && element.course.id && element.course.id == el.course.id);
            if(c){
              let index = payingCourseWiseMonths.indexOf(c);
              if(element.month){
                c.months?.push(element.month)
                payingCourseWiseMonths.splice(index,1,c);
              }
            }else{
              if(element.month){
                let m : MonthVM[] = [];
                m.push(element.month)
                let name : string;
                let ammount : number;
                name = '('+element.course.code+') - ' + element.course.teacher.fullName + '\'s ' + element.course.grade.name + ' ' + element.course.date + ' ' + element.course.subject.name + ' Class at ' + element.course.startTime;
                ammount = element.course.classFeeAmount;
                classFeeCourse = {
                  course : element.course,
                  months : m,
                  courseName:name,
                  courseAmount : ammount
                }
                payingCourseWiseMonths.push(classFeeCourse);
              }
            }
          }else{
            if(element.month){
              let m : MonthVM[] = [];
              m.push(element.month)
              let name : string = "Admision";
              let ammount : number = this.addmisionFee;
              classFeeCourse = {
                course : element.course,
                months : m,
                courseName:name,
                courseAmount : ammount
              }
              payingCourseWiseMonths.push(classFeeCourse);
            }
          }
        });

        this.reciptTemplateData = {
          courseWiseMonths : payingCourseWiseMonths,
          resiptNumber : data.content.reciptNumber,
          student : data.content.student,
          subTotal : this.total
        }

        this.createStudentLoginDetails();
        this.activeStepIndex = this.activeStepIndex + 1;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Payment Success' });
      }
      
    })

  }

  createStudentLoginDetails(){
    let password : string = "student@1234"
    let usercode : string = this.student?.scode ? this.student?.scode : '';
    let userAccount : ADAccountVM;

    userAccount = {
      userCode : usercode,
      passWord : password,
      profilePictureName : this.student?.gender == 'female' ? "female.png" : "male.png"
    }

    this.subs.sink = this.adAccountService.createUserAccount(userAccount).subscribe(data =>{
      if(data){
        this.adAccountDetails = data.content ? data.content : {};
      }
    })
    
  }

  
}
