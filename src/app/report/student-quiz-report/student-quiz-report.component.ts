import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { chartVM } from 'src/app/shared/models/chartVM';
import { CourseVM } from 'src/app/shared/models/coursesVM';
import { courseWiseMonths } from 'src/app/shared/models/courseWiseMonthsVM';
import { dataSetsVM } from 'src/app/shared/models/dataSetsVM';
import { loginDetailsVM } from 'src/app/shared/models/loginDetailsVM';
import { PageWiseDataVM } from 'src/app/shared/models/pageWiseDataVM';
import { privilagesVM } from 'src/app/shared/models/privilagesVM';
import { reportTypesVM } from 'src/app/shared/models/ReportTypesVM';
import { StudentQuizReportvm } from 'src/app/shared/models/studentQuizReportVM';
import { AttemptService } from 'src/app/shared/services/attempt.service';
import { EnrolmentCourseService } from 'src/app/shared/services/enrolment-course.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ReportTypeMappingService } from 'src/app/shared/services/report-type-mapping.service';

@Component({
  selector: 'app-student-quiz-report',
  templateUrl: './student-quiz-report.component.html',
  styleUrls: ['./student-quiz-report.component.css']
})
export class StudentQuizReportComponent implements OnInit, OnChanges {

  @Input() reciptTemplateDataVM : reportTypesVM | undefined;
  @Input() selectedCourses : CourseVM[] = []
  @Input() isGetPDFClicked : boolean | undefined ;
  @Output() isPdfCreated = new EventEmitter<boolean>();
  
  
  userCode : string = ''
  date = new Date;
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];
  userRoleId : number = 0
  reportTypes : reportTypesVM[]=[];
  studentQuizReportData : StudentQuizReportvm[]=[]
  studentQuizReportDataAll : StudentQuizReportvm[]=[]
  pdfData : PageWiseDataVM[]=[]
  classFeeChartData : chartVM|undefined
  basicOptions: any;
  loggedUserId : number = 0
  highest : StudentQuizReportvm | undefined;
  lowest : StudentQuizReportvm | undefined;


  constructor(
      private attemptService : AttemptService,
      private reportTypeMappingService : ReportTypeMappingService,
      private localStorageService : LocalStorageService,
  ){}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isGetPDFClicked']) {
      this.isGetPDFClicked = changes['isGetPDFClicked'].currentValue;
  
      this.getLoginData();
      this.subscription();
  
      if (this.isGetPDFClicked) {
        this.generatePDF();
      }
    }
  
    if (changes['reciptTemplateDataVM']) {
      this.reciptTemplateDataVM = changes['reciptTemplateDataVM'].currentValue;
    }

    if(changes['selectedCourses']){
      this.selectedCourses = changes['selectedCourses'].currentValue;
      this.filterByCourse()
    }
    
  }

  ngOnInit(): void {
    // this.getLoginData()
    // this.subscription()
  }

  subscription(){
    this.reportTypeMappingService.getReportsUnderRole(this.userRoleId).subscribe(data =>{
      if(data && data.content){
        data.content.forEach(element => {
          this.reportTypes.push(element.reportTypes);
        });
        
      }
    })

    this.getReportData()
  }

  generatePDF(): void {
    const containers = document.querySelectorAll('.receipt-container');
    const pdf = new jsPDF();
    const promises: Promise<void>[] = [];
  
    containers.forEach((container, index) => {
      const promise = html2canvas(container as HTMLElement, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
  
        if (index > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, 211, 298);
      });
  
      promises.push(promise);
    });
  
    Promise.all(promises).then(() => {
      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl);
    });

    this.isPdfCreated.emit(false)
  }
    
  getReportData(){
    this.attemptService.getStudentQuizReportData(this.loggedUserId).subscribe(data =>{
      if(data && data.content){
        this.studentQuizReportData = data.content;
        this.studentQuizReportDataAll = this.studentQuizReportData;
        this.highest = this.studentQuizReportData[0];
        this.lowest = this.studentQuizReportData[0];
        this.setPDFData()
        
      }
    })
  }

  setPDFData(){
    
    let reportTypesVM : StudentQuizReportvm[]=[]
    let pageno : number = 1;
    let pdfdataset : PageWiseDataVM[]=[]
    let pdfdata : PageWiseDataVM
    let len = this.studentQuizReportData.length;

    this.studentQuizReportData.forEach((element,index) => {
      let eleNo : number = index + 1;

      if(this.highest && this.highest.marks && (element.marks/element.noOfQuestionInQuiz) > (this.highest.marks/this.highest.noOfQuestionInQuiz)){
        this.highest = element
      }

      if(this.lowest && this.lowest.marks && element.marks < this.lowest.marks){
        this.lowest = element
      }

      if(eleNo<=len){
        if(eleNo % 7 > 0){
          reportTypesVM.push(element)
        }else{
          pdfdata = {
            page : pageno,
            data : reportTypesVM
          }

          pdfdataset.push(pdfdata)
          reportTypesVM =[];
          pageno = pageno +1;

          reportTypesVM.push(element)
          if(len==eleNo){
            pdfdata = {
              page : pageno,
              data : reportTypesVM
            }
  
            pdfdataset.push(pdfdata)
            this.pdfData = pdfdataset
            reportTypesVM =[];
  
          }
        }
      }else{
        this.pdfData = pdfdataset
      }
    });

    if(len<=6){
      pdfdata = {
        page : pageno,
        data : reportTypesVM
      }

      pdfdataset.push(pdfdata)
      this.pdfData = pdfdataset
      reportTypesVM =[];

    }
    
    this.setChartData()
  }

  setChartData(){
    let dataset : dataSetsVM
    let data : number[]=[];
    let labels : string[]=[]

    this.studentQuizReportData.forEach(element => {
      data.push((element.marks/element.noOfQuestionInQuiz)*100)
      labels.push(element.quizName);
    });

    dataset = {
      label : 'Quiz Marks Evelution',
      data : data,
      backgroundColor : ['rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)',
                         'rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)',
                         'rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)','rgba(75, 192, 192)'
                        ],
      
    }

    this.classFeeChartData = {
      labels : labels,
      datasets : [dataset]
    }

    this.basicOptions = {
      plugins: {
          legend: {
              labels: {
                  color: 'black',
                  font: {
                    size: 25 
                  }
              }
          }
      },
      scales: {
          y: {
              beginAtZero: true,
              ticks: {
                  color: 'black'
              },
              grid: {
                  drawBorder: false
              }
          },
          x: {
              ticks: {
                  color: 'black'
              },
              grid: {
                  drawBorder: false
              },

              barThickness: 2
          }
      }
    };
  }

  getLoginData(){
    let loginData : any = this.localStorageService.getItem('login');
    this.logedDetails = JSON.parse(loginData)
    this.loggedUserId = this.logedDetails?.id ? this.logedDetails.id : 0;
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

  filterByCourse(){
    let filteredStudentQuizReportData : StudentQuizReportvm[]=[]
    this.studentQuizReportDataAll.forEach(element => {
      this.selectedCourses.forEach(ele => {
        if(element.courseCode == ele.code){
          filteredStudentQuizReportData.push(element)
        }
      });
    });
    
    this.studentQuizReportData = filteredStudentQuizReportData;
    this.setPDFData()

  }

  getMarlAsPrecentage(mark : number=0 , noOfQuestions : number=1){
    return (mark/noOfQuestions)*100;
  }

  
}
