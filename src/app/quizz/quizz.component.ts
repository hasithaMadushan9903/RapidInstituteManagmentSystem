import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { MonthService } from '../shared/services/month.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { answerVM } from '../shared/models/answerVM';
import { questionVM } from '../shared/models/quesionVM';
import { quizzVM } from '../shared/models/quizzVM';
import { CourseService } from '../shared/services/course.service';
import * as moment from 'moment';
import { CourseVM } from '../shared/models/coursesVM';
import { QuizeeService } from '../shared/services/quizee.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AttemptService } from '../shared/services/attempt.service';
import { StudentAnswersVM } from '../shared/models/studentAnswersvm';
import { Attemptvm } from '../shared/models/attemptVM';
import { StudentService } from '../shared/services/student.service';
import { studentVM } from '../shared/models/studentVM';
import { ScoreVM } from '../shared/models/scoreVM';
import { EnrolmentCourseVM } from '../shared/models/enrolmentCourse';
import { EnrolmentCourseService } from '../shared/services/enrolment-course.service';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit{

  private subs = new SubSink();
  appIconId : number = 19
  userCode : string = ''
  today = new Date();
  thisMonth : number = this.today.getMonth() + 1;
  thisYear : number = this.today.getFullYear();
  thisDay : number = this.today.getDate()
  isLoading : boolean = false;
  logedDetails : loginDetailsVM | undefined;
  
  dropdownCourses : CourseVM[] = [];

  privilages : privilagesVM[] = [];
  selectAction !: FormGroup
  searchForm !: FormGroup;
  attemptingQuizForm !:FormGroup;
  quizzForm !: FormGroup;
  score : ScoreVM | undefined
  quizzUpdateForm !: FormGroup;
  isCreateQuizzFormButtonVisible : boolean = false;
  isCreateQuizzFormPopupVisible : boolean = false;
  isUpdateQuizzFormPopupVisible : boolean = false;
  quizz : quizzVM | undefined;
  courses : CourseVM[]=[]
  queestions : questionVM[] =[]
  selectedQuizz : quizzVM | undefined
  deletingQuizz : quizzVM | undefined
  allEnrolmentCourses : EnrolmentCourseVM[] = [];
  deletingQuizzIndex : number = -1
  isDeleteConfirmOpen : boolean = false
  lastModifyingQuestion : questionVM | undefined;
  activeStepIndex : number = 0;
  updateActiveStepIndex : number = 0;
  action : number | undefined
  loggedStudent : studentVM | undefined
  selectedQuestion : questionVM | undefined
  isAttepmtPopupVisible : boolean = false;
  isAppInBackground: boolean = false;
  attemptingQuiz : quizzVM | undefined
  attemptingAllQuestions : questionVM[] = []
  attemptingQuestions : questionVM[] = []
  allQuizzes : quizzVM[]=[]
  filterQuizzes : quizzVM[]=[]
  steps = [
    { label: 'Title'},
    { label: 'Questions & Answers'}
  ];
  

  // get action value
  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }

  // get search value
  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  get getQuizzTitle(): AbstractControl { return this.quizzForm.get('title') as AbstractControl; }
  get getQuizzDueDateTime(): AbstractControl { return this.quizzForm.get('due') as AbstractControl; }
  get getQuizzQuession(): AbstractControl { return this.quizzForm.get('quession') as AbstractControl; }
  get getQuizzCorrectAns(): AbstractControl { return this.quizzForm.get('correctAns') as AbstractControl; }
  get getQuizzFirstAns(): AbstractControl { return this.quizzForm.get('firstAns') as AbstractControl; }
  get getQuizzSecondAns(): AbstractControl { return this.quizzForm.get('secondAns') as AbstractControl; }
  get getQuizzThirdAns(): AbstractControl { return this.quizzForm.get('thirdAns') as AbstractControl; }
  get getQuizzForthAns(): AbstractControl { return this.quizzForm.get('forthAns') as AbstractControl; }
  get getQuizzCourse(): AbstractControl { return this.quizzForm.get('course') as AbstractControl; }
  get getQuizzQuesionPerQuiz(): AbstractControl { return this.quizzForm.get('quesionPerQuiz') as AbstractControl; }
  get getQuizzWeight(): AbstractControl { return this.quizzForm.get('weight') as AbstractControl; }

  get getQuizzUpdateTitle(): AbstractControl { return this.quizzUpdateForm.get('title') as AbstractControl; }
  get getQuizzUpdateDueDateTime(): AbstractControl { return this.quizzUpdateForm.get('due') as AbstractControl; }
  get getQuizzUpdateQuession(): AbstractControl { return this.quizzUpdateForm.get('quession') as AbstractControl; }
  get getQuizzUpdateCorrectAns(): AbstractControl { return this.quizzUpdateForm.get('correctAns') as AbstractControl; }
  get getQuizzUpdateFirstAns(): AbstractControl { return this.quizzUpdateForm.get('firstAns') as AbstractControl; }
  get getQuizzUpdateSecondAns(): AbstractControl { return this.quizzUpdateForm.get('secondAns') as AbstractControl; }
  get getQuizzUpdateThirdAns(): AbstractControl { return this.quizzUpdateForm.get('thirdAns') as AbstractControl; }
  get getQuizzUpdateForthAns(): AbstractControl { return this.quizzUpdateForm.get('forthAns') as AbstractControl; }
  get getQuizzUpdateCourse(): AbstractControl { return this.quizzUpdateForm.get('course') as AbstractControl; }
  get getQuizzUpdateQuesionPerQuiz(): AbstractControl { return this.quizzUpdateForm.get('quesionPerQuiz') as AbstractControl; }
  
  constructor(
    private formBuilder: FormBuilder,
    private monthService : MonthService,
    private localStorageService : LocalStorageService,
    private router : Router,
    private courseService : CourseService,
    private quizzService : QuizeeService,
    private enrolmentCourseService : EnrolmentCourseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private attemptService : AttemptService,
    private studentService : StudentService
  ){}

  ngOnInit(): void {
    this.getLoginData();
    this.subscriptions();
    this.buildForm();
    this.checkUserVisibility()
  }

  checkUserVisibility(){
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('focus', this.handleWindowFocus);
  }

  handleVisibilityChange = () => {
    this.isAppInBackground = document.hidden;
    if(this.isAppInBackground){
      this.closeAttemp()
      // this.submitAttempt()
    }
  };

  handleWindowBlur = () => {
    this.isAppInBackground = true;
    if(this.isAppInBackground){
      this.closeAttemp()
      // this.submitAttempt()
    }

  };

  handleWindowFocus = () => {
    this.isAppInBackground = false;
    if(this.isAppInBackground){
      this.closeAttemp()
      // this.submitAttempt()
    }
  };

  getLoginData(){
    let loginData : any = this.localStorageService.getItem('login');
    this.logedDetails = JSON.parse(loginData)
    this.userCode = this.logedDetails?.usercode ? this.logedDetails?.usercode : ''
    this.privilages = this.logedDetails?.privilagesDTO ? this.logedDetails?.privilagesDTO : [];
  }

  subscriptions(){
    this.getAllquizzes()
  }

  isActionAllowed(action : number):boolean{
    if(this.privilages.filter(el => el.appIcon.id == this.appIconId && el.action.id == action).length > 0){
      return true;
    }else{
      return false;
    }
  }

  buildForm(){
    this.selectAction = this.formBuilder.group({
      action : ['' , Validators.required]
    });

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });

    this.quizzForm = this.formBuilder.group({
      title : [null, Validators.required],
      quession : [null, Validators.required],
      firstAns :[null, Validators.required],
      secondAns :[null, Validators.required],
      thirdAns :[null, Validators.required],
      forthAns :[null, Validators.required],
      correctAns : [null,Validators.required],
      course : [null,Validators.required],
      due : [null,Validators.required],
      quesionPerQuiz : [null,Validators.required],
      weight : [null,[Validators.required, Validators.pattern(/^[0-9]{1}$/)]]
    })

    this.quizzUpdateForm = this.formBuilder.group({
      title : [null, Validators.required],
      quession : [null, Validators.required],
      firstAns :[null, Validators.required],
      secondAns :[null, Validators.required],
      thirdAns :[null, Validators.required],
      forthAns :[null, Validators.required],
      correctAns : [null,Validators.required],
      course : [null,Validators.required],
      due : [null,Validators.required],
      quesionPerQuiz : [null,Validators.required]
    })

    this.attemptingQuizForm = this.formBuilder.group({})
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
    if(this.action === 1){
      this.isCreateQuizzFormButtonVisible = false;
    }
  }

  openQuizzForm(quizzFormVisibility : boolean){
    this.isCreateQuizzFormPopupVisible = quizzFormVisibility;
  }

  getCourses(){
    if(this.logedDetails && this.logedDetails.usercode && this.logedDetails.id ){
      if(this.logedDetails.usercode.startsWith('T')){
        this.subs.sink = this.courseService.getCoursesByTeacherId(this.logedDetails.id).subscribe(data =>{
          if(data && data.content){
            this.courses = data.content;
            this.isLoading = false
          }
        })
      }else if(this.logedDetails.usercode.startsWith('S')) {
        this.dropdownCourses = [];
        let studentWiseEnrolmentCourses : EnrolmentCourseVM[] = [];
        studentWiseEnrolmentCourses = this.allEnrolmentCourses.filter(el => this.logedDetails && this.logedDetails.usercode &&el.enrolment?.student?.scode === this.logedDetails.usercode && el.isActive == true)
    
        
        studentWiseEnrolmentCourses.forEach(element => {
          if(element && element.course){
            this.dropdownCourses.push(element.course)
          }
        });

        this.courses = this.dropdownCourses
        
      }else{
        this.subs.sink = this.courseService.getCourses().subscribe(data=>{
          if(data && data.content){
            this.courses = data.content
            this.isLoading = false
          }
        })
      }
    }
  }

  getEnrolmentCourses(){
    this.subs.sink = this.enrolmentCourseService.getEnrolmentCourse().subscribe(data =>{
      if(data){
        this.allEnrolmentCourses = data.content;
        this.getCourses()
        
      }
    })
  }

  isTimesUp(dueDateTime : string):boolean{
    if (moment().isAfter(moment(dueDateTime))) {
      return true
    } else {
      return false
    }
  }

  openQuizPopup(attemptingQuiz : quizzVM){
    
    
    let attemptingQuestionsLength : number
    let noOfRandomQuestion : number;
    let randomQuesionIndexs : number[] = []
    this.attemptingQuiz = attemptingQuiz
    this.attemptingAllQuestions = this.attemptingQuiz.questions ? this.attemptingQuiz.questions : []
    
    attemptingQuestionsLength = this.attemptingAllQuestions.length
    noOfRandomQuestion = this.attemptingQuiz.quesionPerQuiz
    randomQuesionIndexs = this.generateRandomQuestions(noOfRandomQuestion,attemptingQuestionsLength-1)

    randomQuesionIndexs.forEach(element => {
      this.attemptingQuestions.push(this.attemptingAllQuestions[element]);
    });

    this.attemptingQuestions.forEach(question => {
      let formcontrollerName : string
      formcontrollerName = 'quesion' + question.id + 'answer'
      this.attemptingQuizForm.addControl(formcontrollerName,new FormControl(null,Validators.required))
    });
    this.isAttepmtPopupVisible = true
  }

  getMarks(noOfCorrectAns : number = 0,noOfQuestions : number=1 ):number{
    return (noOfCorrectAns/noOfQuestions)*100
  }

  submitAttempt(){
    let attempt : Attemptvm
    let studentAns : StudentAnswersVM[] = [];
    this.attemptingQuestions.forEach(question => {
      let formcontrollerName : string
      formcontrollerName = 'quesion' + question.id + 'answer'
      let answerId : number = 0;
      answerId = this.attemptingQuizForm.get(formcontrollerName)?.value ? this.attemptingQuizForm.get(formcontrollerName)?.value : 0;
      let answer : answerVM | undefined;
      if(question && question.answers && question.answers.length && question.answers.length >0){
        answer = question.answers.find(el => el && el.id && answerId && answerId >0 && el.id == answerId)
      }

      if(answer){
        let studentAnswer : StudentAnswersVM;
        studentAnswer = {
          answers : answer,
          question : question
        }

        studentAns.push(studentAnswer);
      }

      
    });

    attempt = {
      attemptDate : `${this.thisYear}-${this.thisMonth}-${this.thisDay}`,
      quizzes : this.attemptingQuiz,
      student : this.loggedStudent,
      studentAnswers : studentAns
    }

    this.attemptService.addAttept(attempt).subscribe(data =>{
      if(data && data.content){
        this.score = data.content;
        this.closeAttemp()
        this.subscriptions()
      }
    })
  }

  convertToRomeNumbers(index : number) : string{
    if(index == 0){
      return 'I'
    }else if (index == 1){
      return 'II'
    }else if (index == 2){
      return 'III'
    }else if (index == 3){
      return 'IV'
    }else{
      return 'V'
    }
  }

  closeAttemp(){
    this.attemptingQuestions.forEach(question => {
      let formcontrollerName : string
      formcontrollerName = 'quesion' + question.id + 'answer'
      
    });
    this.attemptingAllQuestions = []
    this.attemptingQuestions = []
    this.attemptingQuizForm = this.formBuilder.group({})
    this.isAttepmtPopupVisible = false;
  }

  searchQuizz(){
    let course : CourseVM
    course =  this.getSearchValue.value
    this.filterQuizzes = this.allQuizzes.filter(el => el && el.course && el.course.id && course && course.id && el.course.id == course.id)
  }

  resetSearch(){
    this.filterQuizzes = this.allQuizzes
    this.searchForm.reset();
    this.selectAction.reset();
    this.action = undefined;
  }

  closeQuizzUpdatePopup(){
    this.isCreateQuizzFormPopupVisible = false;
    this.isUpdateQuizzFormPopupVisible = false;
    this.quizzUpdateForm.reset()
    this.quizzForm.reset()
    this.queestions = []
  }

  addUpdateQuesion(){
    let answer : answerVM;
    let answers : answerVM[]=[];
    let queestion : questionVM
    let selectedAnswers : answerVM[]=[];

    selectedAnswers = this.selectedQuestion?.answers ? this.selectedQuestion.answers : []

    selectedAnswers.forEach((element,index) => {
      answer= {
        ...element,
        description : index == 0 ? this.getQuizzUpdateFirstAns.value : (index == 1? this.getQuizzUpdateSecondAns.value :(index ==2 ? this.getQuizzUpdateThirdAns.value : this.getQuizzUpdateForthAns.value)), 
        isCorrect : `${index+1}` == this.getQuizzUpdateCorrectAns.value ? true : false
      }

      answers.push(answer)
    });
    
    queestion = {
      ...this.selectedQuestion,
      answers : answers,
      description : this.getQuizzUpdateQuession.value,
    }

    this.queestions.push(queestion);

    this.getQuizzUpdateFirstAns.reset();
    this.getQuizzUpdateSecondAns.reset();
    this.getQuizzUpdateThirdAns.reset()
    this.getQuizzUpdateForthAns.reset()
    this.getQuizzUpdateCorrectAns.reset();
    this.getQuizzUpdateQuession.reset()
  }

  addQuesion(){
    let answer : answerVM;
    let answers : answerVM[]=[];
    let queestion : questionVM

    answer = {
      description : this.getQuizzFirstAns.value,
      isCorrect : this.getQuizzCorrectAns.value == '1' ? true : false
    }

    answers.push(answer)

    answer = {
      description : this.getQuizzSecondAns.value,
      isCorrect : this.getQuizzCorrectAns.value == '2' ? true : false
    }

    answers.push(answer)

    answer = {
      description : this.getQuizzThirdAns.value,
      isCorrect : this.getQuizzCorrectAns.value == '3' ? true : false
    }

    answers.push(answer)

    answer = {
      description : this.getQuizzForthAns.value,
      isCorrect : this.getQuizzCorrectAns.value == '4' ? true : false
    }

    answers.push(answer)
    queestion = {
      answers : answers,
      description : this.getQuizzQuession.value,
      wight : this.getQuizzWeight.value
    }

    this.queestions.push(queestion);

    this.getQuizzFirstAns.reset();
    this.getQuizzSecondAns.reset();
    this.getQuizzThirdAns.reset()
    this.getQuizzForthAns.reset()
    this.getQuizzCorrectAns.reset();
    this.getQuizzQuession.reset()
  }

  changeQuesion(quesion :questionVM,index : number){
    let answers = quesion.answers;
    let correctAns : string;
    let correctIndex : number =0 ;
    correctIndex = answers?.findIndex(el => el && el.isCorrect) ?answers?.findIndex(el => el && el.isCorrect) : 0
    if(correctIndex>=0){
      let ans = correctIndex + 1;
      correctAns = `${ans}`
    }else{
      correctAns = '0'
    }
    this.getQuizzQuession.patchValue(quesion.description);
    this.getQuizzFirstAns.patchValue(quesion.answers? quesion.answers[0].description : '');
    this.getQuizzSecondAns.patchValue(quesion.answers? quesion.answers[1].description : '');
    this.getQuizzThirdAns.patchValue(quesion.answers? quesion.answers[2].description : '');
    this.getQuizzForthAns.patchValue(quesion.answers? quesion.answers[3].description : '');
    this.getQuizzCorrectAns.patchValue(correctAns)
    this.removeQuestion(index)
    
  }

  changeQuesionInUpdate(quesion :questionVM,index : number){
    this.selectedQuestion = quesion
    let answers = quesion.answers;
    let correctAns : string;
    let correctIndex : number =0 ;
    correctIndex = answers?.findIndex(el => el && el.isCorrect) ?answers?.findIndex(el => el && el.isCorrect) : 0
    if(correctIndex>=0){
      let ans = correctIndex + 1;
      correctAns = `${ans}`
    }else{
      correctAns = '0'
    }

    this.getQuizzUpdateQuession.patchValue(quesion.description);
    this.getQuizzUpdateFirstAns.patchValue(quesion.answers? quesion.answers[0].description : '');
    this.getQuizzUpdateSecondAns.patchValue(quesion.answers? quesion.answers[1].description : '');
    this.getQuizzUpdateThirdAns.patchValue(quesion.answers? quesion.answers[2].description : '');
    this.getQuizzUpdateForthAns.patchValue(quesion.answers? quesion.answers[3].description : '');
    this.getQuizzUpdateCorrectAns.patchValue(correctAns)
    
    this.lastModifyingQuestion = this.queestions[index];
    this.removeQuestionInUpdate(index)
    
  }

  removeQuestionInUpdate(index : number){
    this.queestions.splice(index,1)
  }

  removeQuestion(index : number){
    this.queestions.splice(index,1)
  }

  updateQuizz(quizz : quizzVM,index : number){
    this.selectedQuizz = quizz
    this.getQuizzUpdateCourse.patchValue(quizz.course);
    this.getQuizzUpdateDueDateTime.patchValue(quizz.dueDateTime)
    this.getQuizzUpdateTitle.patchValue(quizz.title);
    this.getQuizzUpdateQuesionPerQuiz.patchValue(quizz.quesionPerQuiz)
    this.queestions = quizz.questions ? quizz.questions : [];
    this.isUpdateQuizzFormPopupVisible = true;
  }

  saveQuizz(){
    this.quizz = {
      course : this.getQuizzCourse.value,
      title : this.getQuizzTitle.value,
      createdDateTime : `${this.thisYear}-${this.thisMonth}-${this.thisDay}`,
      questions : this.queestions,
      isStarted : false,
      isFinished : false,
      dueDateTime : this.getQuizzDueDateTime.value,
      quesionPerQuiz : parseInt(this.getQuizzQuesionPerQuiz.value)

    }

    this.subs.sink = this.quizzService.addQuizz(this.quizz).subscribe(data =>{
      if(data && data.content){
        let newlyAddedQuiz : quizzVM;
        newlyAddedQuiz = data.content
        this.allQuizzes.unshift(newlyAddedQuiz)
        this.filterQuizzes = this.allQuizzes
        this.quizzForm.reset();
        this.isCreateQuizzFormPopupVisible = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Quizz Created' });
        this.closeQuizzUpdatePopup()
      }
    })
  }

  updatequiz(){
    this.selectedQuizz = {
      ...this.selectedQuizz,
      course : this.getQuizzUpdateCourse.value,
      title : this.getQuizzUpdateTitle.value,
      createdDateTime : `${this.thisYear}-${this.thisMonth}-${this.thisDay}`,
      questions : this.queestions,
      isStarted : false,
      isFinished : false,
      dueDateTime : this.getQuizzUpdateDueDateTime.value,
      quesionPerQuiz : parseInt(this.getQuizzUpdateQuesionPerQuiz.value)
    };

    this.subs.sink = this.quizzService.updateOrDelete(this.selectedQuizz).subscribe(data =>{
      if(data && data.content){
        this.quizzForm.reset();
        this.quizzUpdateForm.reset()
        this.isUpdateQuizzFormPopupVisible = false;
        this.updateActiveStepIndex = 0
        this.getAllquizzes()
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Quizz Updated' });
      }
    })
  }

  openDeleteConfirmation(quizz : quizzVM,index : number){
    this.isDeleteConfirmOpen = true
    this.deletingQuizz = quizz
    this.deletingQuizzIndex = index
  }

  closeDeleteConfirmation(){
    let quiz : quizzVM | undefined
    this.isDeleteConfirmOpen = false
    this.deletingQuizz = quiz
    this.deletingQuizzIndex = -1
  }

  generateRandomQuestions(noOfRandomQuesions: number, upperLimit: number): number[] {
    
    if (noOfRandomQuesions > upperLimit && upperLimit != 0) {
      throw new Error('Cannot generate more unique values than the range allows.');
    }
    let result: number[] = [];

    if(upperLimit == 0){
      result.push(0)
      return result
    }else{
      const numbers = Array.from({ length: upperLimit }, (_, i) => i); // [1, 2, ..., y]
  
      for (let i = 0; i < noOfRandomQuesions; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        result.push(numbers[randomIndex]);
        numbers.splice(randomIndex, 1); // Remove the used number
      }
    
      return result.sort((a, b) => a - b);
    }
  }

  deletequiz(){
    this.deletingQuizz = {
      ...this.deletingQuizz,
      isStarted : false,
      isFinished : false,
      dueDateTime : this.selectedQuizz?.dueDateTime ? this.selectedQuizz?.dueDateTime : '',
      isActive : false,
      quesionPerQuiz : this.deletingQuizz?.quesionPerQuiz ? this.deletingQuizz?.quesionPerQuiz : 0
    };

    this.subs.sink = this.quizzService.updateOrDelete(this.deletingQuizz).subscribe(data =>{
      if(data && data.content){
        this.quizzForm.reset();
        this.isCreateQuizzFormPopupVisible = false;
        this.allQuizzes.splice(this.deletingQuizzIndex,1)
        this.filterQuizzes = this.allQuizzes
        this.closeDeleteConfirmation()
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Quizz Updated' });
      }
    })
  }

  changeQuizzDue(quizz : quizzVM,index : number){
    let status : string
    let msg : string;
    if(quizz.isStarted){
      msg = 'Are you sure that you want to end the quizz'
      status = 'ended'
    }else{
      msg = 'Are you sure that you want to start the quizz'
      status = 'started'
    }
    
    this.confirmationService.confirm({
      message: msg,
      accept: () => {
        quizz = {
          ...quizz,
          isFinished : quizz.isStarted ? true : false,
          isStarted : quizz.isStarted ? false : true,
        }

        this.allQuizzes[index]=quizz

        this.quizzService.updateOrDelete(quizz).subscribe(data =>{
          if(data && data.content){
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `Quizz ${status}` });
          }
        })
      }
    });
  }

  getAllquizzes(){
    if(this.logedDetails && this.logedDetails.usercode && this.logedDetails.id ){
      if(this.logedDetails.usercode.startsWith('S')){
        this.quizzService.getAllQuizeesForStudent(this.logedDetails.id).subscribe(data =>{
          // this.isLoading = true
          if(data && data.content){
            this.allQuizzes = data.content
            this.filterQuizzes = this.allQuizzes
          }
        })

        this.studentService.getStudentByScode(this.logedDetails.usercode).subscribe(data =>{
          if(data && data.content){
            this.loggedStudent = data.content
            this.getEnrolmentCourses()
          }
        })

      }else if(this.logedDetails.usercode.startsWith('A')){
        this.quizzService.getAllquizzes().subscribe(data =>{
        this.isLoading = true
        if(data){
          this.allQuizzes = data.content
          this.filterQuizzes = this.allQuizzes
          this.getCourses()
        }
         })
      }else if(this.logedDetails.usercode.startsWith('T')){
        this.quizzService.getAllQuizeesForTeacher(this.logedDetails.id).subscribe(data =>{
          // this.isLoading = true
          if(data){
            this.allQuizzes = data.content
            this.filterQuizzes = this.allQuizzes
            
            this.getCourses()
          }
        })

      }
    }
  }
}
